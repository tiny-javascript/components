const Drag = {
    Mixin: {
        /**
         * 拖拽开始事件，处理图形
         */
        __onDragStart(e) {
            if (!this.state.draggable)
                return;
            e.target.moveToTop();
            this._onDragStart(e);
            this.setStatus(this._STATUS_MOVE_);
        },
        /**
         * 拖拽移动事件，处理图形
         */
        __onDragMove(e) {
            if (!this.state.draggable)
                return;
            const {x, y} = e.target.attrs;
            this.state.x = x;
            this.state.y = y;
            this._onDragMove(e);
        },
        /**
         * 拖拽结束事件，处理图形
         */
        __onDragEnd(e) {
            if (!this.state.draggable)
                return;
            this._onDragEnd(e);
            this.setStatus(this._STATUS_ACTIVE_);
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
