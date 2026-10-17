function validate(data){
  if (!data.title || data.title.trim()==="") {
    return "title is invalid"
}

else if (!data.category || data.category.trim()==="") {
    return  "Category is invalid"
}

else if (!data.contents || data.contents.trim()==="") {
    return "contents is invalid"
}

 return null
}

module.exports = {validate};