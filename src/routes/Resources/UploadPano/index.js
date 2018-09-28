import React from 'react';
import { Switch, Redirect, Route } from 'dva/router';
import { getRoutes } from 'utils/utils';

function UploadPanorama(props) {
  const { routerData, match } = props;
  const routes = getRoutes(match.path, routerData);
  return (
    <Switch>
      <Redirect exact from="/resources/upload-pano" to="/resources/upload-pano/step1" />
      {routes.map(route => (
        <Route key={route.key} exact={route.exact} path={route.path} component={route.component} />
      ))}
    </Switch>
  );
}

export default UploadPanorama;
