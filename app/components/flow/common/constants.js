// 基本参数
export const SHAPE_WIDTH = 120
export const SHAPE_HEIGHT = 60
export const SHAPE_WIDTH_MAX = 240
export const MIN_GAP = 20 // 线与节点的最小间隔
export const RECT_RADIUS = 3
export const POINT_RADIUS = 3
export const BUTTON_LAYER_WIDTH = 30
export const VERSION = '1.0'
// 字体
export const FONT_SIZE = 12
export const FONT_FAMILY = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'
export const MIN_FONT_SIZE = 80
export const MAX_FONT_SIZE = 160
export const LINE_HEIGHT = 15
// 节点类型
export const ELEMENT_TYPE_EVENT = 'event' // 事件
export const ELEMENT_TYPE_PROCESS = 'process' // 流程
export const ELEMENT_TYPE_DECISION = 'decision' // 判断
export const ELEMENT_TYPE_CONNECTOR = 'connector' // 流程线
export const ELEMENT_TYPE_DATA = 'data' // 数据（输入/输出）
// 子节点类型
export const EVENT_SUBTYPE_START = 1 // 开始事件
export const EVENT_SUBTYPE_OVER = 2 // 结束事件
export const PROCESS_SUBTYPE_WORKFLOW = 1 // 编排任务
export const PROCESS_SUBTYPE_ACTION = 2 // 操作任务
export const PROCESS_SUBTYPE_MANUAL = 3 // 人工任务
// 节点状态
export const ELEMENT_STATUS_ACTIVE = 'active'
export const ELEMENT_STATUS_ERROR = 'error'
export const ELEMENT_STATUS_PROCESSS = 'process'
export const ELEMENT_STATUS_DISABLED = 'disabled'
export const ELEMENT_STATUS_SUCCESS = 'success'
export const ELEMENT_STATUS_PAUSE = 'pause'
// 图形状态
export const GRAPH_STATUS_EDIT = 'edit'
export const GRAPH_STATUS_LINK = 'link'
export const GRAPH_STATUS_MOVE = 'move'
export const GRAPH_STATUS_READONLY = 'readonly'
export const GRAPH_STATUS_DISABLED = 'disabled'
// 移动类型
export const MOVE_ELEMENT = 'MOVE_ELEMENT' // 节点移动
export const MOVE_VIEW = 'MOVE_VIEW' // 画面移动
export const MOVE_LINE = 'MOVE_LINE' // 连线移动
// 图标类型
export const ICON_REDO = 'redo'
export const ICON_SKIP = 'skip'
export const ICON_ABORT = 'abort'
export const ICON_AUDIT = 'audit'
export const ICON_WORKFLOW = 'workflow'
export const ICON_ACTION = 'action'
export const ICON_MANUAL = 'manual'
// 连接点位置
export const POSITION_TOP = 'top'
export const POSITION_BOTTOM = 'bottom'
export const POSITION_LEFT = 'left'
export const POSITION_RIGHT = 'right'
export const POSITION_CENTER_VERTICAL = 'center-vertical'
export const POSITION_CENTER_HORIZONTAL = 'center-horizontal'
// 参数
export const OPTION_ELEMENT_CREATE = 'element_create'
export const OPTION_ELEMENT_DELETE = 'element_delete'
export const OPTION_ELEMENT_UPDATE = 'element_update'
export const OPTION_ELEMENT_ALIGN = 'element_align'
export const OPTION_GRAPH_UPDATE = 'graph_update'
export const OPTION_GRAPH_VALIDATE = 'graph_validate'
export const OPTION_GRAPH_QUERY = 'graph_query'
// 按钮类型
export const BUTTON_TYPE_REDO = 11 // 重做按钮
export const BUTTON_TYPE_SKIP = 12 // 跳过按钮
export const BUTTON_TYPE_ABORT = 13 // 中断按钮
export const BUTTON_TYPE_AUDIT = 14 // 审核按钮
export const BUTTON_TYPE_HANDLE = 15 // 人工按钮
// 错误类型
export const ERROR_LOOP_CLOSURE = 'ERROR_LOOP_CLOSURE' // 循环错误
export const ERROR_LINK_BREAK = 'ERROR_LINK_BREAK' // 连接断开错误
