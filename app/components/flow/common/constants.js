// 基本参数
export const SHAPE_WIDTH = 120
export const SHAPE_HEIGHT = 60
export const SHAPE_WIDTH_MAX = 240
export const MIN_GAP = 20 // 线与节点的最小间隔
export const POINT_RADIUS = 3
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
export const ICON_CONTINUE = 'continue'
export const ICON_SKIP = 'skip'
export const ICON_INTERRUPT = 'interrupt'
export const ICON_CHECK_SCRIPT = 'checkScript'
export const ICON_WORKFLOW = 'workflow'
export const ICON_ACTION = 'action'
export const ICON_MANUAL = 'manual'
// 连接点位置
export const POSITION_TOP = 'top'
export const POSITION_BOTTOM = 'bottom'
export const POSITION_LEFT = 'left'
export const POSITION_RIGHT = 'right'
// 参数
export const OPTION_ELEMENT_CREATE = 'create'
export const OPTION_ELEMENT_DELETE = 'delete'
export const OPTION_ELEMENT_UPDATE = 'update'
