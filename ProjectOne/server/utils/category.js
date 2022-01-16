const setArrayCategory = (obj) => {
    let category = ''
    for (const categ in obj) {
        if(!obj[categ]) {
            continue
        }
        category = categ
    }
    return category
}

module.exports = {setArrayCategory}