import { Button, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

const CreatePost: React.FC<{}> = ({}) => {
  useIsAuth();
  const [createPost] = useCreatePostMutation();
  const router = useRouter();

  return (
    <Layout>
      <Formik
        initialValues={{ title: "", content: "" }}
        onSubmit={async (values, { resetForm }) => {
          const { errors } = await createPost({
            variables: {
              values,
            },
            update: (cache) => {
              resetForm();
              cache.evict({ fieldName: "posts" });
            },
          });

          if (!errors) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting, dirty }) => (
          <Stack as={Form} spacing={4}>
            <InputField
              name="title"
              placeholder="Enter the title of your post"
              label="The title"
            />
            <InputField
              name="content"
              textArea
              placeholder="Enter the content of your post"
              label="The content"
            />
            <Button
              mt={4}
              disabled={!dirty}
              colorScheme="orange"
              loadingText="Creating post..."
              isLoading={isSubmitting}
              type="submit"
            >
              Create post
            </Button>
          </Stack>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo()(CreatePost);
