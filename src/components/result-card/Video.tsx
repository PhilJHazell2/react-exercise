import styled from "styled-components";

const StyledVideo = styled.video`
  border-radius: 8px;
`;

export const Video = (props: React.VideoHTMLAttributes<HTMLVideoElement>) => {
  return <StyledVideo {...props} />;
};