const express = require('express')
const router = express.Router()
//const { check, validationResult } = require('express-validator/check');


const {createUid, readUid, checkUid, uidById, signup, signin, signout, requireSignin} = require('../controllers/auth')
const {userSignupValidator} = require('../validator')

//check uid
router.post('/createUID', createUid)
router.get('/readUID/:uid', readUid)
router.get('/checkUID/:uid', checkUid) // check if not already signedUp

router.post('/signup', userSignupValidator, signup)

router.post('/signin', signin)

//router.get('/signout', signout)

router.get("/checkjwt", requireSignin, (req,res)=>{
    res.json({
        success: true,
        msg: 'valid token'
    })
})

router.param('uid', uidById)


module.exports = router