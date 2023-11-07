const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

//product와 관련된 요청을 수행함


//auth : auth가 true인 사람만 수행할 수 있다
// /products/
router.post('/', auth, async (req,res,next) => {
    try{
        const product = new Product(req.body);
        product.save();
        return res.sendStatus(201);
    } catch(error) { 
        next(error);
    }
})

module.exports = router;