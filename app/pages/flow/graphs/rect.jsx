import React from 'react';
import Shape from './shape';
const ACTION_LATYOUT_WIDTH = 25;
export default class Rect extends Shape {
    _getTextWidth(text) {
        text = text || '';
        const node = document.getElementById('text');
        node.innerHTML = text;
        return node.offsetWidth;
    }
    _getActualWidth() {
        const { width } = this.state;
        const textWidth = this._getTextWidth(this.state.text);
        return textWidth > width && textWidth || width;
    }
    _onIconClick(key, e) {
        e.stopPropagation();
        const { buttons } = this.state;
        const btn = buttons.find(item => item.icon == key);
        btn.onClick();
    }
    _renderRedoIcon(x, y, key) {
        const attrs = { x, y, key };
        return (
            <g onClick={this._onIconClick.bind(this, key)}>
                <text {...attrs} className="flow-icon">&#xe031;</text>
            </g>
        )
    }
    _renderSkipIcon(x, y, key) {
        const attrs = { x, y, key };
        attrs.onClick = this._onIconClick.bind(this, key);
        return <text {...attrs} className="flow-icon">&#xe250;</text>
    }
    _renderInterruptIcon() { }
    _render() {
        const { fill, stroke, strokeWidth, height, borderRadius } = this.state;
        const width = this._getActualWidth();
        return <rect x="0" y="0" rx={borderRadius} ry={borderRadius} width={width} height={height}></rect>
    }
    _renderOther() {
        const { width, height, buttons } = this.state;
        let x = width - ACTION_LATYOUT_WIDTH / 2;
        return buttons.length && (
            <g className="flow-action-layout">
                <rect x={width - ACTION_LATYOUT_WIDTH} y="0" width={ACTION_LATYOUT_WIDTH} height={height}></rect>
                {buttons.map((btn, index) => {
                    let y = 20 + (12 + 5) * index;
                    let icon = null;
                    switch (btn.icon) {
                        case 'redo':
                            icon = this._renderRedoIcon(x, y, btn.icon);
                            break;
                        case 'skip':
                            icon = this._renderSkipIcon(x, y, btn.icon);
                            break;
                    }
                    return icon;
                })}
            </g>
        ) || null;
    }
    componentWillMount() {
        super.componentWillMount();
        this.state.text = this.props.text;
        this.state.borderRadius = 3;
        this.state.buttons = [];
        this.state.width = this._getActualWidth();
    }
}
