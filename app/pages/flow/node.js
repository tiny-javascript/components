function setAttributes(node, attrs) {
    for (let attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
            let value = attrs[attr];
            node.setAttribute(attr, value)
        }
    }
}

function hasClass(node, cls) {
    let classnames = node.getAttribute('class');
    if (classnames) {
        return classnames.indexOf(cls) !== -1;
    } else {
        return false;
    }
}

function queryInParents(node, selector) {
    while (node) {
        if (hasClass(node, selector)) {
            break;
        }
        if (node.tagName.toLowerCase() == 'html') {
            node = null;
            break;
        }
        node = node.parentNode;
    }
    return node;
}

export {
    setAttributes, queryInParents
}