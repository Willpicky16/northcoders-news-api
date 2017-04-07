const topicModel = require('../models/topics');
const articleModel = require('../models/articles');

function getAllTopics (req, res) {
  topicModel.find({}, function (err, topics) {
    if (err) {
      return res.status(500).send({err: err});
    }
    res.status(200).send({topics: topics});
  });
}

function getCertainTopic (req, res, next) {
  topicModel.find({slug: req.params.topic_id}, function (err, topics) {
    if (topics.length === 0) {
      return res.status(404).send({reason: `Topic ${req.params.topic_id} not found`});
    }
    if (err) {
      return next(err);
    }
    res.status(200).send({topics: topics});
  })
}

function getCertainTopicArticles (req, res, next) {
  articleModel.find({belongs_to: req.params.topic_id}, function (err, articles) {
    if (articles.length === 0) {
      return res.status(404).send({reason: `Topic ${req.params.topic_id} not found`});
    }
    if (err) {
      return next(error);
    }
    res.status(200).send({articles: articles});
  })
}

module.exports = {
  getAllTopics: getAllTopics,
  getCertainTopic: getCertainTopic,
  getCertainTopicArticles: getCertainTopicArticles,
}
