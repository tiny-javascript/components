import React from 'react';
import uuid from 'uuid';
import Layout from './Layout';
import {LAYOUT_WIDTH, LAYOUT_HEIGHT, CIRCLE_RADIUS} from './constants'
import {SHAPE_CIRCLE, SHAPE_RECT} from './constants'
import './index.css';
export default class Flow extends React.Component {
    state = {
        graph: {
            lines: [],
            shapes: []
        },
        relations: []
    }
    _onAddNode() {
        let {relations, graph} = this.state;
        let id = uuid.v4();
        let shape = {
            id,
            type: SHAPE_RECT,
            attrs: {
                x: 10,
                y: 10
            }
        }
        let relation = {
            id,
            prevs: [],
            nexts: []
        }
        graph.shapes.push(shape);
        relations.push(relation);
        this.refs.layout.addShape(shape);
    }
    _onLink(){
        this.refs.layout.setStatus(Layout.STATUS_LINKING);
    }
    render() {
        const data = JSON.parse(JSON.stringify(this.state.graph));
        return (
            <div className="content">
                <div className="action">
                    <button className="btn btn-default btn-sm" onClick={this._onAddNode.bind(this)}>添加任务</button>
                    <button className="btn btn-info btn-sm" onClick={this._onLink.bind(this)}>连接</button>
                </div>
                <div className="layout">
                    <Layout ref="layout" width={LAYOUT_WIDTH} height={LAYOUT_HEIGHT} data={data}/>
                </div>
            </div>
        )
    }
    componentWillMount() {
        let {relations, graph} = this.state;
        if (!relations.length) {
            // 没有关系就情况图形信息
            graph.lines = [];
            graph.shapes = [];
            // 生成起始点关系
            relations.push({id: 'start', prevs: [], next: []});
            // 生成起始点图形信息
            graph.shapes.push({
                id: 'start',
                type: SHAPE_CIRCLE,
                attrs: {
                    x: CIRCLE_RADIUS * 2,
                    y: LAYOUT_HEIGHT / 2 - CIRCLE_RADIUS,
                    r: CIRCLE_RADIUS
                }
            })
        }
    }
}
