var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

const GIT_TAG = process.env.GIT_TAG || "NO_TAG_FROM_DOCKERFILE";

function route() {
  var router = new express.Router();
  router.use(cors());

  router.get('/', function(req, res) {
    res.json({tag: GIT_TAG});
  });

  return router;
}

module.exports = route;
