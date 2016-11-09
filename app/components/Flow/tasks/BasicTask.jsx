import React from 'react';
import {Line, Group} from 'react-konva';
import BasicElement from '../common/BasicElement';
import ResizePoint from '../points/ResizePoint';
import ConnectorPoint from '../points/ConnectorPoint';
import mixin from 'decorators/mixin';
import DragMixin from '../mixins/DragMixin';
import ClickMixin from '../mixins/ClickMixin';
import ResizeMixin from '../mixins/ResizeMixin';
@mixin(DragMixin, ClickMixin, ResizeMixin)
export default class BasicTask extends BasicElement {
    _getEvents() {
        let events = Object.assign({}, this._clickEvents);
        if (this.state.draggable) {
            events = Object.assign(events, this._dragEvents);
        }
        return events;
    }
    _refreshPoints() {
        const {width, height, pointRaduis} = this.state;
        const resizePoints = this._getResizePointPosition(width, height, pointRaduis);
        const connectorPoints = this._getConnectorPointPosition(width, height, pointRaduis);
        resizePoints.forEach((point, index) => {
            const ref = `rp${index}`;
            this.refs[ref].setAxis(point.x, point.y);
        });
        connectorPoints.forEach((point, index) => {
            const ref = `cp${index}`;
            this.refs[ref].setAxis(point.x, point.y);
        });
    }
    /**
     * 渲染基础层
     */
    _renderWrap() {
        const {width, height, pointRaduis} = this.state;
        const borderPoints = this._getRectBorderPoints(width, height);
        const resizePoints = this._getResizePointPosition(width, height, pointRaduis);
        const connectorPoints = this._getConnectorPointPosition(width, height, pointRaduis);
        const resizeEvents = this._resizeEvents;
        return (
            <Group width={width} height={height}>
                <Line x="0" y="0" points={borderPoints} stroke="red" strokeWidth="1" closed/>
                <Group></Group>
                {resizePoints.map((point, index) => {
                    point.ref = `rp${index}`;
                    return <ResizePoint key={index} radius={pointRaduis} {...point} {...resizeEvents}/>
                })}
                <Group></Group>
                {connectorPoints.map((point, index) => {
                    point.ref = `cp${index}`;
                    return <ConnectorPoint key={index} radius={pointRaduis} {...point}/>
                })}
            </Group>
        )
    }
    _onDragMove(e) {
        this.forceUpdate();
    }
    _onResize(e) {
        const {pointRaduis} = this.state;
        const rx = e.target.attrs.x;
        const ry = e.target.attrs.y;
        this.setState({
            width: rx + pointRaduis,
            height: ry + pointRaduis
        });
        this._refreshPoints();
    }
    setStatus(status) {
        this.setState({
            status,
            draggable: status != this.STATUS_RESIZE
        });
    }
    componentWillMount() {
        super.componentWillMount();
        this._clickEvents = this._getClickEvents();
        this._dragEvents = this._getDragEvents();
        this._resizeEvents = this._getResizeEvents();
        this.state.minArea = 30;
    }
}
