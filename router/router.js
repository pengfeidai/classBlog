var formidable = require('formidable');
var db = require('../models/db.js');
var md5 = require('../models/md5.js');
var path = require('path');
var fs = require('fs');
var gm = require('gm');

// 首页
exports.showIndex = function (req, res, next) {
  if (req.session.login == '1') {
    // 如果登录了
    var username = req.session.username;
    var login = true;
  }
  else {
    // 没登录
    var username = '';
    var login = false;
  }
  // 已经登录了，那么检索数据库，查登录人头像
  db.find('user', {username: username}, (err, result) => {
    if (result.length == 0) {
      var avator = req.session.avator;
    }
    else {
      var avator = result[0].avator;
    }
    res.render('index.ejs', {
      'login': login,
      'username': username,
      'active':'index',
      'avator': avator    // 登录人头像
    });
  });
};

// 注册页面
exports.showRegist = function (req, res, next) {
  res.render('regist.ejs', {
    'login': req.session.login == '1' ? true : false,
    'username': req.session.login == '1' ? req.session.username : '',
    'active':'注册'
  });
};

// 注册业务
exports.showdoRegist = function (req, res, next) {
  // 得到用户填写的内容
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    var name = fields.name;
    var username = fields.username;
    var password = fields.password;

    // 查询数据库中是不是有这个人
    db.find('user', {'username':username}, (err, result) => {
      if (err) {
        res.send('-3');
        return;
      }
      if (result.length != 0) {
        res.send('-1');  // 被占用
        return;
      }
      // md5加密
      password = md5(md5(password) + '1108');
      // 现在可以证明用户名没有被占用
      db.insertOne('user',{
        'name': name,
        'username': username,
        'password': password,
        'avator': req.session.avator
      }, (err, result) => {
        if (err) {
          res.send('-3');
          return;
        }
        req.session.login = '1';
        req.session.username = username;
        res.send('1');  // 注册成功，写入session
      });
    });
  });
};

// 登录页面
exports.showLogin = function (req, res, next) {
  res.render('login.ejs', {
    'login': req.session.login == '1' ? true : false,
    'username': req.session.login == '1' ? req.session.username : '',
    'active':'登录'
  });
};

// 登录业务
exports.showdoLogin = function (req, res, next) {
  // 得到用户表单
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    var username = fields.username;
    var password = fields.password;
    // 加密
    password = md5(md5(password) + '1108');
    // 查询数据库，看看是否有这个人
    db.find('user', {'username':username}, (err, result) => {
      if (err) {
        res.send('-3');
        return;
      }
      if (result.length == 0) {
        res.send('-1');   // 用户名不存在
        return;
      }
      if (password == result[0].password) {
        req.session.login = '1';
        req.session.username = username;
        res.send('1');  // 登录成功
        return;
      }
      else {
        res.send('-2');   // 密码错误
        return;
      }
    });
  });
}

// 设置头像页面，必须是登录状态
exports.showAvator = function (req, res, next) {
  // if (req.session.login != '1') {
  //   res.send('非法闯入，这个页面要求登录！')
  //   return;
  // }
  res.render('setavator.ejs', {
    'login': true,
    'username': req.session.username || 'Davis',
    'active':'修改头像'
  });
};

exports.showDoAvator = function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = path.normalize(__dirname + '/../avator');
  form.parse(req, (err, fields, files) => {
    var oldpath = files.avator.path;
    var newpath = path.normalize(__dirname + '/../avator') + '/' + req.session.username + '.jpg';
    fs.rename(oldpath, newpath, (err) => {
      if (err) {
        res.send('失败！');
        return;
      }
      req.session.avator = req.session.username + '.jpg';
      //更改数据库当前用户的avatar这个值
      db.updateMany("user", {"username": req.session.username}, {
        $set: {"avator": req.session.avator}
        }, function (err, results) {
        // 跳转到切的业务
        res.redirect('/');
      });
    });
  });
};

// 显示切图页面
exports.showcut = function (req, res) {
  res.render('cut.ejs', {
    avator: req.session.avator
  });
}

// 执行切图
exports.showDocut = function(req,res,next){
    //这个页面接收几个GET请求参数
    //文件名、w、h、x、y
    var filename = req.session.avator;
    var w = req.query.w;
    var h = req.query.h;
    var x = req.query.x;
    var y = req.query.y;

    gm("./avator/" + filename)
        .crop(w,h,x,y)
        .resize(100,100,"!")
        .write("./avator/" + filename, (err) => {
        if(err){
            // res.send("-1");
            console.log(err);
            return;
        }
        //
        res.send("1");
    });
};


// 发表说说
exports.showdoPost =  function (req, res, next) {
  //必须保证登陆
  if (req.session.login != "1") {
    res.send("非法闯入，这个页面要求登陆！");
    return;
  }
  // 用户名
  var username = req.session.username;

  // 得到用户填写的内容
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    var content = fields.content;
      db.insertOne('posts',{
        'username': username,
        'datatime': new Date(),
        'content': content
      }, (err, result) => {
        if (err) {
          res.send('-3');
          return;
        }
        res.send('1');
      });
    });
};

// 列出所有说说,分页功能
exports.showgetAllpost = function(req, res, next) {
  // 这个页面接收一个参数，页面
  var page = req.query.page;
  db.find('posts',{}, {"pageamount":10, "page": page, "sort":{"datatime":-1}}, (err, result) => {
      res.json(result);
  });
};

// 列出某个用户信息
exports.getuserInfo = function(req,res,next){
    //这个页面接收一个参数，页面
    var username = req.query.username;
    db.find("user",{"username":username},function(err,result){
        if(err || result.length == 0){
            res.json("");
            return;
        }
        var obj = {
            "username": result[0].username,
            "avator": result[0].avator,
            "_id": result[0]._id,
        };
        res.json(obj);
    });
};

//说说总数量
exports.showgetAllamount = function(req,res,next){
    db.getAllCount("posts",function(count){
        res.send(count.toString());
    });
};

// 显示某一个用户的个人主页
exports.showUser = function(req,res,next){
    var user = req.params["user"];
    db.find("posts",{"username":user},function(err,result){
       db.find("user",{"username":user},function(err,result2){
           res.render("user",{
               "login": req.session.login == "1" ? true : false,
               "username": req.session.login == "1" ? req.session.username : "",
               "user" : user,
               "active" : "我的主页",
               "cirenshuoshuo" : result,
               "cirentouxiang" : result2[0].avator
           });
       });
    });

};

//显示所有注册用户
exports.showuserlist = function(req,res,next){
    db.find("user", {}, (err,result) =>{
        res.render("userlist.ejs", {
            "login": req.session.login == "1" ? true : false,
            "username": req.session.login == "1" ? req.session.username : "",
            "active" : "成员列表",
            "alluser" : result
        });
    });
};