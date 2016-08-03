import React from 'react';
import ReactDom from 'react-dom';
import Container from './Container';
import './css/index.css';
const div = document.createElement('div');
const container = <Container/>;
document.body.appendChild(div);
const elemetnt = ReactDom.render(container, div);
/**
 * 导出方法
 */
export default {
    display(node, options) {
        elemetnt.addLayout(node, options);
    }
};
