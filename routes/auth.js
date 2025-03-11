const express=require('express');
const authController=require('../controllers/auth');
// const authController1=require('../controllers/auth1');
const router=express.Router();

//Middle ware that is specific to this router

  
router.post('/register',authController.register);

router.post('/login', authController.login);

router.post('/registerNGO', authController.registerNGO);

router.post('/updateSegregate', authController.updateSegregate);




module.exports = router; 