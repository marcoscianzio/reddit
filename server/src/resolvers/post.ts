import { Post } from "../entities/post";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    const posts = await Post.find();

    return posts;
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id") id: number): Promise<Post | undefined> {
    const post = await Post.findOne({ id });

    return post;
  }

  @Mutation(() => Post)
  async createPost(@Arg("title") title: string): Promise<Post> {
    const post = await Post.create({ title }).save();

    return post;
  }

  @Mutation(() => Post, { nullable: true })
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
  async deletePost(@Arg("id") id: number): Promise<Boolean> {
    const post = await Post.findOne({ id });

    if (!post) {
      return false;
    }

    await Post.delete({ id });

    return true;
  }
}
