import React from 'react';
import Rect from './graphs/rect';
import Circle from './graphs/circle';
import {SHAPE_CIRCLE, SHAPE_RECT, SHAPE_DIAMOND} from './constants';
const migration = {
    target: null,
    origin: {
        x: 0,
        y: 0
    },
    begin: {
        x: 0,
        y: 0
    },
    end: {
        x: 0,
        y: 0
    },
    move: {
        active: false,
        execute: false
    },
    link: {
        active: false
    }
};
export default class Layout extends React.Component {
    static STATUS_EDITING = 'edit'
    static STATUS_LINKING = 'link'
    static STATUS_READONLY = 'readonly'
    static defaultProps = {
        onLinkCancel: function() {},
        onLinkComplete: function() {},
        onDelete: function() {}
    }
    state = {
        x: 0,
        y: 0,
        shapes: this.props.data.shapes,
        lines: this.props.data.lines,
        active: '',
        status: Layout.STATUS_EDITING
    }
    _createLine(line) {
        return null;
    }
    _createShape(shape) {
        let {id, type, attrs} = shape;
        let props = {
            id,
            key: id,
            ref: id,
            onClick: this._onShapeClick.bind(this)
        }
        attrs.x = attrs.x - this.state.x;
        attrs.y = attrs.y - this.state.y;
        const Node = this._shapeMap.get(type);
        return <Node {...props} {...attrs}/>;
    }
    _onLayoutClick(e) {
        // 选择图形失去焦点
        if (this.state.active) {
            this.refs[this.state.active].blur();
        }
        // 取消连线状态
        if (this.state.status == Layout.STATUS_LINKING) {
            // this.setState({status: Layout.STATUS_EDITING});
            // this.props.onLinkCancel();
        }
    }
    _onShapeClick(e) {
        e.event.stopPropagation();
        const {active} = this.state;
        if (active && active !== e.id) {
            this.refs[active].blur();
        }
        this.state.active = e.id;
    }
    _onMouseDown(e) {
        migration.begin.x = e.clientX;
        migration.begin.y = e.clientY;
        if (this.state.status == Layout.STATUS_EDITING) {
            migration.move.active = true;
            if (e.target.tagName == 'svg') { // 移动svg背景
                migration.target = this.refs.container;
                migration.origin.x = this.state.x;
                migration.origin.y = this.state.y;
            } else { // 移动图形
                migration.target = e.target.parentNode;
                let transform = migration.target.getAttribute('transform').toString();
                let axis = transform.match(/([-]?\d+)/g);
                migration.origin.x = Number(axis[0]);
                migration.origin.y = Number(axis[1]);
            }
        } else if (this.state.status == Layout.STATUS_LINKING) { // 连线状态
            let ishover = e.target.parentNode.getAttribute('class').indexOf('shape') !== -1;
            if (ishover) {
                migration.link.active = true;
                let rect = this.refs.svg.getBoundingClientRect();
                migration.origin.x = e.clientX - rect.left;
                migration.origin.y = e.clientY - rect.top;
                this.refs.tmpLine.setAttribute("x1", migration.origin.x);
                this.refs.tmpLine.setAttribute("y1", migration.origin.y);
            }
        }
    }
    _onMouseMove(e) {
        let {move, begin, target, origin, end} = migration;
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
        } else if (this.state.status == Layout.STATUS_LINKING) { // 连线状态
            if(!migration.link.active){
                return;
            }
            this.refs.tmpLine.setAttribute("class", "tmp-line active");
            this.refs.tmpLine.setAttribute("x2", origin.x + offset.x);
            this.refs.tmpLine.setAttribute("y2", origin.y + offset.y);
        }
    }
    _onMouseUp(e) {
        if (this.state.status == Layout.STATUS_EDITING) {
            if (migration.move.execute) {
                if (migration.target == this.refs.container) {
                    this.setState({x: migration.end.x, y: migration.end.y});
                } else {
                    let id = migration.target.getAttribute('id');
                    this.refs[id].setAxis(migration.end.x, migration.end.y);
                }
                migration.move.execute = false;
            }
            migration.move.active = false;
        } else if (this.state.status == Layout.STATUS_LINKING) {
            migration.link.active = false;
            this.refs.tmpLine.setAttribute("class", "tmp-line");
        }
    }
    addShape(shape) {
        const {shapes, status} = this.state;
        if (status !== Layout.STATUS_EDITING) {
            return;
        }
        shapes.push(shape);
        this.setState({shapes});
    }
    addLine(line) {
        const {lines} = this.state;
        lines.push(line);
        this.setState({lines});
    }
    setStatus(status) {
        this.setState({status});
    }
    componentWillMount() {
        let shapeMap = new Map();
        shapeMap.set(SHAPE_CIRCLE, Circle);
        shapeMap.set(SHAPE_RECT, Rect);
        this._shapeMap = shapeMap;
    }
    render() {
        const {width, height} = this.props;
        const {x, y, shapes, lines, status} = this.state;
        const events = status != Layout.STATUS_READONLY && {
            onClick: this._onLayoutClick.bind(this),
            onMouseDown: this._onMouseDown.bind(this),
            onMouseMove: this._onMouseMove.bind(this),
            onMouseUp: this._onMouseUp.bind(this)
        } || {};
        return (
            <svg ref="svg" className={status} width={width} height={height} {...events}>
                <defs>
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
                    <g className="line-container" id="lines">{lines.map(this._createLine.bind(this))}</g>
                    <g className="shape-container" id="shapes">{shapes.map(this._createShape.bind(this))}</g>
                    <line className="tmp-line" ref="tmpLine" x1="0" y1="0" x2="0" y2="0"></line>
                </g>
            </svg>
        )
    }
}
