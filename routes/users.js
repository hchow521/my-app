let express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  token = require('../utils/token'),
  User = require('../models/user'),
  Article = mongoose.model('Article', require('../schemas/article'));

let url = "mongodb://localhost:27017/blogdb";
mongoose.connect(url, function (err) {
  if (err) throw err;
  console.log('Successfully connected to MongoDB');
});

/*rules
* ##http协议
*
* 400  数据格式不正确
* 401  token不正确或过期
* 403  数据库报错
*
* ##res.data
* #state
* >> 1 状态正常/操作完成
* >> 0 操作失败
*
*
*
* */


//---------------------------------------------------登陆
router.post('/login', function (req, res) {
  let login_user = req.body;
  if (login_user && login_user.username && login_user.password) {
    User.getAuthenticated(`${login_user.username}`, `${login_user.password}`, function (err, user, reason) {
      if (err) throw err;

      // login was successful if we have a user
      if (user) {
        // handle login success
        res.json({
          state: 1,
          data: {
            token: token.createToken({}, 7200),
            username: user.username
          }
        });
        return;
      }

      // otherwise we can determine why we failed

      res.json({state: 0, err: reason});
      // let reasons = User.failedLogin;
      // switch (reason) {
      //     case reasons.NOT_FOUND:
      //         res.json({ state: 0, msg: '用户不存在！' });
      //
      //     case reasons.PASSWORD_INCORRECT:
      //         // note: these cases are usually treated the same - don't tell
      //         // the user *why* the login failed, only that it did
      //         res.json({ state: 0, msg: '密码不正确！' });
      //         break;
      //     case reasons.MAX_ATTEMPTS:
      //         // send email or otherwise notify user that account is
      //         // temporarily locked
      //         res.json({ state: 0, msg: '账户被锁定，超过登陆尝试次数，请联系工作人员！' });
      //         break;
      // }
    });
  } else {
    res.status(400).send({error: '用户名或密码格式错误！'});
  }

});

//---------------------------------------------获取系统信息
router.get('/getinfo', function (req, res) {
  let user_token = req.get('Authorization')
  if (!user_token) {
    res.status(400).json({state: 0, msg: '未验证token'})
  } else {
    if (token.checkToken({}, `${user_token}`)) {
      let os = require('os');
      res.json({
        state: 1,
        msg: '服务器连接成功',
        data: {
          '系统名称': os.hostname(),
          '系统类型': os.type(),
          '系统平台': os.platform(),
          '系统版本号': os.release(),
          '获取CPU架构': os.arch(),
          '系统当前运行的时间': +os.uptime(),
          '系统总内存量': (os.freemem() / 1024 / 1024 / 1024).toFixed(1) + (os.totalmem() / 1024 / 1024 / 1024).toFixed(1) + 'G',
          '每个 CPU/内核的信息': os.cpus().map(item => { return { model: item.model, speed: item.speed + 'MHz'}})
        }
      })
    } else {
      res.status(401).json({state: 0, msg: '未验证token'})
    }
  }


});


//------------------------------------------------------添加新用户
router.post('/add_user', function (req, res) {
  let userinfo = req.body;
  let r_username = userinfo.username;
  let r_phone = userinfo.phone;
  if (r_username && r_phone) {
    User.findOne({$or: [{username: r_username}, {phone: r_phone}]}, function (err, user) {
      if (err) return res.status(403).json({error: err});
      if (user) return res.json({state: 0, error: '用户名或手机号已被注册'});
      let newUser = new User({
        username: userinfo.username,
        password: userinfo.password,
        phone: userinfo.phone,
        email: userinfo.email || '',
      });
      newUser.save(function (err, user) {
        if (err) return res.status(403).json({error: err});
        res.json({state: 1})
      });
    })
  } else {
    res.status(400).json({error: '查询信息格式错误'})
  }
});

//--------------------------------------------------删除用户
router.post('/delete_user', function (req, res) {
  let user_id = req.body.id;
  !user_id ? res.status(400).json({error: '用户ID为空'}) :
    User.remove({ '_id': user_id }, function (err) {
      if (err) return res.status(403).json({error: err});
      res.json({ state: 1 });
    })
})

//------------------------------------------------编辑用户
router.post('/edit_user', function (req,res) {
  let editUser = req.body;
  User.findOne({ '_id': editUser['_id'], username: editUser.username }, function (err, user) {
    if (err) return res.status(403).json({error: err});
    if (!user) return res.json({ state: 0, error: '查无此用户' })
    user.update({email: editUser.email, phone: editUser.phone}, function (err) {
      if (err) return res.status(403).json({error: err});
      res.json({ state: 1 });
    })
  });

})

//--------------------------------------------------获取用户列表（返回_id,usernmae,phone,email)
router.get('/get_userlist', function (req, res) {
  User.find({}, { username: 1, phone: 1, email: 1 }, function (err, user) {
    if (err) return res.status(403).json({error: err});
    res.json({state: 1, data: user});
  });
});

//------------------------------------------------添加文章
router.post('/add_article', function (req, res) {
  let user_token = req.get('Authorization')
  if (!user_token || (user_token && token.checkToken({}, `${user_token}`))) {
    res.status(401).json({state: 0, msg: '未验证token'})
  } else {
    let articleInfo = Object.assign({createDate: Date.now()}, req.body);
    let newArticle = new Article(articleInfo);
    newArticle.save(function (err, user) {
      if (err) return res.status(403).json({error: err});
      res.json({state: 1})
    });
  }
});

//------------------------------------------------获取文章列表
router.get('/get_articlelist', function (req, res) {
  Article.find({}, function (err, data) {
    if (err) return res.status(403).json({ error: err });
    res.json({ state: 1, data });
  });
});

//--------------------------------------------------获取单篇文章


router.get('/get_article', function (req, res) {
  let articleID = req.query.articleID
  if (articleID) {
    Article.findOne({ '_id': articleID }, function (err, data) {
      if (err) return res.status(403).json({ error: err });
      if (!data) return res.json({ state: 0, error: '找不到文章' });
      res.json({state: 1, data})
    })
  } else {
    res.status(400).json({ error: '查询id为空' });
  }
});

//-----------------------------------------------删除文章

router.post('/delete_article', function (req, res) {
  let aricleID = req.body.articleID;
  !aricleID ? res.status(400).json({error: '文章ID为空'}) :
    Article.remove({ '_id': aricleID }, function (err) {
      if (err) return res.status(403).json({error: err});
      res.json({ state: 1 });
    })
})



module.exports = router;
