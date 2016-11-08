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
                {resizePoints.map((item, index) => {
                    const {x, y, cursor} = item;
                    const referenceIndex = index < resizePoints.length / 2 && index + 2 || index - 2;
                    return <ResizePoint key={x + '_' + y} x={x} y={y} radius={pointRaduis} cursor={cursor} parent={this.state} {...resizeEvents}/>
                })}
                {connectorPoints.map(item => {
                    const {x, y} = item;
                    return <ConnectorPoint key={x + '_' + y} x={x} y={y} radius={pointRaduis}/>
                })}
            </Group>
        )
    }
}
