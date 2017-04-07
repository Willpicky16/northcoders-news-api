const userModel = require('../models/users');

function getAllUsers (req, res) {
  userModel.find({}, function (err, users) {
    if (err) {
      return res.status(500).send({err: err});
    }
    res.status(200).send({users: users});
  })
}

function getCertainUser (req, res, next) {
  userModel.find({username: req.params.username}, function (err, users) {
    if (err) {
      return next (err);
    }
    res.status(200).send({users: users});
  })
}

module.exports = {
  getAllUsers: getAllUsers,
  getCertainUser: getCertainUser,
}
