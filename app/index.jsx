import React from 'react';
import { render } from 'react-dom';
import App from './ui/App.jsx';
import Routes from './ui/Routes.jsx';

render(
  <App>
    <Routes />
  </App>, document.getElementById('app'));
