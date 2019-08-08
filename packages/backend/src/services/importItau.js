const moment = require("moment")
const crypto = require('crypto')
const {Category} = require('../db')
const _ = require('lodash')
module.exports = {
  generatePreview
}


async function generatePreview(rawLines){
    const result = []
    const categories = await Category.findAll();
    for (const line of rawLines) {
      if(_.isEmpty(line)){
        continue;
      }
      const data = processLine(line, categories);
      const withSameHash = result.filter(it => it.importHash === data.importHash).length;
      if(withSameHash > 0){
        data.importHash = data.importHash + '_' + (withSameHash - 1);
      }
      result.push(data);
    }
    return result;
}

function processLine(line, categories){
	const split = line.split(';');

	if(split.length !== 3){
		return;
  }
  const name =  split[1].trim()
	let value = parseFloat(split[2].replace(',', '.').trim());
	let isDebt = false;
	if(value < 0){
		isDebt = true;
		value = value * -1;
  }
  const category = categoryFromName(categories, name);
  let categoryId = ''
  if(category){
    categoryId = category.id;
  }
	return { 
    name,
    entryDate: parseDate(split[0]),
    importHash: crypto.createHash('md5').update(line).digest('hex'), 
    isDebt,
    value,
    categoryId
  };
}

function parseDate(strDate){
	//str date is in formate 03/09/2018;
	const split = strDate.split('/');
	const date = moment(`${split[2]}-${split[1]}-${split[0]}`).toDate();
	return date
}

function categoryFromName(categories, name){
  for (const category of categories) {
    if(matchAny(category.keywords, name)){
      return category;
    }
  }
  return null;
}

function matchAny(keywords, name){
  if(!keywords || keywords.length === 0 ){
    return false
  }
  return name.toLowerCase().match(keywords.join('|').toLowerCase()) !== null
}

