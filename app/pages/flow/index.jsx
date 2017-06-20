import React from 'react';
import { LAYOUT_WIDTH, LAYOUT_HEIGHT, LAYOUT_STATUS_LINK, ELEMENT_TYPE_TASK } from './constants';
import Layout from './layout';
import './index.css';
let layout = null;
export default class Flow extends React.Component {
    state = {
        data: null,
        graph: { x: 0, y: 0, nodes: [] },
        element: null
    }
    /**
     * 将服务器数据解析成操作数据
     */
    _parse(data) {
        let tasks = new Map();
        let links = new Map();
        data.forEach(item => {
            let task = this._createElement(item.graphKey);
            task.name = item.name;
            task.type = item.type;
            tasks.set(item.graphKey, task);
            item.nexts.forEach(next => {
                let link = this._createElement(next.graphKey);
                link.name = next.name;
                link.data = {
                    prev: item.graphKey,
                    next: next.task.graphKey
                }
                links.set(next.graphKey, link);
            });
        });
        return { tasks, links };
    }
    /**
     * 将操作数据还原成服务器数据
     */
    _reset() {
        let data = [];
        let dataMap = new Map();
        dataMap.set('start', {
            name: 'start',
            graphKey: 'start',
            prevs: [],
            nexts: []
        });
        let { tasks, links } = this.state.data;
        tasks.forEach(task => {
            dataMap.set(task.graphKey, {
                name: task.name,
                code: task.graphKey,
                graphKey: task.graphKey,
                type: task.type,
                prevs: [],
                nexts: []
            });
        });
        links.forEach(link => {
            let prevTask = dataMap.get(link.data.prev);
            let nextTask = dataMap.get(link.data.next);
            prevTask.nexts.push({
                name: link.name,
                graphKey: link.graphKey,
                task: {
                    code: nextTask.code,
                    graphKey: nextTask.graphKey
                },
                condExpr: []
            });
            nextTask.prevs.push({
                task: {
                    code: prevTask.code,
                    graphKey: prevTask.graphKey
                }
            });
        });
        dataMap.forEach(item => data.push(item));
        return data;
    }
    /**
     * 将操作数据翻译成图形数据
     */
    _translate() { }
    _onAdd() {
        layout.add(ELEMENT_TYPE_TASK).then((id) => {
            console.log('add:', ELEMENT_TYPE_TASK, id);
        });
    }
    _onLink(id, source, target) {
        let link = this._createElement(id);
        link.data.prev = source;
        link.data.next = target;
        this.state.data.links.set(id, link);
    }
    _onDelete(shape) { }
    _onSelect(element) {
        // console.log(element)
    }
    _onSetLink() {
        layout.setStatus(LAYOUT_STATUS_LINK);
    }
    render() {
        let { element, graph, data } = this.state;
        let events = {
            onLink: this._onLink.bind(this),
            onDelete: this._onDelete.bind(this),
            onSelect: this._onSelect.bind(this)
        };
        graph = JSON.parse(JSON.stringify(graph));
        return (
            <div className="content">
                <form className="form-inline">
                    <button type="button" className="btn btn-default" onClick={this._onAdd.bind(this)}>添加任务</button>
                    <button type="button" className="btn btn-info" onClick={this._onSetLink.bind(this)}>连接</button>
                </form>
                <div className="layout">
                    <Layout ref="layout" x={graph.x} y={graph.y} width={LAYOUT_WIDTH} height={LAYOUT_HEIGHT} data={graph.nodes} {...events} />
                </div>
            </div>
        )
    }
    componentDidMount() {
        layout = this.refs.layout;
    }
}
