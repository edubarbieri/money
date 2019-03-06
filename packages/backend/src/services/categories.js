const { Category } = require('../sequelize')
const _ = require('lodash')
async function listWithPath(){
  const categories = await Category.findAll();
  const resp = [];
  for (const category of categories) {
    resp.push({
      id: category.id,
      name: category.name,
      pathName: getParentName(category, categories)
    })
  }
  return _.sortBy(resp, 'pathName')
}

function getParentName(category, categories){
  let pathName = category.name;
  let parentCat = filterById(categories, category.parentId)
  while(parentCat != null){
    pathName = parentCat.name + ' / ' + pathName
    parentCat = filterById(categories, parentCat.parentId)
  }
  return pathName;
}
function filterById(categories, id){
  return categories.find(cat => cat.id === id)
}

module.exports = {
  listWithPath
}