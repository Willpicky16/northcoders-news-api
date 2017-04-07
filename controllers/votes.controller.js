const articleModel = require('../models/articles');
const commentModel = require('../models/comments');

const async = require('async');

function articleVote (req, res) {
  async.waterfall([
    function (next) {
      articleModel.findById(req.params.article_id, function (err, article) {
        if (err) return next(err);
        next(null, article);
      })
    },
    function (article, callback) {
        const vote = req.query.vote === 'up' ? 1 : -1;
        article.update({$inc: {votes: vote}}, function (err, article) {
          if (err) return callback(err);
          callback(null, article);
        })
      }
  ], function (err, result) {
    if (err) return res.status(500).send({err: err});
    // res.status(201).send({comments: `${req.query.vote} worked`});
    res.status(201).send({vote: `${req.query.vote} worked`});
  })
}


function commentVote (req, res) {
  async.waterfall([
    function (next) {
      commentModel.findById(req.params.comment_id, function (err, comment) {
        if (err) return next(err);
        next(null, comment);
      })
    },
    function (comment, callback) {
      const vote = req.query.vote === 'up' ? 1 : -1;
      comment.update({$inc: {votes: vote}}, function (err, comment) {
        if (err) return callback(err);
        callback(null, comment);
      })
    }
  ], function (err, result) {
    res.status(201).send({vote: `${req.query.vote} worked`});
  })
}

module.exports = {
  articleVote: articleVote,
  commentVote: commentVote
};
