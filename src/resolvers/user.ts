import { User } from "../entities/user";
import { UsernamePassword } from "../inputs/user";
import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from "argon2";
import { userSchema } from "../validators/user";
import { format } from "../validators/formatter";

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
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePassword
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
      username: options.username,
      password: hashedPassword,
    }).save();

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePassword
  ): Promise<UserResponse> {
    const user = await User.findOne({ username: options.username });

    if (!user) {
      return {
        errors: [
          {
            path: "username",
            message: "Username incorrect",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, options.password);

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

    return { user };
  }
}
