const EventMap = new Map();
/**
 * 事件池
 */
const EventContainer = {
    /**
     * 执行事件
     */
    executeEvent(type, args) {
        args = args && args || [];
        if (EventMap.has(type)) {
            const funcs = EventMap.get(type);
            funcs.map(item => {
                const {source, func} = item;
                if (func) {
                    source[func] && source[func](...args);
                }
            })
        }
    },
    /**
     * 添加事件
     */
    addEventListener(type, source, func) {
        if (typeof source !== 'object')
            throw new Error('来源参数必须是一个对象');

        // 如果指定了方法，方法参数为字符串
        if (func && typeof func !== 'string')
            throw new Error('方法参数必须是一个字符串');
        console.log('[Event Add]', type, func);
        if (EventMap.has(type)) {
            const funcs = EventMap.get(type);
            funcs.push({source, func});
            EventMap.set(type, funcs);
        } else {
            EventMap.set(type, [
                {
                    source,
                    func
                }
            ]);
        }
    },
    /**
     * 移除事件
     */
    removeEventListener(type, source) {
        if (typeof source !== 'object')
            throw new Error('来源参数必须是一个对象');
        if (EventMap.has(type)) {
            if (source) {
                const funcs = [];
                EventMap.get(type).map(item => {
                    if (item.source != source) {
                        funcs.push(item);
                    }
                });
                if (funcs.length) {
                    EventMap.set(type, funcs);
                } else {
                    EventMap.delete(type);
                }
            } else {
                EventMap.delete(type);
            }
        }
    }
}

export default EventContainer;
