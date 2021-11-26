import { User } from "../entities/user";
import { UsernamePassword } from "../inputs/user";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { userSchema } from "../validators/user";
import { format } from "../validators/formatter";
import { MyContext } from "../types";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { FORGET_PASSWORD_PREFIX } from "../constants";

@ObjectType()
class PathError {
  @Field()
  path: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [PathError], { nullable: true })
  errors?: PathError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { req, redis }: MyContext
  ) {
    const user = await User.findOne({ email });

    if (!user) {
      return false;
    }

    const token = v4();

    redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    );

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );

    return true;
  }

  @Query(() => User, { nullable: true })
  async Me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    if (!req.session.userId) {
      return undefined;
    } else {
      const user = await User.findOne(req.session.userId);

      return user;
    }
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePassword,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    try {
      console.log("a");
      await userSchema.validate(options, { abortEarly: false });
    } catch (error) {
      return format(error);
    }

    const userAlreadyExist = await User.findOne({ username: options.username });

    if (userAlreadyExist) {
      return {
        errors: [
          {
            path: "username",
            message: "Username already exists",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);

    const user = await User.create({
      email: options.email,
      username: options.username,
      password: hashedPassword,
    }).save();

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : {
            username: usernameOrEmail,
          }
    );

    if (!user) {
      return {
        errors: [
          {
            path: "username",
            message: "Username doesn't exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password as string, password);

    if (!valid) {
      return {
        errors: [
          {
            path: "password",
            message: "Password incorrect",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie("qid");
        if (err) {
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
