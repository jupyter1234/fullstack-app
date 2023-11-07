const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

//client의 요청을 수행함

//인증이 되어있는 user의 정보를 토큰과 함께 client로 다시 보내주는 기능
//토큰을 확인하고 그 토큰에서 읽어온 userID를 통해 user정보를 가져오는 건 auth 미들웨어
//미들웨어에서 res.user에 user 정보를 넣어줌
//미들웨어 auth.js
router.get('/auth', auth, async (req,res,next) => {
    //auth 미들웨어를 통해 user를 받아옴
    return res.json({
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    })
})

//보낸 req를 parsing해서 body로 보내야함 -> express.json() 사용
router.post('/register', async (req,res,next) => {
    //유저 데이터를 저장
    try{
        const user = new User(req.body);
        await user.save();  //저장이 될 때까지 대기
        //다른방법
        // user.save().then(())
        // .catch
        //성공시
        return res.sendStatus(200);
    }catch (error) {
        //에러발생시 에러 처리기로 error 전달
        next(error);
    }
})


router.post('/login', async(req,res,next) => {
    //req.body에는 유저가 입력한 이메일과 비밀번호가 들어있는 상태
    try{    
        //findOne : 해당 값이 있는 row를 찾아 리턴
        //존재하는 유저인지를 체크
    
        const user = await User.findOne({email : req.body.email})

        if (!user) {
            //해당되는 유저가 없는 경우  400: client 에러
            return res.status(400).send("Auth failed, email not found");
        }
        //comparePassword : User model에서 생성한 비밀번호 대조 함수
        const isMatch = await user.comparePassword(req.body.password);

        if(!isMatch) {
            //비밀번호 오류
            return res.status(400).send("Wrong password");
        }
        //console.log("good");
        const payload =  {
            //payload에 들어가는 값은 user의 ID임
            //mongoDB에서 유저 아이디는 objectID로 되어있다 -> string 변환
            userId : user._id.toHexString(),
        }
        //로그인 성공 시 token 생성
        const accessToken = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: '1h'})

        //slice에서 userData actionPayload 에 들어가는 부분
        //client에게 유저정보와, 토큰 전달
        return res.json({user, accessToken})

    }catch (error) {
        next(error);
    }
})

//users/logout api요청 처리 auth를 통해 올바른 유저인지 확인
router.post('/logout',auth, async (req,res,next) => {
    //유저 데이터를 저장
    try{
        return res.sendStatus(200);
    }catch (error) {
        //에러발생시 에러 처리기로 error 전달
        next(error);
    }
})

module.exports = router;