import React from 'react';
import Rect from './graphs/rect';
import Line from './graphs/line';
import Circle from './graphs/circle';
import { createReat, createCircle, createLine, translate } from './utils';
const LAYOUT_WIDTH = 1108;
const LAYOUT_HEIGHT = 500;
const SHAPE_WIDTH = 100;
const SHAPE_HEIGHT = 48;
const SHAPE_RECT = 'rect';
const SHAPE_CIRCLE = 'circle';
const SHAPE_LINE = 'line';
export default class Layout extends React.Component {
    static STATUS_EDITING = 'edit'
    static STATUS_LINKING = 'link'
    static STATUS_READONLY = 'readonly'
    static defaultProps = {
        onLink: function () { },
        onDelete: function () { }
    }
    state = {
        x: 0,
        y: 0,
        start: {},
        shapes: new Map(),
        active: '',
        status: Layout.STATUS_EDITING
    }
    migration = {
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
    _onMouseDown(e) {
        const { migration } = this;
        let { x, y, status } = this.state;
        migration.target = e.target.parentNode;
        migration.type = e.target.tagName;
        migration.begin.x = e.clientX;
        migration.begin.y = e.clientY;
        if (migration.type == 'path') {
            return;
        }
        if (status == Layout.STATUS_EDITING) {
            migration.move.active = true;
            if (migration.type == 'svg') { // 移动svg背景
                migration.target = this.refs.container;
                migration.origin.x = this.state.x;
                migration.origin.y = this.state.y;
            } else { // 移动图形
                let transform = migration.target.getAttribute('transform').toString();
                let axis = transform.match(/([-]?\d+)/g);
                migration.origin.x = Number(axis[0]);
                migration.origin.y = Number(axis[1]);
            }
        } else if (status == Layout.STATUS_LINKING) { // 连线状态
            let ishover = migration.target.getAttribute('class').indexOf('shape') !== -1;
            if (ishover) {
                migration.link.active = true;
                let rect = this.refs.svg.getBoundingClientRect();
                migration.origin.x = e.clientX - rect.left - x;
                migration.origin.y = e.clientY - rect.top - y;
                this.refs.tmpLine.setAttribute("x1", migration.origin.x);
                this.refs.tmpLine.setAttribute("y1", migration.origin.y);
            }
        }
    }
    _onMouseMove(e) {
        const { migration } = this;
        let { move, begin, target, origin, end, type } = migration;
        let offset = {
            x: e.clientX - begin.x,
            y: e.clientY - begin.y
        };
        // 编辑状态
        if (this.state.status == Layout.STATUS_EDITING) {
            if (!move.active) {
                return;
            }
            move.execute = true;
            end.x = origin.x + offset.x;
            end.y = origin.y + offset.y;
            target.setAttribute('transform', "translate(" + end.x + "," + end.y + ")");
            if (type == SHAPE_RECT || type == SHAPE_CIRCLE) {
                this._handleMove(target, end);
            }
        } else if (this.state.status == Layout.STATUS_LINKING) { // 连线状态
            if (!migration.link.active) {
                return;
            }
            this.refs.tmpLine.setAttribute("class", "auxiliary active");
            this.refs.tmpLine.setAttribute("x2", origin.x + offset.x + 5);
            this.refs.tmpLine.setAttribute("y2", origin.y + offset.y + 3);
        }
    }
    _onMouseUp(e) {
        const { migration } = this;
        if (this.state.status == Layout.STATUS_EDITING) {
            if (migration.move.execute) {
                if (migration.target == this.refs.container) {
                    this.setState({ x: migration.end.x, y: migration.end.y });
                } else {
                    let id = migration.target.getAttribute('id');
                    let shape = this.state.shapes.get(id);
                    this.refs[id].setAxis(migration.end.x, migration.end.y);
                    shape.attrs.x = migration.end.x;
                    shape.attrs.y = migration.end.y;
                }
                migration.move.execute = false;
            }
            migration.move.active = false;
        } else if (this.state.status == Layout.STATUS_LINKING) {
            migration.link.active = false;
            this.refs.tmpLine.setAttribute("class", "auxiliary");
            this._link(e.target);
            this.setState({ status: Layout.STATUS_EDITING });
        }
    }
    _onKeyUp(e) {
        if (e.keyCode == 8) {
            this._delete();
        }
    }
    _onLayoutClick(e) {
        // 选择图形失去焦点
        if (this.state.active) {
            this.refs[this.state.active].blur();
        }
    }
    _onShapeClick(e) {
        e.event.stopPropagation();
        let { active } = this.state;
        if (active && active !== e.id) {
            this.refs[active].blur();
        }
        this.state.active = e.id;
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
            this.props.onDelete(active);
        });
    }
    _link(target) {
        let targetNode = target.parentNode;
        let originNode = this.migration.target;
        if (target.tagName == SHAPE_RECT) {
            let source = this._getLinkPoint(originNode, 'out');
            let target = this._getLinkPoint(targetNode, 'in');
            this._addLine(source, target);
        }
    }
    _addLine(source, target) {
        let { shapes } = this.state;
        let line = createLine(source, target);
        let sourceShape = shapes.get(source.id);
        let targetShape = shapes.get(target.id);
        sourceShape.lines.out.push(line.id);
        targetShape.lines.in.push(line.id);
        shapes.set(line.id, line);
        this.setState({ shapes }, this.props.onLink);
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
            <svg ref="svg" className={status} width={width} height={height} {...events} tabIndex="-1">
                <defs>
                    <marker viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto" id="arrow" className="marker"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
                    <marker viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto" id="arrowHover" className="marker-hover"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
                    <marker viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto" id="arrowActive" className="marker-active"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>
                    <filter id="drop-shadow">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"></feGaussianBlur>
                        <feOffset in="blur" dx="0" dy="1" result="offsetBlur"></feOffset>
                        <feMerge>
                            <feMergeNode in="offsetBlur"></feMergeNode>
                            <feMergeNode in="SourceGraphic"></feMergeNode>
                        </feMerge>
                    </filter>
                </defs>
                <g ref="container" className="container" transform={"translate(" + x + "," + y + ")"}>
                    {data.map(this._renderShape.bind(this))}
                    <line className="auxiliary" ref="tmpLine" x1="0" y1="0" x2="0" y2="0"></line>
                </g>
            </svg>
        )
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
}
export {
    LAYOUT_WIDTH, LAYOUT_HEIGHT, SHAPE_WIDTH, SHAPE_HEIGHT, SHAPE_RECT, SHAPE_CIRCLE, SHAPE_LINE
}