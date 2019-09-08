import React, {useReducer} from 'react';
import Dictionary from '../business/dictionary.js';

const reducer = (state, action) => {
  switch (action.type) {
    case 'update': {
      let pl = action.payload;
      pl.dict.remove(pl.id);
      pl.dict.put(pl.key, pl.value, pl.id);
      return [...state];
    }
    case 'create':
      action.payload.dict.put('', '', action.payload.dict.size);
      return [...state];
    case 'newDict':
      state.push(new Dictionary(action.payload.name));
      return [...state];
    case 'delete': {
      let pl = action.payload;
      pl.dict.remove(pl.id);
      return [...state];
    }
    default:
      return state;
  }
}

export const DictsContext = React.createContext();

export default function DictsProvider(props) {

  return <DictsContext.Provider value={useReducer(reducer, props.initialState)}>
    { props.children }
  </DictsContext.Provider>
}
