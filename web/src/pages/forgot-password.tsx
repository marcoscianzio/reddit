import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Stack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const [forgotPassword] = useForgotPasswordMutation();

  const [completed, setCompleted] = useState(false);

  return (
    <Wrapper>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword({
            variables: {
              ...values,
            },
          });

          setCompleted(true);
        }}
      >
        {({ isSubmitting, dirty }) =>
          completed ? (
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Submitted!
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                We sent you an email, please check it.
              </AlertDescription>
            </Alert>
          ) : (
            <Stack as={Form} spacing={4}>
              <InputField
                name="email"
                placeholder="Enter your email"
                label="Your email"
              />
              <Button
                mt={4}
                disabled={!dirty}
                colorScheme="orange"
                loadingText="Sending email"
                isLoading={isSubmitting}
                type="submit"
              >
                Send email
              </Button>
            </Stack>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withApollo()(ForgotPassword);
