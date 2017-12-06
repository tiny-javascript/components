import { PROCESS_SUBTYPE_ACTION, ICON_ACTION, PROCESS_SUBTYPE_WORKFLOW, PROCESS_SUBTYPE_MANUAL, ICON_WORKFLOW, ICON_MANUAL } from '../common/constants'
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

function getIconByButtonType(type) {}

export { getIconBySubtype, getIconByButtonType }
