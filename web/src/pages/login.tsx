import { Button, HStack, Link, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withApollo } from "../utils/withApollo";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const [Login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await Login({
            variables: {
              usernameOrEmail: values.usernameOrEmail,
              password: values.password,
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  Me: data?.login.user,
                },
              });
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting, dirty }) => (
          <Stack as={Form} spacing={4}>
            <InputField
              name="usernameOrEmail"
              placeholder="Enter your username or email"
              label="Your username or email"
            />
            <InputField
              name="password"
              placeholder="Enter your password"
              label="Your password"
              type="password"
            />
            <Button
              mt={4}
              disabled={!dirty}
              colorScheme="orange"
              loadingText="Logging..."
              isLoading={isSubmitting}
              type="submit"
            >
              Login
            </Button>
            <HStack justify="center">
              <NextLink href="/forgot-password">
                <Link>Forget your password?</Link>
              </NextLink>
            </HStack>
          </Stack>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo()(Login);
