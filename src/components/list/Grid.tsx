import styled from "styled-components";

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
`;

export { StyledGrid };

/* TODO: Understand best practices for storing styled components, not sure this should live in the list directory */