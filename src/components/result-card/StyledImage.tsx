import styled from "styled-components";
import Image from "next/image";

const StyledImage = styled(Image)`
  border-radius: 8px;
  max-height: 100px;
`;

export { StyledImage };

/* TODO: Understand best practices for storing styled components, not sure this should live in the list directory */