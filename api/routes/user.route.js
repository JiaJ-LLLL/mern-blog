// Simply list of api and calls to the controller
import express from 'express';
import { test } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test', test);

export default router;