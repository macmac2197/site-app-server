import express from 'express';
import {  userSignIn, userSignUp } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/signin', userSignIn);
router.post('/signup', userSignUp);

export default router;