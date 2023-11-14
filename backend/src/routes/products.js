const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        //해당 경로에 이미지 저장
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
    //해당이름으로 이미지 저장
})

const upload = multer({storage: storage}).single('file')

//product와 관련된 요청을 수행함

//이미지 업로드 라우터
router.post('/image', auth, async (req,res,next) => {
    upload(req, res, err => {
        if(err) {
            return req.status(500).send(err);
        }
        console.log(res.req.file.filename);
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


router.get('/', async (req,res,next) => {
    //params로 전달 받음 
    //프론트에서 요청을  localhost:4000/product?order=asc (오름차순) desc: 내림차순
    const order = req.query.order ? req.query.order : 'desc';
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    //지정이 안되어 있다면 20
    const limit = req.query.limit ? req.query.limit : 20; 
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    try{
        const products = await Product.find()
            .populate('writer')
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
        //product 전체 개수 가져오기
        const productsTotal = await Product.countDocuments();
        //남은 게 더 있는지 확인
        const hasMore = skip + limit < productsTotal ? true : false
        return res.status(200).json({
            products,
            hasMore
        })
    } catch(error) { 
        next(error);
    }
})

module.exports = router;