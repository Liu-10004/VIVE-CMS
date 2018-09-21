import React from 'react';
import { Switch, Redirect, Route } from 'dva/router';
import { getRoutes } from 'utils/utils';

function UploadCourseware(props) {
  const { routerData, match } = props;
  const routes = getRoutes(match.path, routerData);
  return (
    <Switch>
      <Redirect exact from="/resources/upload-courseware" to="/resources/upload-courseware/step1" />
      {routes.map(route => (
        <Route key={route.key} exact={route.exact} path={route.path} component={route.component} />
      ))}
    </Switch>
  );
}

export default UploadCourseware;
