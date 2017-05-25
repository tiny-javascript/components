import React from 'react';
import uuid from 'uuid';
import Layout, { LAYOUT_WIDTH, LAYOUT_HEIGHT } from './layout';
import './index.css';
export default class Flow extends React.Component {
    state = {
        graphs: [],
        relations: []
    }
    _onAddNode() {
        let { relations, graphs } = this.state;
        this.refs.layout.add(shape => {
            let relation = {
                id: shape.id,
                prevs: [],
                nexts: []
            }
            graphs.push(shape);
            relations.push(relation);
        });
    }
    _onSetLink() {
        this.refs.layout.setStatus(Layout.STATUS_LINKING);
    }
    _onLink(id, from, to) { }
    _onDelete(id) {

    }
    render() {
        const data = JSON.parse(JSON.stringify(this.state.graphs));
        const events = {
            onLink: this._onLink.bind(this),
            onDelete: this._onDelete.bind(this)
        }
        return (
            <div className="content">
                <div className="action">
                    <button className="btn btn-default btn-sm" onClick={this._onAddNode.bind(this)}>添加任务</button>
                    <button className="btn btn-info btn-sm" onClick={this._onSetLink.bind(this)}>连接</button>
                </div>
                <div className="layout">
                    <Layout ref="layout" width={LAYOUT_WIDTH} height={LAYOUT_HEIGHT} data={data} {...events} />
                </div>
            </div>
        )
    }
}
