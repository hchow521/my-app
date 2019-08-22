let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let fs = require('fs');
let bodyParser = require('body-parser');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();

app.use(bodyParser.json());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, 'dist')));
app.use(express.static(path.resolve(__dirname, 'uploads')));

// 访问单页
// app.get('*', function (req, res) {
//     let html = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');
//     res.send(html);
// });
// app.use('/', indexRouter);
app.all('*', function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control,Authorization");
    res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});
app.use('/api', usersRouter);
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const upload = multer({ storage: storage })
app.post('/upload',upload.single('file'), function (req, res) {
  res.send({
    state: 1,
    data: {
      filename: req.file.filename,
      path: 'images/'
    }
  });
})
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
