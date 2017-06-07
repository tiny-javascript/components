import React from 'react';
import Rect from './graphs/rect';
import Line from './graphs/line';
import Circle from './graphs/circle';
import { createReat, createCircle, createLine, translate } from './utils';
import { setAttributes, queryInParents } from './node';
const LAYOUT_WIDTH = 1108;
const LAYOUT_HEIGHT = 500;
const SHAPE_WIDTH = 120;
const SHAPE_HEIGHT = 60;
const SHAPE_RECT = 'rect';
const SHAPE_CIRCLE = 'circle';
const SHAPE_LINE = 'line';
const TYPE_TASK = 'task';
const TYPE_CONDITION = 'condition';
const TYPE_LAYOUT = 'layout';
const TYPE_UNKNOWN = 'unknown';
const migration = {
    type: '',
    target: null, // 鼠标落下的图形
    origin: { x: 0, y: 0 }, // 初始坐标，拖动画布使用
    begin: { x: 0, y: 0 }, // 鼠标落下的坐标
    end: { x: 0, y: 0 }, // 鼠标起来的坐标
    move: {  // 移动状态
        active: false, // 移动活动状态
        execute: false // 移动执行状态
    },
    link: { // 连线状态
        active: false // 连线活动状态
    }
}
export default class Layout extends React.Component {
    static STATUS_EDITING = 'edit'
    static STATUS_LINKING = 'link'
    static STATUS_READONLY = 'readonly'
    static defaultProps = {
        onLink: function () { },
        onClean: function () { },
        onDelete: function () { },
        onSelect: function () { }
    }
    state = {
        x: 0,
        y: 0,
        start: {},
        shapes: new Map(),
        active: '',
        status: Layout.STATUS_EDITING
    }
    _onMouseDown(e) {
        let { x, y, status } = this.state;
        // 线不能移动
        if (e.target.tagName == 'svg') {
            migration.target = this.refs.container;
            migration.type = TYPE_LAYOUT;
        } else {
            let node = queryInParents(e.target, 'task');
            migration.target = node;
            if (node) {
                migration.type = node.getAttribute('class').split(' ')[1];
            } else {
                migration.type = TYPE_UNKNOWN;
            }
        }
        migration.begin.x = e.clientX;
        migration.begin.y = e.clientY;
        switch (status) {
            case Layout.STATUS_EDITING:
                migration.move.active = true;
                if (migration.type == TYPE_LAYOUT) { // 移动svg背景
                    migration.origin.x = this.state.x;
                    migration.origin.y = this.state.y;
                } else if (migration.type == TYPE_TASK) { // 移动图形
                    let axis = migration.target.getAttribute('transform').toString().match(/([-]?\d+)/g);
                    migration.origin.x = Number(axis[0]);
                    migration.origin.y = Number(axis[1]);
                }
                break;
            case Layout.STATUS_LINKING:
                if (migration.type != TYPE_TASK) return;
                let rect = this.refs.svg.getBoundingClientRect();
                migration.link.active = true;
                migration.origin.x = e.clientX - rect.left - x;
                migration.origin.y = e.clientY - rect.top - y;
                setAttributes(this.refs.auxiliary, { x1: migration.origin.x, y1: migration.origin.y });
                break;
        }
    }
    _onMouseMove(e) {
        let { begin, target, origin, end, type } = migration;
        if (type == TYPE_CONDITION || type == TYPE_UNKNOWN) {
            return;
        }
        end.x = origin.x + e.clientX - begin.x;
        end.y = origin.y + e.clientY - begin.y;
        switch (this.state.status) {
            case Layout.STATUS_EDITING:
                if (!migration.move.active) return;
                migration.move.execute = true;
                setAttributes(target, { transform: "translate(" + end.x + "," + end.y + ")" });
                if (type == TYPE_TASK) {
                    this._handleMove(target, end);
                }
                break;
            case Layout.STATUS_LINKING:
                if (!migration.link.active) return;
                setAttributes(this.refs.auxiliary, { class: "flow-auxiliary active", x2: end.x + 5, y2: end.y + 3 });
                break;
        }
    }
    _onMouseUp(e) {
        migration.move.active = false;
        migration.link.active = false;
        switch (this.state.status) {
            case Layout.STATUS_EDITING:
                if (!migration.move.execute) return;
                migration.move.execute = false;
                if (migration.type == TYPE_LAYOUT) {
                    this.setState({ x: migration.end.x, y: migration.end.y });
                } else if (migration.type == TYPE_TASK) {
                    let id = migration.target.getAttribute('id');
                    let shape = this.state.shapes.get(id);
                    shape.attrs.x = migration.end.x;
                    shape.attrs.y = migration.end.y;
                    this.refs[id].setAxis(migration.end.x, migration.end.y);
                }
                break;
            case Layout.STATUS_LINKING:
                let node = queryInParents(e.target, 'task');
                if (node) {
                    this._link(e.target, migration.type);
                }
                setAttributes(this.refs.auxiliary, { class: "auxiliary" });
                this.setState({ status: Layout.STATUS_EDITING });
                break;
        }
    }
    _onKeyUp(e) {
        if (e.keyCode == 8 || e.keyCode == 46) {
            this._delete();
        }
    }
    _onLayoutClick(e) {
        // 选择图形失去焦点
        if (this.state.active) {
            this.refs[this.state.active].blur();
        }
        this.props.onClean();
    }
    _onShapeClick(id) {
        if (this.state.active && this.state.active !== id) {
            this.refs[this.state.active].blur();
        }
        this.state.active = id;
        this.props.onSelect(this.state.shapes.get(id));
    }
    _clearLine(line) {
        let { shapes } = this.state;
        // 清除开始图形的关系
        let fromShape = shapes.get(line.from);
        let outIndex = fromShape.lines.out.indexOf(line.id);
        if (outIndex !== -1) {
            fromShape.lines.out.splice(outIndex, 1);
        }
        // 清除结束图形的关系
        let toShape = shapes.get(line.to);
        let inIndex = toShape.lines.in.indexOf(line.id);
        if (inIndex !== -1) {
            toShape.lines.in.splice(inIndex, 1);
        }
    }
    _cleatTask(task) {
        let { shapes } = this.state;
        let lines = task.lines.out.concat(task.lines.in)
        // 如果没有线直接删除
        if (!lines.length) {
            return;
        }
        // 循环所有线，遍历清除所有关系，并删除线
        lines.forEach(line => {
            this._clearLine(shapes.get(line));
            shapes.delete(line);
        });
    }
    _delete() {
        let { active, shapes } = this.state;
        // 不能删除条件
        // 1. 没有获焦图形
        // 2. 图形为开始任务
        // 3. 图形不存在
        if (!active || active == 'start' || !shapes.has(active)) {
            return;
        }
        let shape = shapes.get(active);
        // 如果是线，则清空链接图形的输入输出
        if (shape.type == SHAPE_LINE) {
            this._clearLine(shape);
        } else {
            this._cleatTask(shape);
        }
        shapes.delete(active);
        this.setState({ shapes, active: '' }, () => {
            this.props.onDelete(shape);
        });
    }
    _link(target, type) {
        let originNode = migration.target;
        let targetNode = target.parentNode;
        if (type == TYPE_TASK) {
            let source = this._getLinkPoint(originNode, 'out');
            let target = this._getLinkPoint(targetNode, 'in');
            if (target.id != 'start') {
                this._addLine(source, target);
            }
        }
    }
    _addLine(source, target) {
        let { shapes } = this.state;
        let line = createLine(source, target);
        let sourceShape = shapes.get(source.id);
        let targetShape = shapes.get(target.id);
        let tmpArr = targetShape.lines.out.concat(sourceShape.lines.in);
        let tmpSet = new Set(tmpArr);
        if (tmpArr.length != tmpSet.size) {
            return;
        }
        sourceShape.lines.out.push(line.id);
        targetShape.lines.in.push(line.id);
        shapes.set(line.id, line);
        this.setState({ shapes }, () => {
            this.props.onLink(line.id, source.id, target.id);
        });
    }
    _getLinkPoint(node, position) {
        let id = node.getAttribute('id');
        let shape = this.state.shapes.get(id);
        let { x, y, width, height } = shape.attrs;
        return {
            id: id,
            x: x + (position == 'out' && width || 0),
            y: y + height / 2
        };
    }
    _handleMove(target, axis) {
        let { shapes } = this.state;
        let id = target.getAttribute('id');
        let shape = shapes.get(id);
        if (shape.lines.out.length) {
            shape.lines.out.forEach(lineId => {
                let line = shapes.get(lineId);
                let x1 = axis.x + shape.attrs.width;
                let y1 = axis.y + shape.attrs.height / 2;
                line.attrs.x1 = x1;
                line.attrs.y1 = y1;
                this.refs[lineId].setBegin(x1, y1);
            });
        }
        if (shape.lines.in.length) {
            shape.lines.in.forEach(lineId => {
                let line = shapes.get(lineId);
                let x2 = axis.x;
                let y2 = axis.y + shape.attrs.height / 2;
                line.attrs.x2 = x2;
                line.attrs.y2 = y2;
                this.refs[lineId].setEnd(x2, y2);
            });
        }
    }
    _renderShape(shape) {
        let { x, y } = this.state;
        let { id, type, attrs } = shape;
        let props = {
            id,
            key: id,
            ref: id,
            onClick: this._onShapeClick.bind(this)
        }
        let Node = this._shapes.get(type);
        return <Node {...props} {...attrs} />;
    }
    render() {
        let { width, height } = this.props;
        let { x, y, shapes, status } = this.state;
        let events = status != Layout.STATUS_READONLY && {
            onClick: this._onLayoutClick.bind(this),
            onMouseDown: this._onMouseDown.bind(this),
            onMouseMove: this._onMouseMove.bind(this),
            onMouseUp: this._onMouseUp.bind(this),
            onKeyUp: this._onKeyUp.bind(this)
        } || {};
        let data = translate(shapes);
        return (
            <svg ref="svg" className={'flow ' + status} width={width} height={height} {...events} tabIndex="-1">
                <defs>
                    <marker viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto" id="arrow" className="flow-marker"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
                    <marker viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto" id="arrowHover" className="flow-marker-hover"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
                    <marker viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto" id="arrowActive" className="flow-marker-active"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
                    <filter id="drop-shadow">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"></feGaussianBlur>
                        <feOffset in="blur" dx="0" dy="1" result="offsetBlur"></feOffset>
                        <feMerge>
                            <feMergeNode in="offsetBlur"></feMergeNode>
                            <feMergeNode in="SourceGraphic"></feMergeNode>
                        </feMerge>
                    </filter>
                </defs>
                <g ref="container" className="flow-container" transform={"translate(" + x + "," + y + ")"}>
                    {data.map(this._renderShape.bind(this))}
                    <line className="flow-auxiliary" ref="auxiliary" x1="0" y1="0" x2="0" y2="0"></line>
                </g>
            </svg>
        )
    }
    shouldComponentUpdate(props, state) {
        return this.state != state;
    }
    componentWillMount() {
        // 初始化开始节点
        let start = createCircle(SHAPE_HEIGHT, (LAYOUT_HEIGHT - SHAPE_HEIGHT) / 2, 'start');
        this.state.shapes.set(start.id, start);
        // 格式化数据，将array转换成map
        this.props.data.forEach(shape => this.state.shapes.set(shape.id, shape));
        // 存储图形对象
        this._shapes = new Map();
        this._shapes.set(SHAPE_CIRCLE, Circle);
        this._shapes.set(SHAPE_RECT, Rect);
        this._shapes.set(SHAPE_LINE, Line);
    }
    add(callback) {
        let { x, y, shapes, status } = this.state;
        let shape = createReat(10 - x, 10 - y);
        shapes.set(shape.id, shape);
        this.setState({ status: 'edit', shapes }, () => callback(shape));
    }
    setStatus(status) {
        this.setState({ status });
    }
    setText(id, text) {
        let shape = this.state.shapes.get(id);
        shape.attrs.text = text;
        this.refs[id].setText(text);
    }
    setBackground(id, color) {
        let shape = this.state.shapes.get(id);
        this.refs[id].setBackground(color);
    }
    setButton(id, button) {
        let shape = this.state.shapes.get(id);
        if (shape.type == SHAPE_RECT) {
            this.refs[id].setButton(button);
        }
    }
}
export {
    LAYOUT_WIDTH, LAYOUT_HEIGHT, SHAPE_WIDTH, SHAPE_HEIGHT, SHAPE_RECT, SHAPE_CIRCLE, SHAPE_LINE
}