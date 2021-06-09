import express from 'express';
const router = express.Router();

import user from '../controllers/user';
import auth from '../controllers/auth';

// router.get('/secret/:userId', auth.isAuth, auth.isAdmin, (req, res) => {
//     res.json({
//         user: req.profile
//     })
// });
//
router.get('/user/:userId', auth.isAuth, user.read);
router.put('/user/:userId', auth.isAuth, user.bodyUpdate);
router.param('userId', user.userById);

module.exports = router;