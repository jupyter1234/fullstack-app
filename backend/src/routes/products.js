const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(res, file, cb) {
        //해당 경로에 이미지 저장
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
    //해당이름으로 이미지 저장
})

const upload = multer({storage: storage}).single('file')

//product와 관련된 요청을 수행함

//이미지 업로드 라우터
router.post('/', auth, async (req,res,next) => {
    upload(req, res, err => {
        if(err) {
            return req.status(500).send(err);
        }
        return res.json({filename: res.req.file.filename})
    }) 
})

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