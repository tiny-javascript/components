import React, {Component, PropTypes} from 'react';
import './css/index.css';
const TYPE_DEFAULT = 'default';
const TYPE_TIME = 'time';
export default class BarComponent extends Component {
    static propTypes = {
        type: PropTypes.oneOf([TYPE_DEFAULT, TYPE_TIME]),
        width: PropTypes.number,
        height: PropTypes.number,
        color: PropTypes.object,
        keys: PropTypes.object,
        data: PropTypes.array.isRequired
    }
    static defaultProps = {
        data: [],
        type: TYPE_TIME,
        width: 990,
        height: 400
    }
    state = {
        data: null,
        xScale: null,
        yScale: null
    }
    _init() {
        const {data, keys} = this.props;
        const stack = d3.stack().keys(keys.y).order(d3.stackOrderNone).offset(d3.stackOffsetNone);
        this.state.data = stack(data);
        this.state.xScale = this._getScaleX();
        this.state.yScale = this._getScaleY();
    }
    _create() {
        const {width, height, color} = this.props;
        const {data} = this.state;
        this.refs.div.innerHTML = '';
        const svg = d3.select(this.refs.div).append("svg").attr("width", width).attr("height", height);
        // 设置组
        const groups = svg.selectAll("g").data(data).enter().append("g");
        groups.attr("class", "rgroups").style("fill", function(d, i) {
            return color[d.key];
        });
        const rects = groups.selectAll("rect").data(d => {
            return d;
        }).enter().append("rect").style("fill-opacity", 0.3);
        this._setGroup(rects);
        // 设置坐标
        this._setAxis(svg);
    }
    _getScaleX() {
        const {width, type, keys, data} = this.props;
        // X轴比例尺
        const min = d3.min(data, function(d) {
            return d[keys.x];
        });
        const max = d3.max(data, function(d) {
            return d[keys.x];
        });
        let x = d3.scaleLinear();
        if (type === TYPE_TIME) {
            x = d3.scaleTime();
        }
        x.domain([min, max]).range([
            0, width - 40
        ]);
        return x;
    }
    _getScaleY() {
        const {height} = this.props;
        const {data} = this.state;
        // Y轴比例尺
        const max = d3.max(data, (d) => {
            return d3.max(d, d0 => {
                return d0[1];
            });
        });
        const y = d3.scaleLinear().domain([0, max]).range([height, 0]);
        return y;
    }
    _setAxis(svg) {
        const {data, keys} = this.props;
        const {xScale, yScale} = this.state;
        // X轴
        const ticks = data.map(d => {
            return d[keys.x];
        });
        const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(8).tickValues(ticks).tickFormat(d3.timeFormat('%m/%d'));
        const xg = svg.append("g").attr("class", "x axis").attr("transform", "translate(40,380)").call(xAxis);
        // 设置X轴刻度向右偏移
        const texts = xg.selectAll('text').attr('x', 20);
        // 设置X轴最后一个刻度向左偏移
        const nodes = texts.nodes();
        d3.select(nodes[nodes.length - 1]).attr('x', -20);
        // Y轴
        const yAxis = d3.axisLeft(yScale).ticks(5);
        svg.append("g").attr("class", "y axis").attr("transform", "translate(40, -20)").call(yAxis);
    }
    _setGroup(rects) {
        const {keys, height, data} = this.props;
        const {xScale, yScale} = this.state;
        rects.attr('x', (d, i) => {
            const x = xScale(d.data[keys.x]);
            return i == (data.length - 1) && x || x + 40;
        }).attr('y', (d, i) => {
            const h = yScale(0) - yScale(d[1]);
            return height - h - 20;
        }).attr("height", (d) => {
            return yScale(d[0]) - yScale(d[1]);
        }).attr("width", 40).style("fill-opacity", 1);
    }
    componentWillMount() {
        this._init();
    }
    componentWillReceiveProps() {
        this._init();
    }
    render() {
        return (
            <div className="d3-bar" ref="div"></div>
        );
    }
    componentDidMount() {
        this._create();
    }
    componentDidUpdate() {
        this._create();
    }
}
