import React, {Component, PropTypes} from 'react';
import {Stage, Layer} from 'react-konva';
import SimpleTask from './tasks/SimpleTask';
import StartEvent from './events/StartEvent';
import EndEvent from './events/EndEvent';
import ParallelGateway from './gateways/ParallelGateway';
import ExclusiveGateway from './gateways/ExclusiveGateway';
import InclusiveGateway from './gateways/InclusiveGateway';
import ComplexGateway from './gateways/ComplexGateway';
import SimpleConnector from './connectors/SimpleConnector';
import EventContainer from './common/EventContainer';
import './index.css';
export default class FlowComponent extends Component {
    static childContextTypes = {
        elements: PropTypes.any,
        connectors: PropTypes.array
    }
    state = {
        activeElement: null,
        elements: new Map(),
        connectors: []
    }
    /**
     * 文档点击事件，触发失焦
     */
    _onDocumentClick() {
        EventContainer.executeEvent('element.blur');
    }
    /**
     * 画布点击事件，获取当前活动节点
     */
    _onCanvasClick(e) {
        this.state.activeElement = e.target;
    }
    /**
     * 画布内容点击事件，判断时候点击到空白区域并触发失焦
     */
    _onCanvasContentClick(e) {
        if (!this.state.activeElement) {
            EventContainer.executeEvent('element.blur');
        }
        this.state.activeElement = null;
    }
    /**
     * 画布容器点击事件，阻止事件传播
     */
    _onCanvasContainerClick(e) {
        e.stopPropagation();
    }
    /**
     * 创建连接器
     */
    _onCreateConnector() {}
    /**
     * 销毁连接器
     */
    _onDestoryConnector() {}
    /**
     * 创建节点
     */
    _createElement(data) {
        const [uniqKey,
            info] = data;
        info.props.key = uniqKey;
        let element = null;
        switch (info.type) {
            case 'SimpleTask':
                element = <SimpleTask {...info.props}/>
                break;
        }
        return element;
    }
    getChildContext() {
        return {elements: this.state.elements, connectors: this.state.connectors};
    }
    /**
     * 阻止参数变化触发重新渲染
     */
    shouldComponentUpdate(state, props) {
        return state != this.state;
    }
    componentWillMount() {
        const {elements} = this.state;
        elements.set('task1', {
            type: 'SimpleTask',
            props: {
                uniqKey: 'task1',
                x: 200,
                y: 100,
                width: 100,
                height: 50
            }
        });
        elements.set('task2', {
            type: 'SimpleTask',
            props: {
                uniqKey: 'task2',
                x: 500,
                y: 100,
                width: 100,
                height: 50
            }
        });
    }
    render() {
        const {elements, connectors} = this.state;
        return (
            <div id="flowContainer" className="flow-container">
                <Stage width={1108} height={500} onclick={this._onCanvasClick.bind(this)} oncontentclick={this._onCanvasContentClick.bind(this)}>
                    <Layer>
                        {[...elements].map(this._createElement.bind(this))}
                        <SimpleConnector source="task1" target="task2" sourcePoint="north" targetPoint="north"></SimpleConnector>
                    </Layer>
                </Stage>
            </div>
        );
    }
    componentDidMount() {
        document.addEventListener('click', this._onDocumentClick.bind(this));
        document.getElementById('flowContainer').addEventListener('click', this._onCanvasContainerClick.bind(this));
        EventContainer.addEventListener('connector.create', this, '_onCreateConnector');
        EventContainer.addEventListener('connector.destory', this, '_onDestoryConnector');
    }
    componentWillUnmount() {
        document.removeEventListener('click');
        document.getElementById('flowContainer').removeEventListener('click');
        EventContainer.removeEventListener('connector.create', this);
        EventContainer.removeEventListener('connector.destory', this);
    }
}
