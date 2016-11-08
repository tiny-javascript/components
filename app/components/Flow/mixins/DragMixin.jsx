const Drag = {
    Mixin: {
        /**
         * 拖拽开始事件，处理图形
         */
        __onDragStart(e) {
            e.target.moveToTop();
            // 重置偏移量
            this.state.dragOffset = {
                x: 0,
                y: 0
            };
            // 设置偏移量
            let {x, y} = e.target.attrs;
            if (isNaN(x)) {
                x = this.state.x;
                y = this.state.y;
            }
            this.state.dragOffset = {
                x: e.evt.layerX - x,
                y: e.evt.layerY - y
            };
            this.state.status = this.STATUS_MOVE;
            this._onDragStart.bind(this);
        },
        /**
         * 拖拽移动事件，处理图形
         */
        __onDragMove(e) {
            const x = e.evt.layerX - this.state.dragOffset.x;
            const y = e.evt.layerY - this.state.dragOffset.y;
            this.setAxis(x, y, this._onDragMove.bind(this, x, y));
        },
        /**
         * 拖拽结束事件，处理图形
         */
        __onDragEnd() {
            this.setState({
                status: this.STATUS_ACTIVE
            }, this._onDragEnd.bind(this));
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
