/**
 * @ 把常用的增删改查，都封装成为module；
 * @ 此模块封装了所有对数据库的常用操作
 */
var MongoClient = require('mongodb').MongoClient;
var settings = require('./settings.js');

// 将连接数据库封装成内部函数
function _connectDB (callback) {
  var url = settings.dburl;  // 从settings文件中读数据库地址
  // 连接数据库
  MongoClient.connect(url, (err, db) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(err, db);
  });
}

init();

function init(){
    //对数据库进行一个初始化
    _connectDB(function(err, db){
        if (err) {
            console.log(err);
            return;
        }
        db.collection('user').createIndex(
            { "username": 1},
            null,
            function(err, results) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("索引建立成功");
            }
        );
    });
}

// 插入数据
exports.insertOne = function (collectionName, json, callback) {
  _connectDB((err, db) => {
    db.collection(collectionName).insertOne(json, (err, result) => {
      callback(err, result);
      db.close();  // 关闭数据库
    })
  })
};


// 查找数据，找到所有数据。args是个对象{"pageamount":2,"page":page}
exports.find = function (collectionName, json, C, D) {
  var result = [];  // 结果数组
  if (arguments.length == 3) {
    // 那个参数C就是callback，参数D没有传
    var callback = C;
    var skipnumber = 0;
    // 数目限制
    var limit = 0;
  }
  else if (arguments.length == 4){
    var callback = D;
    var args = C;
    // 应该省略的条数
    var skipnumber = args.pageamount * args.page || 0;
    // 数目限制
    var limit = args.pageamount || 0;
    //排序方式
    var sort = args.sort || {};
  }
  else {
    throw new Error("find函数的参数个数，必须是3个或者4个。");
    return;
  }


  //连接数据库，连接之后查找所有
  _connectDB((err, db) => {
    var cursor = db.collection(collectionName).find(json).skip(skipnumber).limit(limit).sort(sort);;
    cursor.each((err, doc) => {
      if (err) {
        callback(err, null);
        db.close();
        return;
      }
      if (doc != null) {
        result.push(doc);   // 放入结果数组
      }
      else {
        // 遍历结束，没有更多文档了
        callback(null, result);
        db.close();
      }
    });
  });
}

// 删除数据
exports.deleteMany = function (collectionName, json, callback) {
  _connectDB((err, db) => {
    db.collection(collectionName).deleteMany(
      json,
      (err, result) => {
        callback(err, result);
        db.close();
      });
  })
}

// 删除数据
exports.updateMany = function (collectionName, json1, json2, callback) {
  _connectDB((err, db) => {
     db.collection(collectionName).updateMany(
      json1,
      json2,
      (err, result) => {
        callback(err, result);
        db.close();
      });
  })
}

// 得到总数量
exports.getAllCount = function (collectionName, callback) {
  _connectDB((err, db) => {
    db.collection(collectionName).count({}).
      then((count) => {
        callback(count);
        db.close();
      });
  })
}