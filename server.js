/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _Harsh Mittal_____________________ Student ID: __
146122205____________ Date: __07/11/2022_____________
*
*  Online (Cyclic) Link: 
*
********************************************************************************/

var express = require("express")
var app = express()
var productService = require('./product-service')
var path = require("path")
app.use('/public', express.static(path.join(__dirname, "public")));

const multer = require("multer");
const upload = multer();
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({
    cloud_name: 'dxcpvhvwx',
    api_key: '514826358615888',
    api_secret: '05_BF7z3Dq93VAAjbKIfbOaHYYk',
    secure: true
});

var HTTP_PORT = process.env.PORT || 8080

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/index.html"));
})

app.get("/products", (req, res) => {
    productService.getPublishedProducts().then((data) => {
            res.json({ data })
        }).catch((err) => {
            res.json({ message: err })
        })
})

app.get("/categories", (req, res) => {
    productService.getCategories().then((data) => {
            res.json({ data })
        }).catch((err) => {
            res.json({ message: err })
        })
})

app.get("/products/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addProducts.html"));
})

app.post("/products/add", upload.single("featureImage"), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }

        upload(req).then((uploaded) => {
            processProduct(uploaded.url);
        });
    } else {
        processProduct("");
    }

    function processProduct(imageUrl) {
        req.body.featureImage = imageUrl;
        console.log(req.body)
        productService.addProduct(req.body).then(() => {
            res.redirect('/demos');
        })

    }

})

app.get('/products/:id', (req, res) => {
    productService.getproductById(req.params.id).then((data) => {
        res.json(data)
    })
    .catch((err) => {
        res.json({ message: err });
    })
})

app.get("/demos", (req, res) => {
    if (req.query.category) {
        productService.getPublishedProducts().then((data) => {
                res.json({ data })
            })

            .catch((err) => {
                res.json({ message: err })
            })
    }

    else if (req.query.minDateStr) {
        productService.getProductsByMinDate(req.query.minDateStr).then((data) => {
                res.json({ data })
            })

            .catch((err) => {
                res.json({ message: err })
            })
    }

    else {
        productService.getAllProducts().then((data) => {
                res.json({ data })
            })

            .catch((err) => {
                res.json({ message: err })
            })
    }
})

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/views/.html"))
})

productService.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Express http server listening on ${HTTP_PORT}`)
        })
    })

    .catch(() => {
        console.log(" Failed promises")
    })
