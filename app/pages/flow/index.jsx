import React from 'react';
import Rect from './rect';
import './index.css';
const rectProps = {
    key: Date.now(),
    width: 90,
    height: 60,
    fill: '#fff',
    stroke: '#000',
    text: ''
}
const diamond = {
    x: 0,
    y: 0,
    points: "0,30 40,0 80,30 40,60"
}
class Form extends React.Component {
    state = {
        name: ''
    }
    _onInputChange(e) {
        this.setState({
            name: e.target.value
        }, () => {
            this.props.onNameChange && this.props.onNameChange(this.state.name);
        });
    }
    setName(name) {
        this.setState({name});
    }
    render() {
        const {name} = this.state;
        return (
            <form className="form">
                <div className="form-group">
                    <label className="control-label">Name:</label>
                    <input value={name} className="form-control" onChange={this._onInputChange.bind(this)}/>
                </div>
            </form>
        )
    }
}
export default class Flow extends React.Component {
    static defaultProps = {
        width: 1108,
        height: 500
    }
    state = {
        rects: []
    }
    selected = null
    _onItemSelect(key) {
        const rect = this.state.rects.find(rect => rect.key == key);
        this.selected = rect;
        this.refs.form.setName(rect.text);
    }
    _onNameChange(name) {
        if(this.selected){
            this.refs[this.selected.key].setText(name);
        }
    }
    _createRect(name) {
        const rect = Object.assign({}, rectProps);
        rect.key = Date.now();
        rect.ref = rect.key;
        rect.x = 100;
        rect.y = 100;
        rect.text = name;
        rect.onSelect = this._onItemSelect.bind(this, rect.key);
        return rect;
    }
    componentWillMount() {
        const rect = this._createRect('这是一个任务');
        this.state.rects.push(rect);
    }
    render() {
        const {width, height} = this.props;
        const {rects} = this.state;
        return (
            <div className="content">
                <div className="svg-wrap">
                    <svg width={width} height={height}>
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
                        <g id="node-list">
                            {rects.map(rect => (<Rect {...rect}/>))}
                        </g>
                    </svg>
                </div>
                <Form ref="form" onNameChange={this._onNameChange.bind(this)}/>
            </div>
        )
    }
}
