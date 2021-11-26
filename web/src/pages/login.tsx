import { Stack, Button } from "@chakra-ui/react";

import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const [Login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await Login({
            variables: {
              values,
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
            router.replace("/");
          }
        }}
      >
        {({ isSubmitting, dirty }) => (
          <Stack as={Form} spacing={4}>
            <InputField
              name="username"
              placeholder="Enter your username"
              label="Your username"
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
          </Stack>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo()(Login);
