import { guid } from '../common/utils'
import AttributeModel from './attribute_model'

class ElementModel {
    id = guid()
    // 节点类型
    type = ''
    // 节点子类型
    subType = 0
    // 上一级节点
    prevs = []
    // 下一级节点
    nexts = []
    // 节点状态
    status = ''
    // 连接点
    connectorPoints = []
    // 属性
    attribute = new AttributeModel()
    // 按钮
    buttons = []
}

export default ElementModel
