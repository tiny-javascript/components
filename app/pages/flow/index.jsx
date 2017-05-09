import React from 'react';
import Rect from './rect';
import './index.css';
const rectProps = {
    key: Date.now(),
    width: 90,
    height: 60,
    fill: '#fff',
    stroke: '#000',
    text: '这是一个很长的名字'
}
const diamond = {
    x: 0,
    y: 0,
    points: "0,30 40,0 80,30 40,60"
}
export default class Flow extends React.Component {
    static defaultProps = {
        width: 1108,
        height: 500
    }
    state = {
        rects: [rectProps]
    }
    _onAddRect() {
        const {rects} = this.state;
        const rect = Object.assign({}, rectProps);
        rect.key = Date.now();
        rect.x = 100;
        rect.y = 100;
        rects.push(rect);
        this.setState({rects});
    }
    _onInputChange() {}
    render() {
        const {width, height} = this.props;
        const {rects} = this.state;
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">FlowSVG</div>
                <div className="panel-body">
                    <div className="svg-wrap">
                        <svg width={width} height={height}>
                            <g id="node-list">
                                {rects.map(rect => (<Rect {...rect}/>))}
                            </g>
                        </svg>
                    </div>
                    <form>
                        <div className="form-group">
                            <label className="control-label">Name:</label>
                            <input type="email" className="form-control" onChange={this._onInputChange.bind(this)}/>
                        </div>
                        <button className="btn btn-default btn-sm" onClick={this._onAddRect.bind(this)}>添加Rect</button>
                    </form>
                </div>
            </div>
        )
    }
}
