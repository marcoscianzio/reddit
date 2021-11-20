import { Field, InputType } from "type-graphql";

@InputType()
export class UsernamePassword {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}
