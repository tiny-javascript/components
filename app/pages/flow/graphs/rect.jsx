import React from 'react';
import Shape from './shape';
import { SHAPE_WIDTH } from '../layout';
const ACTION_LATYOUT_WIDTH = 25;
export default class Rect extends Shape {
    _getTextWidth(text) {
        text = text || '';
        const node = document.getElementById('text');
        node.innerHTML = text;
        return node.offsetWidth;
    }
    _getActualWidth(text) {
        const textWidth = this._getTextWidth(text) + 20;
        return textWidth > SHAPE_WIDTH && textWidth || SHAPE_WIDTH;
    }
    _onIconClick(key, e) {
        e.stopPropagation();
        const { buttons } = this.state;
        const btn = buttons.find(item => item.icon == key);
        btn.onClick();
    }
    _renderRedoIcon(x, y, key) {
        const attrs = { x, y, key };
        attrs.onClick = this._onIconClick.bind(this, key);
        return <text {...attrs} className="flow-icon">&#xe031;</text>;
    }
    _renderContinueIcon(x, y, key) {
        const attrs = { x, y, key };
        attrs.onClick = this._onIconClick.bind(this, key);
        return <text {...attrs} className="flow-icon">&#xe250;</text>;
    }
    _renderInterruptIcon(x, y, key) {
        const attrs = { x, y, key };
        attrs.onClick = this._onIconClick.bind(this, key);
        return <text {...attrs} className="flow-icon">&#xe250;</text>;
    }
    _renderIcon(x, y, icon) {
        let element = null;
        switch (icon) {
            case 'redo':
                element = this._renderRedoIcon(x, y, icon);
                break;
            case 'continue':
                element = this._renderContinueIcon(x, y, icon);
                break;
            case 'interrupt':
                element = this._renderInterruptIcon(x, y, icon);
                break;
        }
        return element;
    }
    _renderOther() {
        const { width, height, buttons } = this.state;
        return buttons.length && (
            <g className="flow-action-layout">
                <rect x={width - ACTION_LATYOUT_WIDTH} y="0" width={ACTION_LATYOUT_WIDTH} height={height}></rect>
                {buttons.map((btn, index) => this._renderIcon(width - ACTION_LATYOUT_WIDTH / 2, 20 + (12 + 5) * index, btn.icon))}
            </g>
        ) || null;
    }
    _render() {
        const { fill, width, height, borderRadius } = this.state;
        return <rect x="0" y="0" rx={borderRadius} ry={borderRadius} width={width} height={height} fill={fill}></rect>
    }
    componentWillMount() {
        super.componentWillMount();
        this.state.text = this.props.text;
        this.state.borderRadius = 3;
        this.state.buttons = [];
        this.state.width = this._getActualWidth();
    }
    setText(text) {
        let width = this._getActualWidth(text);
        this.setState({ text, width });
    }
    setButton(button) {
        let buttons = [];
        if (button.redo) {
            buttons.push({
                icon: 'redo',
                onClick: button.onRedoClick
            });
        }
        if (button.continue) {
            buttons.push({
                icon: 'continue',
                onClick: button.onContinueClick
            });
        }
        if (button.interrupt) {
            buttons.push({
                icon: 'interrupt',
                onClick: button.onInterruptClick
            });
        }
        this.setState({ buttons });
    }
}
