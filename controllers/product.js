import Product from '../models/product';
import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';

class ProductController {

    create(req, res) {
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            console.log('---------------------')
            console.log(fields);
            if (err) {
                return res.status(400).json({
                    message: "Failed"
                })
            }
            const { name, description, price, category } = fields;

            if (!name || !description || !price || !category) {
                return res.status(400).json({
                    error: "Nhap du thong tin vao`"
                })
            }
            let product = new Product(fields);
            if (files.photo) {
                if (files.photo.size > 5000000) {
                    res.status(400).json({
                        error: "nhap anh vo van qua"
                    })
                }
                product.photo.data = fs.readFileSync(files.photo.path);
                product.photo.contentType = files.photo.type;
            }
            // console.log(files)
            product.save((err, data) => {
                if (err) {
                    return res.status(400).json({
                        err: "Failed"
                    })
                }
                res.send(data)
            })
        })

    }
    productById(req, res, next, id) {
        Product.findById(id).exec((err, product) => {
            if (err || !product) {
                res.status(404).json({
                    error: "not found"
                })
            }
            req.product = product;
            next();
        })
    }
    read(req, res) {
        return res.json(req.product);
    }
    remove(req, res) {
        let product = req.product;
        product.remove((err, deleteProduct) => {
            if (err) {
                return res.status(404).json({
                    error: "can't delete"
                })
            }
            res.json({
                deleteProduct,
                message: "delete done"
            })
        })
    }
    list(req, res) {
        Product.find().exec((err, data) => {
            if (err) {
                res.status(404).json({
                    error: "not found"
                })
            }
            res.json(data);
        })

    }
    update(req, res) {
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    message: "Failed"
                })
            }
            const { name, description, price, category } = fields;
            if (!name || !description || !price || !category) {
                return res.status(400).json({
                    error: "Chua nhap du thong tin"
                })
            }
            let newProduct = req.product;
            newProduct = _.assignIn(newProduct, fields)
            if (files.photo) {
                if (files.photo.size > 2000000) {
                    res.status(400).json({
                        error: "Nhap anh qua gioi han"
                    })
                }
                newProduct.photo.data = fs.readFileSync(files.photo.path);
                newProduct.photo.contentType = files.photo.path;
            }
            newProduct.save((err, data) => {
                if (err) {
                    res.status(400).json({
                        err: "Failed"
                    })
                }
                res.send(data)
            })
        })
    }
    photo(req, res, next) {
        if (req.product.photo.data) {
            res.set("Content-Type", req.product.photo.contentType);
            return res.send(req.product.photo.data);
        }
        next();
    }
    listCategories(res) {
        Product.distinct("category", {}, (err, categories) => {
            if (err) {
                res.status(400).json({
                    error: "Products not found"
                })
            }
            res.json(categories);
        })
    }
    listRelated(req, res) {
        let limit = req.query.limit ? req.query.limit : 5;

        Product.find({
            _id: { $ne: req.product },
            category: req.product.category
        }) // $ne: not include
            .limit(limit)
            .populate('category', '_id name',)
            .exec((err, products) => {
                if (err) {
                    res.status(400).json({
                        error: "Products not found"
                    })
                }
                res.json(products)
            })
    }
    /**
     * Hiển thị danh sách sản phẩm khi tìm kiếm
     * Được áp dụng khi tìm kiếm ở react hoặc js project
     * Hiển thị các danh mục trong checkbox và khoảng giá trong radio buttons
     * user click vào checkbox và radio buttons
     * sẽ thiết kế api và hiển thị danh sách sản phẩm mà người dùng tìm kiếm
     */
    listBySearch() {
        let order = req.query.order ? req.query.order : 'asc';
        let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
        let limit = req.query.limit ? +req.query.limit : 6;
        let skip = parseInt(req.body.skip);
        let findArgs = {}
    
    
        for (let key in req.body.filters) {
            if (req.body.filters[key].length > 0) {
                if (key === "price") {
                    // gte - greater than price [0 - 10]
                    // lte - nhỏ hơn 
                    findArgs[key] = {
                        $gte: req.body.filters[key][0],
                        $lte: req.body.filters[key][1],
                    };
                } else {
                    findArgs[key] = req.body.filters[key];
                }
            }
        }
        Product.find(findArgs)
            .select("-photo")
            .populate("category")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, data) => {
                if (err) {
                    res.status(400).json({
                        error: "Products not found"
                    })
                }
                res.json({
                    size: data.length,
                    data
                })
            });
    }
    
}
export default new ProductController;


