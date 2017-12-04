import React from 'react'
import uuid from 'uuid'
import * as Constant from '../constants'

function redoIcon(attrs, type) {
    return (
        <text key={type} {...attrs}>
            &#xe947;
        </text>
    )
}
function continueIcon(attrs, type) {
    return (
        <text key={type} {...attrs}>
            &#xe946;
        </text>
    )
}
function manualIcon(attrs, type) {
    return (
        <text key={type} {...attrs}>
            &#xe982;
        </text>
    )
}
function interruptIcon(attrs, type) {
    return (
        <text key={type} {...attrs}>
            &#xe761;
        </text>
    )
}
function checkScriptIcon(attrs, type) {
    return (
        <text key={type} {...attrs}>
            &#xe9b6;
        </text>
    )
}
function workflowIcon(attrs, type) {
    return (
        <text key={type} {...attrs}>
            &#xe800;
        </text>
    )
}
function operationIcon(attrs, type) {
    return (
        <text key={type} {...attrs}>
            &#xe7b8;
        </text>
    )
}
function inspectIcon(attrs, type) {
    return (
        <text key={type} {...attrs}>
            &#xe981;
        </text>
    )
}

function createIcon(type, attrs, className) {
    attrs = attrs || {}
    className = className || ''
    attrs.className = 'ico ' + className
    let icon = null
    let title = ''
    switch (type) {
        case Constant.ICON_REDO:
            title = _ts_('button.redo')
            icon = redoIcon(attrs, type)
            break
        case Constant.ICON_SKIP:
        case Constant.ICON_CONTINUE:
            title = _ts_('button.skip')
            icon = continueIcon(attrs, type)
            break
        case Constant.ICON_MANUAL:
            title = _ts_('button.manual')
            icon = manualIcon(attrs, type)
            break
        case Constant.ICON_INTERRUPT:
            title = _ts_('button.abort')
            icon = interruptIcon(attrs, type)
            break
        case Constant.ICON_CHECK_SCRIPT:
            title = _ts_('button.check.script')
            icon = checkScriptIcon(attrs, type)
            break
        case Constant.ICON_WORKFLOW:
            icon = workflowIcon(attrs, type)
            break
        case Constant.ICON_OPERATION:
            icon = operationIcon(attrs, type)
            break
        case Constant.ICON_INSPECT:
            icon = inspectIcon(attrs, type)
            break
    }
    return (
        <g key={uuid.v4()}>
            <title>{title}</title>
            {icon}
        </g>
    )
}

export { createIcon }
