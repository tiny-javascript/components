import 'babel-polyfill'
import React from 'react'
import ReactDom from 'react-dom'
import routes from './routes'
// 导入css
import './styles/index.less'
ReactDom.render(routes, document.getElementById('root'))
