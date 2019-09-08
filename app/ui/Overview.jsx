import React, { useContext, useState } from "react";
import styled from "styled-components";
import { DictsContext } from "../services/DictsProvider.jsx";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { MdCheck, MdClose } from "react-icons/md";

const StyledOverview = styled.div`
  position: relative;
  top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-family: "Raleway", sans-serif;
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
  font-family: "Raleway", sans-serif;
  display: flex;

  :hover {
    background: gray;
    cursor: 'pointer';
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  flex-basis: 100%;
  color: black;
`;

const DictNameBox = styled.input`
  font-size: 16pt;
  font-family: "Raleway", sans-serif;
  padding: 0.5em;
  border: none;
  border-radius: 3px;
  flex-basis: 100%;
`;

const CreateNewDict = styled.div`
  display: flex;
  align-items: center;
`;

const CreateNewDictButton = styled.div`
  padding: 5px;
  transform: scale(1.2);
`;

const DeleteButton = styled.div`
  align-self: flex-end;
`;

export default function Overview(props) {
  const [dicts, dispatch] = useContext(DictsContext);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  function newDictionary() {
    setCreating(false);
    dispatch({
      type: 'newDict',
      payload: {
        name
      }
    });
  }

  function deleteDictionary(name) {
    dispatch({
      type: 'deleteDict',
      payload: {
        name
      }
    })
  }

  return (
    <StyledOverview>
      <Title>Dictionary Overview</Title>
      <TableContainer>
        {dicts.map(dict => (
          <TableRow key={dict.name}>
            <StyledLink to={`/detail/${dict.name}`}>{dict.name}</StyledLink>
            <DeleteButton onClick={() => deleteDictionary(dict.name)}><MdClose /></DeleteButton>
          </TableRow>
        ))}
        {!creating || (
          <TableRow>
            <CreateNewDict>
              <DictNameBox onChange={e => setName(e.target.value)} />
              <CreateNewDictButton onClick={() => setCreating(false)}>
                <MdClose />
              </CreateNewDictButton>
              <CreateNewDictButton onClick={newDictionary}>
                <MdCheck />
              </CreateNewDictButton>
            </CreateNewDict>
          </TableRow>
        )}
        {creating || (
          <TableRow onClick={() => setCreating(true)}>Create new...</TableRow>
        )}
      </TableContainer>
    </StyledOverview>
  );
}
