const Router = require('koa-router');
// const multer = require('koa-multer')
const { multer } = require('lib/s3bucket')
const filesCtrl = require('./files.ctrl');
const { needAuth } = require('lib')
const upload = multer('board')

const files = new Router();

files.post('/boards/:board_id', needAuth, upload.single('image'), filesCtrl.upload);
files.delete('/boards/:board_id/:file_id', needAuth, filesCtrl.delete);

module.exports = files;