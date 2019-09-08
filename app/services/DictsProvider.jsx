import React, {useReducer} from 'react';

const reducer = (state, action) => {
  return [];
}

export const DictsContext = React.createContext();

export default function DictsProvider(props) {

  return <DictsContext.Provider value={useReducer(reducer, props.initialState)}>
    { props.children }
  </DictsContext.Provider>
}
