import React from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { getRoutes } from 'utils/utils';

const Overview = ({ match, routerData, location }) => (
  <div>
    <Switch>
      {getRoutes(match.path, routerData).map(item => (
        <Route key={item.key} exact={item.exact} path={item.path} component={item.component} />
      ))}
      <Redirect exact from={match.path} to={`${match.path}/published/courseware`} />
    </Switch>
  </div>
);

export default Overview;
