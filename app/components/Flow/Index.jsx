import React, {Component} from 'react';
import {Stage, Layer} from 'react-konva';
import SimpleTask from './tasks/SimpleTask';
import './index.css';
export default class FlowComponent extends Component {
    render() {
        return (
            <Stage width={1108} height={500}>
                <Layer>
                    <SimpleTask x={125} y={100}/>
                </Layer>
            </Stage>
        );
    }
}
