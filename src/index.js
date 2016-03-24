/**
 * Imports
 */

var babel = require('babel-core')
var camelCase = require('camel-case')
/**
 * auto-yield
 */

function autoYield(code, generatorNames) {
  var nextNames = generatorNames

  var result = babel.transform(code, {
    plugins: [{visitor: {FunctionExpression, FunctionDeclaration}}]
  })

  while (nextNames.length) {
    generatorNames = nextNames
    nextNames = []
    result = babel.transform(result.code, {
      plugins: [{visitor: {CallExpression}}]
    })
  }
  return result.code

  function CallExpression (path) {
    var parent = path.parentPath
    if (path.parentPath.node.type !== 'YieldExpression' && generatorNames.indexOf(path.node.callee.name) >= 0) {
      path.replaceWith(babel.types.yieldExpression(path.node))
      while (parent.node.type !== 'FunctionExpression' && parent.node.type !== 'FunctionDeclaration') {
        parent = parent.parentPath
      }
      if (!parent.node.generator) {
        parent.replaceWith(babel.types[camelCase(parent.node.type)](parent.node.id, parent.node.params, parent.node.body, true))
        if (parent.node.id && parent.node.id.name) {
          nextNames.push(parent.node.id.name)
        }
      }
    }
  }

  function FunctionExpression (path) {
    if (path.node.generator) {
      nextNames.push(path.node.id.name)
    }
  }

  function FunctionDeclaration (path) {
    if (path.node.generator) {
      nextNames.push(path.node.id.name)
    }
  }


}




/**
 * Exports
 */

export default autoYield
