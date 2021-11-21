import { Container } from "@chakra-ui/layout";

interface WrapperProps {}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <Container maxW="container.xl" pt={8}>
      {children}
    </Container>
  );
};

export default Wrapper;
