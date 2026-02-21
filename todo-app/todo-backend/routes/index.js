const express = require('express');
const router = express.Router();

const configs = require('../util/config')
const redis = require('../redis')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (req, res) => {
  const statistics = await redis.getAsync('todo_counter')
  res.send({
    added_todos: JSON.parse(statistics) || 0
  });
})

module.exports = router;
