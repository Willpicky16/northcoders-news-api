const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articles.controller')
const topicController = require('../controllers/topics.controller');
const commentController = require('../controllers/comments.controller');
const voteController = require('../controllers/votes.controller');
const userController = require('../controllers/users.controller');

router.route('/').get(function (req, res) {
  res.status(200).send({status: 'OK'});
});

router.route('/topics').get(topicController.getAllTopics);
router.route('/topics/:topic_id').get(topicController.getCertainTopic);
router.route('/topics/:topic_id/articles').get(topicController.getCertainTopicArticles);

router.route('/articles').get(articleController.getArticles);
router.route('/articles/:article_id').get(articleController.getCertainArticle);
router.route('/articles/:article_id/comments').get(articleController.getArticleComments);

router.route('/users').get(userController.getAllUsers);
router.route('/users/:username').get(userController.getCertainUser);

router.route('/articles/:article_id/comments').post(commentController.newComment);

router.route('/articles/:article_id').put(voteController.articleVote);
router.route('/comments/:comment_id').put(voteController.commentVote);

router.route('/comments/:comment_id').delete(commentController.deleteComment);

router.route('/*').get(function (req, res) {
  res.status(404).send({reason: 'ROUTE NOT FOUND'})
});

module.exports = router;
