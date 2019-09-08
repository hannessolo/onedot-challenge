import React from 'react';
import DictsProvider from '../services/DictsProvider.jsx';
import Dictionary from '../business/dictionary.js';

export default function App({ children }) {

  const iPhoneColors = new Dictionary('iPhone Colors');
  iPhoneColors.put('Space Gray', 'Gray', 0);
  iPhoneColors.put('Rose Gold', 'Gold', 1);
  const initialState = [
    iPhoneColors,
    new Dictionary('Samsung Colors')
  ]

  return <DictsProvider initialState={initialState}>
    { children }
  </DictsProvider>
}
