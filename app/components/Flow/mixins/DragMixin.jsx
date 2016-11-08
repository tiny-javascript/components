const Drag = {
    Mixin: {
        /**
         * 拖拽开始事件，处理图形
         */
        __onDragStart(e) {
            e.target.moveToTop();
            this.setStatus(this.STATUS_MOVE);
            this._onDragStart(e);
        },
        /**
         * 拖拽移动事件，处理图形
         */
        __onDragMove(e) {
            const {limitArea} = this.state;
            let {x, y} = e.target.attrs;
            if (limitArea) {
                const [xMin, xMax] = limitArea.x;
                const [yMin, yMax] = limitArea.y;
                if (xMin && x < xMin) {
                    x = xMin;
                } else if (xMax && x > xMax) {
                    x = xMax;
                }
                if (yMin && y < yMin) {
                    y = yMin;
                } else if (yMax && y > yMax) {
                    y = yMax;
                }
            }
            this.setAxis(x, y);
            this._onDragMove(e);
        },
        /**
         * 拖拽结束事件，处理图形
         */
        __onDragEnd(e) {
            this.setStatus(this.STATUS_ACTIVE);
            this._onDragEnd(e)
        },
        /**
         * 拖拽开始事件，处理业务
         * @desc 需要重写
         */
        _onDragStart() {},
        /**
         * 拖拽移动事件，处理业务
         * @desc 需要重写
         */
        _onDragMove(x, y) {},
        /**
         * 拖拽结束事件，处理业务
         * @desc 需要重写
         */
        _onDragEnd() {},
        /**
         * 获取所有拖拽事件
         */
        _getDragEvents() {
            return {ondragstart: this.__onDragStart.bind(this), ondragmove: this.__onDragMove.bind(this), ondragend: this.__onDragEnd.bind(this)};
        }
    }
};
export default Drag.Mixin;
