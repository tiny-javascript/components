import React from 'react';
import FlowComponent from 'components/Flow/Index';
export default class BarPage extends React.Component {
    render() {
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">流程图</div>
                <div className="panel-body">
                    <FlowComponent/>
                </div>
            </div>
        );
    }
}
