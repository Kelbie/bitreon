var express = require('express');
var router = express.Router();
var async = require('async');

const { Client } = require('pg');
const client = new Client();

/* GET users listing. */
router.get('/:username', async (req, res, next) => {
  client.connect();
  // GET user
  const response = await client.query(`SELECT * FROM users WHERE username=$1`, [req.params.username]);
  const user = await response.rows[0];
  res.json({user: user});
});

module.exports = router;
