import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/alert";
import { Button } from "@chakra-ui/button";
import { Link, Stack } from "@chakra-ui/layout";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { withApollo } from "../../utils/withApollo";

const ChangePassword: NextPage = () => {
  const [changePassword] = useChangePasswordMutation();
  const router = useRouter();

  const [tokenError, setTokenError] = useState("");

  return (
    <Wrapper>
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);

            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }

            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.replace("/");
          }
        }}
      >
        {({ isSubmitting, dirty }) => (
          <Stack as={Form} spacing={4}>
            <InputField
              name="newPassword"
              placeholder="Enter your new password"
              label="New password"
              type="password"
            />
            {tokenError ? (
              <Alert
                status="error"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
              >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  {tokenError}
                </AlertTitle>
                <NextLink href="/forgot-password">
                  <AlertDescription>
                    <Link>go forget it again</Link>
                  </AlertDescription>
                </NextLink>
              </Alert>
            ) : null}
            <Button
              mt={4}
              disabled={!dirty}
              colorScheme="orange"
              loadingText="Changing password"
              isLoading={isSubmitting}
              type="submit"
            >
              Change password
            </Button>
          </Stack>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo()(ChangePassword);
