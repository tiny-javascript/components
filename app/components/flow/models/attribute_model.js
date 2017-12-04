import { SHAPE_WIDTH, SHAPE_HEIGHT } from '../common/constants'
/**
 * Node属性对象
 * 当节点为connector时，width是结束点的X坐标，height是结束点的Y坐标
 */
class AttributeModel {
    x = 10
    y = 10
    width = SHAPE_WIDTH
    height = SHAPE_HEIGHT
    text = ''
}

export default AttributeModel
