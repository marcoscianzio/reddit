import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Post } from "./post";
import { Updoot } from "./updoot";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  email: String;

  @Field(() => String)
  @Column({ unique: true })
  username: String;

  @Column()
  password: String;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots: Updoot[];

  @Field(() => Date)
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
