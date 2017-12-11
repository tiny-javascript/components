import {
    PROCESS_SUBTYPE_ACTION,
    ICON_ACTION,
    PROCESS_SUBTYPE_WORKFLOW,
    PROCESS_SUBTYPE_MANUAL,
    ICON_WORKFLOW,
    ICON_MANUAL,
    BUTTON_TYPE_ABORT,
    BUTTON_TYPE_AUDIT,
    BUTTON_TYPE_HANDLE,
    BUTTON_TYPE_REDO,
    BUTTON_TYPE_SKIP,
    ICON_ABORT,
    ICON_AUDIT,
    ICON_SKIP,
    ICON_REDO,
    BUTTON_LAYER_WIDTH
} from '../common/constants'
function getIconBySubtype(subtype) {
    let icon = ''
    switch (subtype) {
        case PROCESS_SUBTYPE_ACTION:
            icon = ICON_ACTION
            break
        case PROCESS_SUBTYPE_WORKFLOW:
            icon = ICON_WORKFLOW
            break
        case PROCESS_SUBTYPE_MANUAL:
            icon = ICON_MANUAL
            break
    }
    return icon
}

function getIconByButtonType(type) {
    let icon = ''
    switch (type) {
        case BUTTON_TYPE_ABORT:
            icon = ICON_ABORT
            break
        case BUTTON_TYPE_AUDIT:
            icon = ICON_AUDIT
            break
        case BUTTON_TYPE_HANDLE:
            icon = ICON_MANUAL
            break
        case BUTTON_TYPE_REDO:
            icon = ICON_REDO
            break
        case BUTTON_TYPE_SKIP:
            icon = ICON_SKIP
            break
    }
    return icon
}

function getButttonIconAxis(fontSize, elementHeight, index, buttonCount) {
    let step = elementHeight / (buttonCount + 1)
    console.log(step)
    return {
        x: BUTTON_LAYER_WIDTH / 2,
        y: step * index + fontSize / 2 + (index - 1) * 5
    }
}

export { getIconBySubtype, getIconByButtonType, getButttonIconAxis }
