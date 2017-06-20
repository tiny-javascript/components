import React from 'react';
import * as Constant from '../constants';

function redoIcon(attrs) {
    return <text {...attrs}>&#xe907;</text>;
}
function continueIcon(attrs) {
    return <text {...attrs}>&#xe612;</text>;
}
function interruptIcon(attrs) {
    return <text {...attrs}>&#xe761;</text>;
}
function workflowIcon(attrs) {
    return <text {...attrs}>&#xe800;</text>;
}
function operationIcon(attrs) {
    return <text {...attrs}>&#xe7b8;</text>;
}

function craeteIcon(type, attrs, className) {
    className = className || '';
    attrs.className = 'ico ' + className;
    let icon = null;
    switch (type) {
        case Constant.ICON_REDO:
            icon = redoIcon(attrs);
            break;
        case Constant.ICON_CONTINUE:
            icon = continueIcon(attrs);
            break;
        case Constant.ICON_INTERRUPT:
            icon = interruptIcon(attrs);
            break;
        case Constant.ICON_WORKFLOW:
            icon = workflowIcon(attrs);
            break;
        case Constant.ICON_OPERATION:
            icon = operationIcon(attrs);
            break;
    }
    return icon;
}

export { craeteIcon }

