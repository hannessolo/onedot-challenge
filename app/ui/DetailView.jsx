import React from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import styled from "styled-components";
import issues from "../business/issue.js";
import { MdSync, MdLink, MdCallSplit, MdErrorOutline, MdArrowBack, MdClose } from 'react-icons/md';

const Title = styled.h1`
  font-family: "Raleway", sans-serif;
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
  font-family: "Raleway", sans-serif;
  display: flex;
  flex-direction: row;
  background-color: ${props => (props.issues > 0 ? "#fa5c28" : "white")};

  :hover {
    background: gray;
  }
`;

const KeyValue = styled.input`
  font-size: 16pt;
  font-family: "Raleway", sans-serif;
  padding: 0.5em;
  border: none;
  border-radius: 3px;
`;

const Key = styled(KeyValue)`
  flex-basis: 50%;
  margin-right: 5px;
`;

const Value = styled(KeyValue)`
  flex-basis: 50%;
  margin-left: 5px;
`;

const Error = styled.div`
  display: ${props => (props.visible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
`;

const BackButton = styled.span`
  float: left;
  text-decoration: none;
  color: black;
`;

const DeleteButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`;

const CreateItem = styled(DetailItem)`
  background-color: ${props => props.disabled ? 'lightgray' : 'white'};

  :hover {
    background-color: ${props => props.disabled ? 'light-gray' : 'dark-gray'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }
`;

export default function DetailView({ dict, dispatch }) {
  function update(id, key, value) {
    dispatch({
      type: "update",
      payload: {
        id,
        key,
        value,
        dict
      }
    });
  }

  function create() {
    if (dict.hasCycle) {
      console.log('cannot create - has cycle');
      return;
    }

    dispatch({
      type: "create",
      payload: {
        dict
      }
    });
  }

  function deleteItem(id) {
    dispatch({
      type: 'delete',
      payload: {
        dict,
        id
      }
    })
  }

  return (
    <AlignCenter>
      <Title><BackButton><Link to=''><MdArrowBack /></Link></BackButton>{dict.name}</Title>
      <DetailContainer>
        {Object.entries(dict.kvpairs).map(([id, kvpair]) => (
          <DetailItem key={id} issues={kvpair.issues.length}>
            <Key
              type="text"
              defaultValue={kvpair.key}
              onChange={e => update(id, e.target.value, kvpair.value)}
            />
            <Value
              type="text"
              defaultValue={kvpair.value}
              onChange={e => update(id, kvpair.key, e.target.value)}
            />
            <DeleteButton onClick={() => deleteItem(id)} title="delete">
              <MdClose />
            </DeleteButton>
            <Error title="duplicate"
              visible={kvpair.issues.reduce(
                (acc, cur) => acc || cur.type == issues.DUPLICATE,
                false
              )}
            >
              <MdErrorOutline />
            </Error>
            <Error title="fork"
              visible={kvpair.issues.reduce(
                (acc, cur) => acc || cur.type == issues.FORK,
                false
              )}
            >
              <MdCallSplit />
            </Error>
            <Error title="chain"
              visible={kvpair.issues.reduce(
                (acc, cur) => acc || cur.type == issues.CHAIN,
                false
              )}
            >
              <MdLink />
            </Error>
            <Error title="cycle"
              visible={kvpair.issues.reduce(
                (acc, cur) => acc || cur.type == issues.CYCLE,
                false
              )}
            >
              <MdSync />
            </Error>
          </DetailItem>
        ))}
        <CreateItem onClick={create} disabled={dict.hasCycle}>Add pair...</CreateItem>
      </DetailContainer>
    </AlignCenter>
  );
}
