import { Post } from "../entities/post";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
  FieldResolver,
  Int,
  Root,
  ObjectType,
} from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middlewares/isAuth";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/updoot";

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field()
  content: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.content.slice(0, 50);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const { userId } = req.session;

    const isUpdoot = value !== -1;

    const realValue = isUpdoot ? 1 : -1;

    const updoot = await Updoot.findOne({ postId, userId });

    if (updoot && updoot.value !== realValue) {
      await getConnection()
        .getRepository(Updoot)
        .createQueryBuilder("updoot")
        .update(Updoot)
        .set({
          value: realValue,
        })
        .where("postId = :postId", { postId })
        .execute();

      await getConnection()
        .getRepository(Post)
        .createQueryBuilder("post")
        .update(Post)
        .set({
          points: () => `points + ${realValue * 2}`,
        })
        .where("id = :postId", { postId })
        .execute();
    } else if (!updoot) {
      await Updoot.insert({
        userId,
        postId,
        value: realValue,
      });

      await getConnection()
        .getRepository(Post)
        .createQueryBuilder("post")
        .update(Post)
        .set({
          points: () => `points + ${realValue}`,
        })
        .where("id = :postId", { postId })
        .execute();
    }

    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const query = getConnection()
      .getRepository(Post)
      .createQueryBuilder("post")
      .innerJoinAndSelect("post.author", "user", "user.id = post.authorId")
      .orderBy("post.created_at", "DESC")
      .take(realLimitPlusOne);

    if (cursor) {
      query.where("post.created_at < :cursor", {
        cursor: new Date(parseInt(cursor)),
      });
    }

    const posts = await query.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length == realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id") id: number): Promise<Post | undefined> {
    return await Post.findOne({ id });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("values") values: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    const post = await Post.create({
      ...values,
      authorId: req.session.userId,
    }).save();

    return post;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | undefined> {
    const post = await Post.findOne({ id });

    if (!post) {
      return undefined;
    }

    await Post.update({ id }, { title });

    const updatedPost = await Post.findOne({ id });

    return updatedPost;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(@Arg("id") id: number): Promise<Boolean> {
    const post = await Post.findOne({ id });

    if (!post) {
      return false;
    }

    await Post.delete({ id });

    return true;
  }
}
