import React, {Component, PropTypes} from 'react';
import './css/index.css';
export default class PieComponent extends Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        data: PropTypes.array.isRequired,
        position: PropTypes.string
    }
    static defaultProps = {
        width: 400,
        height: 400,
        position: 'left'
    }
    state = {
        radius: 0,
        defaultArc: null,
        changedArc: null,
        animationTime: 150
    }
    _create() {
        const {width, height, data} = this.props;
        var svg = d3.select(this.refs.div).append('svg').attr('width', width).attr('height', height);
        svg.append('g').attr('class', 'slices').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        this._draw(svg, data);
    }
    _draw(svg, data) {
        const {defaultArc, changedArc, animationTime} = this.state;
        // 处理数据
        data.sort(function(a, b) {
            return a.value - b.value;
        });
        data = d3.pie().value(function(d) {
            return d.value;
        })(data);
        // 创建切片
        var slice = svg.select('.slices').selectAll('path').data(data).enter().insert('path');
        // 设置切片样式，以及事件
        slice.style('fill', function(d) {
            return d.data.color;
        }).on('mouseover', this._onMouseover.bind(this)).on('mouseleave', this._onMouseleave.bind(this)).on('mousemove', this._onMousemove.bind(this));
        // 设置动画
        slice.transition().ease(d3.easeLinear).delay(function(d, i) {
            return (data.length - i) * animationTime;
        }).duration(animationTime).attrTween('d', function(d) {
            var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
            return function(t) {
                d.endAngle = i(t);
                return defaultArc(d);
            }
        });
        slice.exit().remove();
    }
    _createList() {
        const {position, data} = this.props;
        return (
            <ul className={position}>
                {data.map(item => {
                    const style = {
                        background: item.color
                    };
                    return (
                        <li key={item.name}>
                            <i style={style}></i>
                            <span>{item.name}</span>
                        </li>
                    );
                })}
            </ul>
        )
    }
    _nodeTransition(node, ease) {
        return d3.select(node).transition().duration(this.state.animationTime).ease(ease);
    }
    _onMouseover(d, index, nodes) {
        this._nodeTransition(nodes[index], d3.easeBackOut).attr('d', this.state.changedArc);
        const message = d.data.name + ': ' + d.data.value ;
        this.refs.tip.setVisisble(true, message);
    }
    _onMouseleave(d, index, nodes) {
        this._nodeTransition(nodes[index], d3.easeBackOut).attr('d', this.state.defaultArc);
        this.refs.tip.setVisisble(false, '');
    }
    _onMousemove(d, index, nodes) {
        this.refs.tip.setPosition(d3.event.layerX, d3.event.layerY);
    }
    componentWillMount() {
        const {width, height} = this.props;
        const radius = Math.min(width, height) / 2;
        this.state.defaultArc = d3.arc().outerRadius(radius * 0.6).innerRadius(radius * 0.3);
        this.state.changedArc = d3.arc().outerRadius(radius * 0.7).innerRadius(radius * 0.3);
        this.state.radius = radius;
        this._moveIndex = -1;
    }
    render() {
        return (
            <div className="d3-pie" ref="div">
                {this._createList()}
                <Tip ref="tip"/>
            </div>
        );
    }
    componentDidMount() {
        this._create();
    }
}
class Tip extends Component {
    state = {
        x: 0,
        y: 0,
        visible: false,
        message: ''
    }
    setPosition(x, y) {
        this.setState({x, y});
    }
    setVisisble(visible, message) {
        this.setState({visible, message});
    }
    render() {
        const {x, y, visible, message} = this.state;
        const style = {
            left: x,
            top: y,
            display: visible && 'block' || 'none'
        }
        return (
            <div style={style} className="d3-pie-tips">{message}</div>
        );
    }
}
