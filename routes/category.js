import express from 'express';
import category from '../controllers/category';
import auth from '../controllers/auth';
import user from '../controllers/user';


const router = express.Router();
//
router.get('/category', category.list);
//
router.post('/category/add/:userId', auth.isAdmin, category.create);

router.put('/category/:categoryId/:userId', auth.isAdmin, category.update);
router.delete('/category/:categoryId/:userId', auth.isAdmin, category.remove);
//
router.get('/category/photo/:categoryId', category.photo);
//
router.get('/category/:categoryId', category.read);
router.param('categoryId', category.cateById);
router.param('userId', user.userById);

module.exports = router;