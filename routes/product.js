import express from 'express';
import product from '../controllers/product';
import auth from '../controllers/auth';
import user from '../controllers/user';

const router = express.Router();
//
router.get('/products', product.list);
router.get("/products/related/:productId", product.listRelated);
router.get("/products/categories", product.listCategories);
router.post("/products/search", product.listBySearch);
//
router.post('/product/add/:userId', auth.isAdmin, product.create);
router.put('/product/:productId/:userId', auth.isAdmin, product.update);
router.delete('/product/:productId/:userId', auth.isAdmin, product.remove);
//
router.get('/product/photo/:productId', product.photo)
//
router.get('/product/:productId', product.read);
router.param('productId', product.productById);
router.param('userId', user.userById);

module.exports = router;