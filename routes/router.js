const express = require('express');
const Product = require('../models/Product');
const multer = require('multer');
const router = express.Router();

//uploading files using multer***************************
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './productimg');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    //reject a file that
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    fileFilter: fileFilter,

});
//************************************************ */

//add product
router.post('/product', upload.array('productImage', 5), async (req, res) => {
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        productImage: req.files.map(item => item.path.toString().split('productimg\\')[1]),
        barcodeDetails: {
            name: req.body.name,
            price: req.body.price,
            size: req.body.size,
            manufacturingYear: req.body.manufacturingYear
        }
    })
    try {
        const savedProduct = await product.save();
        //console.log('produtc', savedProduct)
        res.status(200).json(savedProduct)
    } catch (error) {
        res.status(500).json(error)
    }
})

//view all products
router.get('/product', async (req, res) => {
    try {
        const products = await Product.find();
        for (let product of products) {
            //calculating price including tax
            const taxRate = 5;
            let value = (product.price / 100) * taxRate;
            let totalPrice = product.price + value;
            product.price = totalPrice;
        }
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
    }
})

//get product
router.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id })
        if (!product) {
            res.status(404).json('product not found')
        }
        else {
            //calculating price including tax
            const taxRate = 5;
            let value = (product.price / 100) * taxRate;
            let totalPrice = product.price + value;
            product.price = totalPrice;

            res.status(200).json(product)
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

//update product
router.put('/product/:id', upload.array('productImage', 5), async (req, res) => {
    try {
            Product.findByIdAndUpdate({ _id: req.params.id }, {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    productImage: req.files.map(item => item.path.toString().split('productimg\\')[1]),
                    barcodeDetails: {
                        name: req.body.name,
                        price: req.body.price,
                        size: req.body.size,
                        manufacturingYear: req.body.manufacturingYear
                    }
                }
            }).then(async () => {
                const product = await Product.findOne({ _id: req.params.id });
                res.status(200).json(product)
            })
    } catch (error) {
        res.status(500).json(error)
    }
})

//delete product
router.delete('/product/:id', async (req, res) => {
    Product.findByIdAndDelete({ _id: req.params.id })
        .then(data => {
            if (!data) {
                res.status(404).json('product not found')
            } else {
                res.status(200).json('product deleted')
            }
        })
        .catch(error => {
            res.status(500).json(error)
        });
})


module.exports = router;