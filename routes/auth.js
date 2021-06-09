import express from 'express';
const router = express.Router();

import auth from "../controllers/auth";
import { userSignupValidator } from "../validator";
//
router.post('/signup', userSignupValidator, auth.signup);
router.post('/signin', auth.signin);
router.get('/signout', auth.signout);

module.exports = router;