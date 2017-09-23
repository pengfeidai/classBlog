var express = require('express');
var session = require('express-session');
var app = express();
var router = require('./router/router.js');

// 使用session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// 模板引擎
app.set('view engine', 'ejs');
// 静态页面
app.use(express.static('./public'));
app.use('/avator', express.static('./avator'));
// 路由表
app.get('/', router.showIndex);           //显示首页
app.get('/regist', router.showRegist);       //显示注册页面
app.post('/doregist', router.showdoRegist);    //执行注册，Ajax服务
app.get('/login', router.showLogin);     //显示登陆页面
app.post('/dologin', router.showdoLogin);    //执行登录，Ajax服务
app.get('/setavator', router.showAvator);    //设置头像页面
app.post('/dosetavator', router.showDoAvator);   //执行设置头像，Ajax服务
app.get('/cut', router.showcut);    //剪裁头像页面
app.get('/docut', router.showDocut);   //执行剪裁
app.post("/post",router.showdoPost);            //发表说说
app.get("/getallpost",router.showgetAllpost);  //列出所有说说，Ajax服务
app.get("/getuserinfo",router.getuserInfo);  //列出所有说说Ajax服务
app.get("/getallamount",router.showgetAllamount );  //说说总数
app.get("/user/:user",router.showUser);  //显示用户所有说说
// app.get("/post/:oid",router.showUser);  //显示用户所有说说
app.get("/userlist",router.showuserlist);  //显示所有用户列表


app.listen(8000);