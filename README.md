# 班级博客

前端迈向全栈入门篇。此项目是基于 Node.js + Express + ejs+ MongoDB + Bootstrap 搭建的班级博客系统。


主要功能模块：

未登录：

- 首页：首页是一个轮播图，导航栏有成员列表、关于、登录，注册等模块。
- 注册登录页：用户登录注册功能、头像上传、用户识别和持久化。

![图片预览](http://ot4esom84.bkt.clouddn.com/17-9-24/67170567.jpg)

登录状态：

- 全部说说：可发表说说、显示班级所有成员的说说（分页功能）。
- 我的主页：显示登录成员的个人的全部说说。
- 成员列表：班级所有成员的头像，用户名，可跳转至成员个人主页。

![图片预览](http://ot4esom84.bkt.clouddn.com/17-9-24/70347273.jpg)

## 技术栈

【前端】

+ HTML/CSS/JS：亘古不变三件套
+ ES6：ECMAScript 新一代语法，这也是以后的趋势
+ jQuery：主要用到 jQuery 的 ajax 方法处理异步请求和 DOM 操作
+ Bootstrap：页面 UI 框架，天然响应式
+ ejs：是一个后端的模板引擎，用来生成 HTML

【后端】

+ Node.js：整个后端由 Node.js 驱动；用 npm 安装资源文件
+ Express：一个基于 Node.js 平台的 web 开发框架，由路由和中间件构成

【数据库】

+ mongoDB：进行数据存储的 NoSQL 数据库
+ mongoose：Node.js 的 mongodb 驱动软件包，是进行 mongoDB 快速建模的工具


## 收获

1. 熟悉了 ejs 的语法及其在 Node.js 中的使用方法，了解到 ejs 的优缺点及如何取舍
2. 初步掌握了 express 框架的使用，如何处理路由以及中间件
3. 掌握了 mongoose 在 Node.js 中如何连接数据库，以及 schema、model、entity 的使用
4. 前后端数据传递与视图展现的流程
5. 学会了使用 bcryptjs（Node.js 的一个加解密模块）对密码进行 “hash + salt” 处理
6. 借助会话与 cookie 进行用户识别和持久化


## Build Setup

```
# clone the repo into your disk.
$ git clone https://github.com/pengfeidai/classBlog

# install dependencies
$ npm install

# run
$ npm start   or   node app.js 

# visit
$ http://localhost:8000/

# mongodb
$ mongod --storageEngine mmapv1 --dbpath D:\mongo(路径为存放mongo的位置)
```

