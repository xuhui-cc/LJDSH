// const URI = 'http://dsh.lingjun.net/api.php/'    //测试接口

const URI = 'https://dsh.lingjun.net/api.php/'    //正式接口


const fetch = require('./fetch')

//登录
function login(params) {
  return fetch.dshfetchpost(URI, 'login/tologin', params)
}
//获取推文
function wenzhang(params) {
  return fetch.dshfetchpost(URI, 'news/getlist', params)
}
//获取推文
function classify(params) {
  return fetch.dshfetchpost(URI, 'sort/getlist', params)
}
//广告条
function ad(params) {
  return fetch.dshfetchpost(URI, 'ad/getlist', params)
}
//推荐书籍
function recommend(params) {
  return fetch.dshfetchpost(URI, 'books/getpushlist', params)
}
//分类书籍页
function classify_book(params) {
  return fetch.dshfetchpost(URI, 'books/getlist', params)
}
//发表留言
function post_message(params) {
  return fetch.dshfetchpost(URI, 'message/plusdata', params)
}
//获取留言
function get_message(params) {
  return fetch.dshfetchpost(URI, 'message/getlist', params)
}
//发表留言
function post_comment(params) {
  return fetch.dshfetchpost(URI, 'comment/plusdata', params)
}
//获取留言
function get_comment(params) {
  return fetch.dshfetchpost(URI, 'comment/getlist', params)
}
//获取书籍详情
function book_detail(params) {
  return fetch.dshfetchpost(URI, 'books/getinfo', params)
}
//获取书籍章节详情
function book_chapter(params) {
  return fetch.dshfetchpost(URI, 'record/getchapterid', params)
}
//获取书籍详情目录
function book_detail_catelog(params) {
  return fetch.dshfetchpost(URI, 'books/getcatelog', params)
}
//获取书籍详情评论显示
function get_book_comment(params) {
  return fetch.dshfetchpost(URI, 'comment/getlist', params)
}
//获取书籍详情推优评论显示
function get_good_comment(params) {
  return fetch.dshfetchpost(URI, 'comment/getone', params)
}
//我的书籍
function mybook(params) {
  return fetch.dshfetchpost(URI, 'order/getlist', params)
}
//移出我的书籍
function del_mybook(params) {
  return fetch.dshfetchpost(URI, 'order/deldata', params)
}
//加入我的书籍
function add_mybook(params) {
  return fetch.dshfetchpost(URI, 'order/plusdata', params)
}
//时间书轴
function book_axis(params) {
  return fetch.dshfetchpost(URI, 'books/getmonthlist', params)
}
//时间书轴年份获取
function book_years(params) {
  return fetch.dshfetchpost(URI, 'books/getmaxmin', params)
}
//获取读书时长
function get_readtime(params) {
  return fetch.dshfetchpost(URI, 'member/getreadinfo', params)
}
//返回读书时长
function post_readtime(params) {
  return fetch.dshfetchpost(URI, 'member/setreadline', params)
}
//返回读书章节
function post_readchapter(params) {
  return fetch.dshfetchpost(URI, 'record/setchapterid', params)
}
//获取热搜词
function get_hotword(params) {
  return fetch.dshfetchpost(URI, 'keywords/getlist', params)
}
//获取文章详情
function get_wenzhang(params) {
  return fetch.dshfetchpost(URI, 'news/getinfo', params)
}
//获取分享书籍
function share_poster(params) {
  return fetch.dshfetchpost(URI, 'books/getsharelist', params)
}
//数据阅读页章节内容详情
function read_detail(params) {
  return fetch.dshfetchpost(URI, 'books/getchapter', params)
}
//获取读书人数
function record(params) {
  return fetch.dshfetchpost(URI, 'record/getcount', params)
}
//搜索
function search(params) {
  return fetch.dshfetchpost(URI, 'books/getsearch', params)
}
//上下章获取
function getchapterprenext(params) {
  return fetch.dshfetchpost(URI, 'books/getchapterprenext', params)
}
//文章关联
function relation(params) {
  return fetch.dshfetchpost(URI, 'news/relation', params)
}
//阅读位置设置
function setposition(params) {
  return fetch.dshfetchpost(URI, 'record/setposition', params)
}
//阅读位置返回
function getposition(params) {
  return fetch.dshfetchpost(URI, 'record/getposition', params)
}
//阅读位置返回
function add_keywords(params) {
  return fetch.dshfetchpost(URI, 'keywords/plusdata', params)
}
//阅读位置返回
function getavatar(params) {
  return fetch.dshfetchpost(URI, 'member/getavatar', params)
}



module.exports = { login, wenzhang, classify, ad, recommend, classify_book, post_message, get_message, post_comment, get_comment, book_detail, mybook, del_mybook, book_detail_catelog, add_mybook, get_book_comment, book_axis, book_years, get_readtime, get_hotword, post_readtime, book_chapter, post_readchapter, get_wenzhang, share_poster, read_detail, record, search, getchapterprenext, get_good_comment, relation, setposition, getposition, add_keywords, getavatar}