import "babel-polyfill";
import React from 'react';
import ReactDom from 'react-dom';
import routes from './routes';
// 导入css
import 'styles/index.css';
// lodash全局变量
window._ = window.lodash = require('lodash');
ReactDom.render(routes, document.getElementById('root'));
