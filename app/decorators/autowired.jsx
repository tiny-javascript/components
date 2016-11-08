/**
 * 获取方法参数
 */
function getArgs(func) {
    // First match everything inside the function argument parens.
    const args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
    // Split the arguments string into an array comma delimited.
    return args.split(',').map(function(arg) {
        // Ensure no inline comments are parsed and trim the whitespace.
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function(arg) {
        // Ensure no undefined values are added.
        return arg;
    });
}
/**
 * 根据名称查询注入对象
 */
function getBeanByName(name) {
    let obj = void 0;
    _.forIn(App, (module) => {
        _.forIn(module, (bean, beanName) => {
            beanName == name && (obj = bean);
        });
    });
    return obj;
}
/**
 * 自动注入方法
 */
export default function autowired(target, name, descriptor) {
    const originFunction = descriptor.value;
    const originFunctionArguments = getArgs(originFunction);
    descriptor.value = function() {
        let newFunctionAruments = [];
        originFunctionArguments.map(argument => {
            if (argument[0] === argument[0].toUpperCase()) {
                let bean = void 0;
                if (argument == 'Link') {
                    bean = require('react-router/lib/Link');
                } else {
                    bean = getBeanByName(argument);
                }
                bean && newFunctionAruments.push(bean);
            }
        });
        if (arguments.length) {
            newFunctionAruments = _.concat(newFunctionAruments, Array.from(arguments));
        }
        return originFunction.apply(this, newFunctionAruments);
    };
    return descriptor;
}
