import styled from '@emotion/styled';

export const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

export const Name = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  display: inline-block;
  color: #fff;
  padding: 0.3rem 0.6rem;
`;
