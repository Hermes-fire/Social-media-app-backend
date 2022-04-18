const express = require('express')
const router = express.Router()
//const { check, validationResult } = require('express-validator/check');


const {createUid, readUid, uidById, signup, signin, signout, requireSignin} = require('../controllers/auth')
const {userSignupValidator} = require('../validator')

//check uid
router.post('/createUID', createUid)
router.get('/readUID/:uid', readUid)


router.post('/signup', userSignupValidator, signup)
router.post('/signin', signin)
router.get('/signout', signout)
router.get("/hello", requireSignin)

router.param('uid', uidById)


module.exports = router