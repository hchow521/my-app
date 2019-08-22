# my-blog-admin
 
 > 一个 基于node+express+mongodb 博客后台服务
 >
******可搭配我搭建的前台体验功能，链接在下面↓******

###### 后台管理vue-cli + element-ui + vue-quill-editor [https://github.com/hchow521/my-admin]
### 环境搭建
######请确保已安装 node && mongodb [https://www.runoob.com/mongodb/mongodb-tutorial.html]
```$xslt
确保mongodb服务器已开启
管理员cmd执行>>net start MongoDB
npm install
npm start
```
######如果mongoose安装失败请使用cnpm安装(╮(╯▽╰)╭)
`$ npm install -g cnpm --registry=https://registry.npm.taobao.org`

### 项目
```$xslt
┌─models mongoose模块
├─schemas mongoose表结构
├─routes express路由
├─uploads/images 前端上传资源保存路径
└─app.js
```


##### mongoose管理mongo数据库增删改查 [http://www.mongoosejs.net/]
##### 密码加密 utils/token.js
##### multer保存上传图片

