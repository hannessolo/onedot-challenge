import React from 'react';
import DictsProvider from '../services/DictsProvider.jsx';
import Dictionary from '../business/dictionary.js';

export default function App({ children }) {
  return <DictsProvider initialState={[
    new Dictionary('iPhone Colors'),
    new Dictionary('Samsung Colors')
  ]}>
    { children }
  </DictsProvider>
}
