import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  title: String;

  @Field(() => Date)
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
