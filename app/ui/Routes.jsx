import React, { useContext } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { DictsContext } from '../services/DictsProvider.jsx';
import Overview from './Overview.jsx';
import DetailView from './DetailView.jsx';

export default function Routes() {
  const [dicts, _] = useContext(DictsContext);

  return (
    <Router>
      <Route exact path='/' component={Overview} />
      {
        dicts.map(dict => <Route key={dict.name} exact path={`/detail/${dict.name}`} render={(props) => <DetailView {...props} dict={dict} />} />)
      }
    </Router>
  )
}
