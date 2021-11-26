import Navbar from "../components/Navbar";
import { usePostsQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  const { data } = usePostsQuery();

  return (
    <>
      <Navbar />
      {!data ? (
        <div>loading....</div>
      ) : (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      )}
    </>
  );
};

export default withApollo({ ssr: true })(Index);
