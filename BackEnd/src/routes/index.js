import express from 'express';

//import googleOAuth from './googleOAuth.route.js';
import authUsere from './auth.route.js';


//import sendTermsConditions from './send-terms-conditions.route.js';


const router = express.Router();

router.use('/auth', authUsere);
//router.use('/auth/google', googleOAuth);

router.use(sendTermsConditions);


export default router;