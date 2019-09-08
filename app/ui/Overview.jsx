import React, { useContext } from 'react';
import styled from 'styled-components';
import { DictsContext } from '../services/DictsProvider.jsx';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const StyledOverview = styled.div`
  position: relative;
  top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-family: 'Raleway', sans-serif;
`;

const TableContainer = styled.div`
  width: 80%;
  max-width: 800px;
  border: 2px solid gray;
  border-radius: 5px;
`;

const TableRow = styled.div`
  padding: 10px;
  font-size: 16pt;
  font-family: 'Raleway', sans-serif;

  :hover {
    background: gray;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

export default function Overview(props) {

  const [dicts, _] = useContext(DictsContext);

  return (
      <StyledOverview>
        <Title>Dictionary Overview</Title>
        <TableContainer>
          { dicts.map(dict => (
            <TableRow key={dict.name}>
              <StyledLink to={`/detail/${dict.name}`}>
                { dict.name }
              </StyledLink>
            </TableRow>
          )) }
        </TableContainer>
      </StyledOverview>
  );
}
