import styled from "styled-components";
const StyledAudio = styled.audio`
  border-radius: 8px;
  max-height: 100px;
`;
export const Audio = (props: React.AudioHTMLAttributes<HTMLAudioElement>) => {
  return <StyledAudio {...props} />;
};