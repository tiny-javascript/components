class MoveModel {
    // 移动开始的对象
    source = null
    // 移动结束后的对象，主要用于连线
    target = null
    // 移动中需要被修改的对象
    node = null
    // 移动类型
    type = 0
    // 是否正在移动
    active = false
    // 开始点，基于clentX和clentY
    begin = { x: 0, y: 0 }
    // 结束点，基于clentX和clentY
    end = { x: 0, y: 0 }
}

export default MoveModel
