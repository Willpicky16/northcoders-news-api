const articleModel = require('../models/articles');
const commentModel = require('../models/comments');

const async = require('async');

function getArticles (req, res) {
  async.waterfall([
    function (next) {
      articleModel.find({}, function (err, articles) {
        if (err) return next(err);
        next(null, articles);
      })
    },
    function (articles, done) {
      async.mapSeries(articles, function (article, callback) {
        commentModel.find({belongs_to: article.id}, function (err, comments) {
          article = article.toObject();
          article.comment_count = comments.length;
          callback(null, article);
        })
      }, done)
    }
  ], function (err, articles) {
    if (err) return res.status(500).send({err: err});
    res.status(200).send({articles});
  })
}

function getCertainArticle (req, res, next) {
  articleModel.findById(req.params.article_id, function (err, articles) {
    if (err) {
      return next (err);
    }
    res.status(200).send({articles: articles});
  })
}

function getArticleComments (req, res, next) {
  async.waterfall([
    function (callback) {
      articleModel.findById(req.params.article_id, function (err, article) {
        if (err) return callback(err);
        callback(null, article);
      })
    },
    function (article, callback) {
      commentModel.find({belongs_to: article.id}, function (err, comments) {
        if (err) {
          return callback(err);
        }
        callback(null, comments);
      })
    }
  ], function (err, result) {
    if (err) return res.status(500).send({err: err});
    res.status(200).send({comments: result});
  })
}

module.exports = {
  getArticles: getArticles,
  getCertainArticle: getCertainArticle,
  getArticleComments: getArticleComments
}
