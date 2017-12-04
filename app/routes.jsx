import React from 'react'
import { createHashHistory } from 'history'
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router'
import Layout from './layout'
import FlowPage from './pages/flow/Index'
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })
export default (
    <Router history={appHistory}>
        <Route path="/" component={Layout}>
            <IndexRoute component={FlowPage} />
            <Route path="flow" component={FlowPage} />
        </Route>
    </Router>
)
