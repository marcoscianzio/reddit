import { Stack, Button } from "@chakra-ui/react";

import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const [register] = useRegisterMutation();
  const router = useRouter();

  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: {
              values,
            },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
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
              isLoading={isSubmitting}
              type="submit"
            >
              Register
            </Button>
          </Stack>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
