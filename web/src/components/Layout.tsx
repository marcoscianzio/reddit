import Navbar from "./Navbar";
import Wrapper from "./Wrapper";

const Layout: React.FC<{}> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Wrapper>{children}</Wrapper>
    </>
  );
};

export default Layout;
