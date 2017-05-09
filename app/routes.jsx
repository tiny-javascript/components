import React from 'react';
import {createHashHistory} from 'history';
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import IndexPage from 'pages/index/index';
const appHistory = useRouterHistory(createHashHistory)({queryKey: false});
export default(
    <Router history={appHistory}>
        <Route path="/">
            <IndexRoute component={IndexPage}/>
        </Route>
    </Router>
);
