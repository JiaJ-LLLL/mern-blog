// Simply list of api and calls to the controller
import express from 'express';
import { getUser, getUsers, test } from '../controllers/user.controller.js';
import { updateUser, deleteUser, signout } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);

router.put('/update/:userId', verifyToken, updateUser);

router.delete('/delete/:userId', verifyToken, deleteUser);

// POST: submit data to be processed. 
router.post('/signout', signout);

router.get('/getusers', verifyToken, getUsers);

router.get('/:userId', getUser);

export default router;