import React from 'react';
import controller from './controllers/index';
import EventModel from './models/EventModel';
import TaskModel from './models/TaskModel';
import * as Constant from './constants';
import { array2map, map2array, queryId } from './utils';
const migration = {
    id: "",
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
    _delete() { }
    _link(source, target) { }
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
        let { x, y, status, line } = this.state;
        let id = queryId(e.target);
        migration.id = id;
        migration.active = true;
        migration.begin.x = e.clientX;
        migration.begin.y = e.clientY;
        switch (status) {
            case Constant.LAYOUT_STATUS_EDIT:
                migration.origin.x = x;
                migration.origin.y = y;
                break;
            case Constant.LAYOUT_STATUS_LINK:
                let rect = this.refs.svg.getBoundingClientRect();
                migration.origin.x = e.clientX - rect.left - x;
                migration.origin.y = e.clientY - rect.top - y;
                line.x1 = migration.origin.x;
                line.y1 = migration.origin.y;
                break;
        }
    }
    _onMouseMove(e) {
        if (!migration.active) {
            return;
        }
        let { status, line } = this.state;
        let x = migration.origin.x + e.clientX - migration.begin.x;
        let y = migration.origin.y + e.clientY - migration.begin.y;
        switch (status) {
            case Constant.LAYOUT_STATUS_EDIT:
                this.setState({ x, y });
                break;
            case Constant.LAYOUT_STATUS_LINK:
                line.x2 = x;
                line.y2 = y;
                this.setState({ line });
                break;
        }
    }
    _onMouseUp(e) {
        migration.active = false;
        if (this.state.status == Constant.LAYOUT_STATUS_LINK) {
            this.setState({ line: { x1: 0, y1: 0, x2: 0, y2: 0 }, status: Constant.LAYOUT_STATUS_EDIT });
        }
    }
    render() {
        let { width, height } = this.props;
        let { x, y, elements, element, status, line } = this.state;
        let events = this._getEvents();
        let data = map2array(elements);
        return (
            <svg ref="svg" id="svg" className={'flow ' + status} width={width} height={height} {...events} tabIndex="-1">
                <g ref="container" className="flow-container" transform={"translate(" + x + "," + y + ")"}>
                    {data.map(model => {
                        let Controller = controller(model.type);
                        let active = element && model.id == element.id;
                        return <Controller key={model.id} data={model} active={active} layoutStatus={status} />
                    })}
                    <line className="auxiliary" {...line}></line>
                </g>
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