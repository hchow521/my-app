# my-blog-admin
 
 > 一个 基于node+express+mongodb 博客后台服务
 >
# demo[https://m.hchow521.xyz]
# apiURL[https://www.hchow521.xyz:3000](test:https://www.hchow521.xyz:3000/api/getinfo)
###### 后台管理vue-cli + element-ui + vue-quill-editor [https://github.com/hchow521/my-admin]
### 环境搭建
######请确保已安装 node && mongodb [https://www.runoob.com/mongodb/mongodb-tutorial.html]


```
# 确保mongodb数据库并已开启
# 新建文件上传存储路径
mkdir uploads/images -p

npm install
npm start
> Successfully connected to MongoDB
```
######如果mongoose安装失败请使用cnpm安装(╮(╯▽╰)╭)
`$ npm install -g cnpm --registry=https://registry.npm.taobao.org`

### 项目
```
┌─bin/www.js http服务（可升级https）
├─models mongoose模块
├─schemas mongoose表结构
├─routes express路由(默认数据库地址users.js >let url = "mongodb://localhost:27017/blogdb")
├─uploads/images 前端上传资源保存路径
└─app.js
```


##### mongoose管理mongo数据库增删改查 [http://www.mongoosejs.net/]
##### 密码加密 utils/token.js
##### multer保存上传图片
```
# code in app.js:43-62
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

```

##http服务升级https服务
```
# cd bin\www

- var http = require('http');
+ const https = require('https');
+ const fs = require('fs');
+ const options = {
+   key: fs.readFileSync('秘钥路径/秘钥文件名.key'),
+   cert: fs.readFileSync('秘钥路径/秘钥文件名.pem')
+ };

...

- var server = http.createServer(app);
+ var server = https.createServer(options, app);
```

