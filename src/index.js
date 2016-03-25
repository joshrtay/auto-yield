/**
 * Imports
 */

var babel = require('babel-core')
var camelCase = require('camel-case')
/**
 * auto-yield
 */

function autoYield(code, generatorNames) {
  generatorNames = generatorNames || []
  var result = babel.transform(code, {
    plugins: [{visitor: {CallExpression}}]
  })
  return result.code


  function CallExpression (path) {
    var parent = path.parentPath
    if (parent.node.type !== 'YieldExpression' && isGenerator(path.node.callee, path.scope)) {
      path.replaceWith(babel.types.yieldExpression(path.node))
      while (parent.node.type !== 'FunctionExpression' && parent.node.type !== 'FunctionDeclaration') {
        parent = parent.parentPath
      }
      if (!parent.node.generator) {
        parent.replaceWith(babel.types[camelCase(parent.node.type)](parent.node.id, parent.node.params, parent.node.body, true))
      }
    }
  }

  function isGenerator (callee, scope) {
    if (callee.object) {
      return isMethodGenerator(callee.object.name, callee.property.name, scope)
    } else {
      return isFunctionGenerator(callee.name, scope)
    }
  }

  function isFunctionGenerator (name, scope) {
    scope = findBindingScope(name, scope)
    if (scope) {
      return scope.bindings[name].path.node.generator || (!scope.parent && generatorNames.indexOf(name) >= 0)
    } else {
      return generatorNames.indexOf(name) >= 0
    }
  }

  function isMethodGenerator (objectName, propertyName, scope) {
    scope = findBindingScope(objectName, scope)
    //XXX add real support for methods
    return !scope.parent && generatorNames.indexOf(objectName) >= 0
  }

  function findBindingScope (name, scope) {
    while (scope && !scope.bindings[name]) {
      scope = scope.parent
    }
    return scope
  }


}




/**
 * Exports
 */

export default autoYield
