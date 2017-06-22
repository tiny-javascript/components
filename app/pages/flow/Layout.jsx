import React from 'react';
import controller from './controllers/index';
import EventModel from './models/EventModel';
import TaskModel from './models/TaskModel';
import ManagerModel from './models/ManagerModel';
import LinkModel from './models/LinkModel';
import * as Constant from './constants';
import { array2map, map2array, queryId, getLinkPointAxis, remove } from './utils';
const migration = {
    source: "",
    active: false,
    begin: { x: 0, y: 0 }, // 鼠标落下的坐标
    origin: { x: 0, y: 0 },// 初始坐标，拖动画布使用
}
export default class Layout extends React.Component {
    static defaultProps = {
        x: 0,
        y: 0,
        onLink: function () { },
        onDelete: function () { },
        onSelect: function () { }
    }
    state = {
        x: this.props.x,
        y: this.props.y,
        line: { x1: 0, y1: 0, x2: 0, y2: 0 },
        element: null,
        elements: new Map(),
        status: Constant.LAYOUT_STATUS_EDIT
    }
    _deleteLine(line) {
        let { elements } = this.state;
        let prev = elements.get(line.prevs[0]);
        let next = elements.get(line.nexts[0]);
        prev.nexts = remove(prev.nexts, item => item.id == line.id);
        next.prevs = remove(next.prevs, item => item.id == line.id);
        line.prevs = [];
        line.nexts = [];
        this.props.onDelete(line);
    }
    _delete() {
        let { element, elements } = this.state;
        if (!element) {
            return;
        }
        if (element.type == Constant.ELEMENT_TYPE_EVENT) {
            return;
        }
        if (element.type == Constant.ELEMENT_TYPE_LINK) {
            this._deleteLine(element);
        } else {
            let lines = element.prevs.concat(element.nexts);
            console.log(lines)
            lines.forEach(item => {
                let line = elements.get(item.id);
                this._deleteLine(line);
                elements.delete(line.id);
            });
            this.props.onDelete(element);
        }
        elements.delete(element.id);
        this.setState({ elements });
    }
    _link(source, target) {
        let { elements } = this.state;
        let sourcePoint = getLinkPointAxis(source, Constant.POSITION_RIGHT);
        let targetPoint = getLinkPointAxis(target, Constant.POSITION_LEFT);
        let model = new LinkModel();
        model.attrs.x1 = sourcePoint[0];
        model.attrs.y1 = sourcePoint[1];
        model.attrs.x2 = targetPoint[0];
        model.attrs.y2 = targetPoint[1];
        model.prevs = [source.id];
        model.nexts = [target.id];
        source.nexts.push({ id: model.id, position: Constant.POSITION_RIGHT });
        target.prevs.push({ id: model.id, position: Constant.POSITION_LEFT });
        elements.set(model.id, model);
        this.setState({ elements });
    }
    _getEvents() {
        if (this.state.status == Constant.LAYOUT_STATUS_READONLY) {
            return {};
        }
        return {
            onClick: this._onClick.bind(this),
            onKeyUp: this._onKeyUp.bind(this),
            onMouseUp: this._onMouseUp.bind(this),
            onMouseMove: this._onMouseMove.bind(this),
            onMouseDown: this._onMouseDown.bind(this)
        }
    }
    _elementMove(id) {
        let model = this.state.elements.get(id);
        let change = (line, isBegin) => {
            let [x, y] = getLinkPointAxis(model, line.position);
            this.refs[line.id].setPoint(x, y, isBegin);
        }
        model.prevs.forEach(line => change(line, false));
        model.nexts.forEach(line => change(line, true));
    }
    _onElementMove(id) {
        setTimeout(this._elementMove.bind(this, id), 10);
    }
    _onKeyUp(e) {
        if (e.keyCode == 8 || e.keyCode == 46) {
            this._delete();
        }
    }
    _onClick(e) {
        let { elements, element } = this.state;
        let id = queryId(e.target);
        let model = elements.get(id);
        this.props.onSelect(model);
        this.setState({ element: model });
    }
    _onMouseDown(e) {
        let { x, y, status, line, elements } = this.state;
        let id = queryId(e.target);
        migration.source = elements.get(id);
        migration.active = true;
        migration.begin.x = e.clientX;
        migration.begin.y = e.clientY;
        switch (status) {
            case Constant.LAYOUT_STATUS_EDIT:
                migration.origin.x = x;
                migration.origin.y = y;
                break;
            case Constant.LAYOUT_STATUS_LINK:
                // 必须从节点开始连接
                if (!migration.source) {
                    migration.active = false;
                    return;
                }
                // 不能从结束节点开始连接
                if (migration.source.type == Constant.ELEMENT_TYPE_EVENT && migration.source.subType == Constant.ELEMENT_TYPE_EVENT_OVER) {
                    migration.active = false;
                    migration.source = void 0;
                    return;
                }
                let rect = this.refs.svg.getBoundingClientRect();
                line.x1 = e.clientX - rect.left;
                line.y1 = e.clientY - rect.top;
                migration.origin.x = line.x1;
                migration.origin.y = line.y1;
                break;
        }
    }
    _onMouseMove(e) {
        if (!migration.active) {
            return;
        }
        let { status, line, x, y } = this.state;
        let ex = migration.origin.x + e.clientX - migration.begin.x;
        let ey = migration.origin.y + e.clientY - migration.begin.y;
        switch (status) {
            case Constant.LAYOUT_STATUS_EDIT:
                this.setState({ x: ex, y: ey });
                break;
            case Constant.LAYOUT_STATUS_LINK:
                line.x2 = ex - 5;
                line.y2 = ey + 5;
                this.setState({ line });
                break;
        }
    }
    _onMouseUp(e) {
        migration.active = false;
        let id = queryId(e.target);
        let target = this.state.elements.get(id);
        if (this.state.status == Constant.LAYOUT_STATUS_LINK) {
            let state = { line: { x1: 0, y1: 0, x2: 0, y2: 0 } };
            // 必须在节点上结束
            if (!target) {
                this.setState(state);
                return;
            }
            // 不能在开始节点上结束
            if (target.type == Constant.ELEMENT_TYPE_EVENT && target.subType == Constant.ELEMENT_TYPE_EVENT_START) {
                this.setState(state);
                return;
            }
            if (migration.source) {
                this._link(migration.source, target);
                state.status = Constant.LAYOUT_STATUS_EDIT;
            }
            this.setState(state);
        }
    }
    render() {
        let { width, height } = this.props;
        let { x, y, elements, element, status, line } = this.state;
        let events = this._getEvents();
        let data = map2array(elements);
        return (
            <svg ref="svg" id="svg" className={'flow ' + status} width={width} height={height} {...events} tabIndex="-1">
                <g id="container" transform={"translate(" + x + "," + y + ")"}>
                    {data.map(model => {
                        let Controller = controller(model.type);
                        let active = element && model.id == element.id;
                        return <Controller key={model.id} ref={model.id} data={model} active={active} layoutStatus={status} onMove={this._onElementMove.bind(this)} />
                    })}
                </g>
                <line className="auxiliary" {...line}></line>
            </svg>
        )
    }
    shouldComponentUpdate(props, state) {
        return this.state != state;
    }
    componentWillMount() {
        let { elements } = this.state;
        let startModel = new EventModel({ name: '开始' }, Constant.ELEMENT_TYPE_EVENT_START);
        let overModel = new EventModel({ name: '结束' }, Constant.ELEMENT_TYPE_EVENT_OVER);
        elements.set(startModel.id, startModel);
        elements.set(overModel.id, overModel);
    }
    add(type) {
        let { x, y } = this.state;
        return new Promise((resolve, reject) => {
            let model = null;
            let { elements } = this.state;
            if (type == Constant.ELEMENT_TYPE_TASK) {
                model = new TaskModel();
            }
            if (type == Constant.ELEMENT_TYPE_MANAGER) {
                model = new ManagerModel();
            }
            model.attrs = { x: 10 - x, y: 10 - y };
            elements.set(model.id, model);
            this.setState({ elements }, () => {
                resolve(model.id);
            });
        });
    }
    setStatus(status) {
        this.setState({ status });
    }
}