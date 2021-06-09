import Category from '../models/category';
import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';

class CateController {

    create(req, res) {
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            console.log('---------------------')
            // console.log(fields);
            if (err) {
                return res.status(400).json({
                    message: "Failed"
                })
            }
            const { name } = fields;
            if (!name) {
                return res.status(400).json({
                    error: "Nhap du thong tin vao`"
                })
            }
            let category = new Category(fields);
            if (files.photo) {
                if (files.photo.size > 5000000) {
                    res.status(400).json({
                        error: "nhap anh vo van qua"
                    })
                }
                category.photo.data = fs.readFileSync(files.photo.path);
                category.photo.contentType = files.photo.type;
            }
            // console.log(req)
            category.save((err, data) => {
                if (err) {
                    return res.status(400).json({
                        err: "Failed"
                    })
                }
                res.send(data)
            })
        })

    }
    cateById(req, res, next, id) {
        Category.findById(id).exec((err, category) => {
            if (err || !category) {
                res.status(404).json({
                    error: "not found"
                })
            }
            req.category = category;
            next();
        })
    }
    read(req, res) {
        return res.json(req.category);
    }
    remove(req, res) {
        let category = req.category;
        category.remove((err, deleteCate) => {
            if (err) {
                return res.status(404).json({
                    error: "can't delete"
                })
            }
            res.json({
                deleteCate,
                message: "delete done"
            })
        })
    }
    list(req, res) {
        Category.find().select("-photo").exec((err, data) => {
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
            const { name } = fields;
            if (!name) {
                return res.status(400).json({
                    error: "Chua nhap du thong tin"
                })
            }
            let cate = req.category;
            cate = _.assignIn(cate, fields)
            if (files.photo) {
                if (files.photo.size > 2000000) {
                    res.status(400).json({
                        error: "Nhap anh qua gioi han"
                    })
                }
                cate.photo.data = fs.readFileSync(files.photo.path);
                cate.photo.contentType = files.photo.path;
            }
            cate.save((err, data) => {
                if (err) {
                    res.status(400).json({
                        err: "Failed"
                    })
                }
                res.json(data)
            })
        })
    }
    photo(req, res, next) {
        if (req.category.photo.data) {
            res.set("Content-Type", req.category.photo.contentType);
            return res.send(req.category.photo.data);
        }
        next();
    }
    
}
export default new CateController;