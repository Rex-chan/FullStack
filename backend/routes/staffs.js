var express = require('express');
var router = express.Router();
var app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const { add, query, remove, update } = require('../controllers/staffs')
router.post('/add', add);
router.get('/query', query)
router.delete('/remove', remove)
router.patch('/update', update)

module.exports = router;
