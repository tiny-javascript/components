import React from 'react';
var root = {
    children: [
        {
            id: 1,
            name: "proxy1"
        }, {
            id: 2,
            name: "proxy2"
        }, {
            id: 3,
            name: "proxy3"
        }, {
            id: 4,
            name: "proxy4"
        }
    ]
};
export default class ProxyMapPage extends React.Component {
    state = {
        width: 1108,
        height: 600,
        reduceRadius: 75,
        moveStatus: false,
        moveElements: [],
        animationSpeed: 500,
        data: {}
    }
    _init() {
        const {width, height} = this.state;
        let data = d3.hierarchy(root).sort(null).sum((d) => {
            return !d.children;
        });
        let pack = d3.pack().size([width, height]).padding(2);
        pack(data);
        this.state.data = data;
    }
    _move(elements, currentIndex) {
        const {moveStatus, reduceRadius, animationSpeed} = this.state;
        elements.map((node, index) => {
            const g = d3.select(node);
            const circle = g.select('circle').transition().duration(animationSpeed);
            if (index == currentIndex) {
                circle.attr('fill', 'rgba(0, 0, 0, 0.3)');
            } else {
                circle.attr('fill', 'rgba(31, 119, 180, 0.3)');
            }
            if (!moveStatus) {
                const y = reduceRadius * index * 2 + reduceRadius;
                g.transition().duration(animationSpeed).attr("transform", 'translate(' + reduceRadius + ',' + y + ')');
                circle.attr("r", reduceRadius);
            }
        });
    }
    _create() {
        const {width, height} = this.state;
        const svg = d3.select(this.refs.svg).append('svg');
        svg.attr('width', width).attr('height', height).attr('class', 'pack');
        svg.on('click', this._onSVGClick.bind(this));
        this._createNodes(svg);
    }
    _createNodes(svg) {
        const nodes = svg.selectAll('.node').data(this.state.data.leaves()).enter().append('g');
        nodes.attr('class', 'node').attr('transform', (d) => {
            return "translate(" + d.x + "," + d.y + ")";
        });
        nodes.on('click', this._onNodeClick.bind(this));
        // 绘制外圆
        nodes.append('circle').attr('r', (d) => {
            return d.r;
        }).attr("fill", "rgba(31, 119, 180, 0.3)");
        // 绘制名称
        nodes.append('text').attr("dy", ".3em").style("text-anchor", "middle").text((d) => {
            return d.data.name;
        });
    }
    _onSVGClick() {
        const {animationSpeed, moveStatus, moveElements, data} = this.state;
        if (moveStatus) {
            moveElements.map((node, index) => {
                const leaf = data.leaves()[index];
                const g = d3.select(node);
                g.transition().duration(animationSpeed).attr("transform", 'translate(' + leaf.x + ',' + leaf.y + ')');
                g.select('circle').transition().duration(animationSpeed).attr("r", leaf.r);
            });
            this.state.moveStatus = false;
            this.state.moveElements = [];
        }
    }
    _onNodeClick(current, currentIndex, elements) {
        d3.event.stopPropagation();
        this._move(elements, currentIndex);
        if (!this.state.moveStatus) {
            this.state.moveStatus = true;
            this.state.moveElements = elements;
        }
    }
    componentWillMount() {
        this._init();
    }
    render() {
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">ProxyMap-域列表</div>
                <div className="panel-body">
                    <div ref="svg"></div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        this._create();
    }
}
