const fs = require("fs")
let products = []
let categories = []

exports.initialize = () => {
    return new Promise((resolve, reject) => {
        fs.readFile("./data/products.json", 'UTF-8', (err, data) => {
            if (err) {
                reject(err)
                return

            }try {
                products = JSON.parse(data)
            }
            catch (err) {
                console.log(err)
            }
        })

        fs.readFile("./data/categories.json", 'UTF-8', (err, data) => {
            if (err) {
                reject(err)
                return
            }try {
                categories = JSON.parse(data)
            }
            
            catch (err) {
                console.log(err)
            }
        })

        resolve()
    })
}

exports.getAllProducts = () => {
    return new Promise(function (resolve, reject) {
        if (products.length == 0) {
            reject("No results returned")
            return
        }
     resolve(products)
    })
}

exports.getCategories = () => {
    return new Promise(function (resolve, reject) {
        if (categories.length == 0) {
            reject("No results returned")
            return
        }

        resolve(categories)
    })
}

exports.getPublishedProducts = () => {
    return new Promise(function (resolve, reject) {
        let published = products.filter(function (products) { return products.published == true })
        if (published.length == 0) {
            reject("No results returned")
            return
        }
        resolve(published)
    })
}

exports.getProductsByMinDate = function (minDateStrng) {
    return new Promise(function (resolve, reject) {
        var productsByMinDate = [];

        for (let i = 0; i < products.length; i++) {
            if (new Date(products[i].productDate) >= new Date(minDateStrng)) {
                
                productsByMinDate.push(products[i]);
            }
        }

        if (productsByMinDate.length == 0) {
            reject("No result returned");
            return;
        }

        resolve(productsByMinDate);
    });

}

exports.getproductById = function (id) {
    return new Promise(function (resolve, reject) {
        var productById = [];

        for (let i = 0; i < products.length; i++) {
            if (products[i].id == id) {
                productById.push(products[i]);
            }
        }

        if (productById.length == 0) {
            reject("No result returned");
            return;
        }

        resolve(productById);
    });
}

exports.getProductsByCategory = function (category) {
    return new Promise(function (resolve, reject) {
        var productsByCategory = [];

        for (let i = 0; i < products.length; i++) {

            if (poroducts[i].category == category) {
                productsByCategory.push(products[i]);
            }
        }

        if (productsByCategory.length == 0) {
            reject("No result returned");
            return;
        }

        resolve(productsByCategory);
    });
}

exports.addProduct = (dataProduct) => {
    return new Promise(function (resolve, reject) {
        dataProduct.published = (dataProduct.published) ? true : false;
        dataProduct.id = products.length + 1;
        products.push(dataProduct);

        resolve();
    })
}

