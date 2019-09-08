import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  font-family: 'Raleway', sans-serif;
`;

const DetailContainer = styled.div`
width: 80%;
max-width: 800px;
border: 2px solid gray;
border-radius: 5px;
`;

const AlignCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetailItem = styled.div`
padding: 10px;
font-size: 16pt;
font-family: 'Raleway', sans-serif;

:hover {
  background: gray;
}
`;

export default function DetailView(props) {
  return (<AlignCenter>
      <Title>{props.dict.name}</Title>
      <DetailContainer>
        <DetailItem>Add pair...</DetailItem>
      </DetailContainer>
    </AlignCenter>);
}
