const commentModel = require('../models/comments');

const async = require('async');

function newComment (req, res, next) {
  let comment = new commentModel(req.body);
  comment.save({belongs_to: req.params.article_id}, function (err, comment) {
    if (err) {
      return res.status(500).send({err: err});
    }
    res.status(201).json({comment: comment});
  })
}

function deleteComment (req, res) {
  commentModel.findById(req.params.comment_id).remove(function (err, comments) {
    if (err) {
      return res.status(404).send({reason: 'COMMENT NOT FOUND'});
    }
    res.status(200).send({comment: 'DELETED', data: comments});
  })
}

module.exports = {
  newComment: newComment,
  deleteComment: deleteComment
}
