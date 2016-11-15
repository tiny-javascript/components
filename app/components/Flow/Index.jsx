import React, {Component} from 'react';
import {Stage, Layer} from 'react-konva';
import SimpleTask from './tasks/SimpleTask';
import StartEvent from './events/StartEvent';
import EndEvent from './events/EndEvent';
import ParallelGateway from './gateways/ParallelGateway';
import ExclusiveGateway from './gateways/ExclusiveGateway';
import InclusiveGateway from './gateways/InclusiveGateway';
import ComplexGateway from './gateways/ComplexGateway';
import EventContainer from './common/EventContainer';
import './index.css';
export default class FlowComponent extends Component {
    state = {
        activeElement: null
    }
    _onDocumentClick() {
        EventContainer.executeEvent('element.blur');
    }
    _onCanvasClick(e) {
        this.state.activeElement = e.target;
    }
    _onCanvasContentClick(e) {
        if (!this.state.activeElement) {
            EventContainer.executeEvent('element.blur');
        }
        this.state.activeElement = null;
    }
    _onCanvasContainerClick(e) {
        e.stopPropagation();
    }
    render() {
        return (
            <div id="flowContainer" className="flow-container">
                <Stage width={1108} height={500} onclick={this._onCanvasClick.bind(this)} oncontentclick={this._onCanvasContentClick.bind(this)}>
                    <Layer>
                        <StartEvent x={50} y={150}/>
                        <SimpleTask x={150} y={150}/>
                        <ParallelGateway x={275} y={150}/>
                        <ExclusiveGateway x={375} y={150}/>
                        <ComplexGateway x={475} y={150}/>
                        <InclusiveGateway x={575} y={150}/>
                        <EndEvent x={675} y={150}/>
                    </Layer>
                </Stage>
            </div>
        );
    }
    componentDidMount() {
        document.addEventListener('click', this._onDocumentClick.bind(this));
        document.getElementById('flowContainer').addEventListener('click', this._onCanvasContainerClick.bind(this));
    }
    componentWillUnmount() {
        document.removeEventListener('click');
        document.getElementById('flowContainer').removeEventListener('click');
    }
}
