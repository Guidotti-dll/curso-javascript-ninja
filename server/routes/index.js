'use strict'

var express = require('express')
var router = express.Router()
var data = []

router.get('/', function (req, res) {
  res.json(data)
})

router.post('/', function (req, res) {
  data.push({
    image: req.body.image,
    brandModel: req.body.brandModel,
    year: req.body.year,
    plate: req.body.plate,
    color: req.body.color
  })
  res.json({ message: 'success' })
})

router.delete('/:plate', function (req, res) {
  const {plate} = req.params;

  const carIndex = data.findIndex(car => car.plate === plate);

  data.splice(carIndex, 1);
  
  res.json({ message: 'success' })
});

module.exports = router
