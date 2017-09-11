// Library inclusions.
var path = require('path');
var uuid = require('uuid');
var multer = require('multer');
var express = require('express');
var fileController = require('./../controllers/FileController');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v1() + file.originalname);
  }
});

var upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    var extn = path.extname(file.originalname);
    if(extn)
        extn = extn.toLowerCase();
    
    var mime = file.mimetype;
    if(mime)
        mime = mime.toLowerCase();

    if ((mime !== 'image/png' && mime !== 'image/jpg' && mime !== 'image/jpeg') || (extn !== '.jpg' && extn !== '.jpeg' && extn !== '.png')) {
        req.fileValidationError = 'Unsupported file format!';
        return cb(null, false)
    }

    cb(null, true);
  } 
});

// Initializations.
var fileRouter = express.Router();
fileRouter.post('/upload', upload.single("file", 12), fileController.upload.bind(fileController));
module.exports = fileRouter;