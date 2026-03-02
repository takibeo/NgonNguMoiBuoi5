var express = require('express');
var router = express.Router();
let Role = require('../schemas/roles');

// get all roles (excluding deleted)
router.get('/', async function (req, res, next) {
  let data = await Role.find({});
  let result = data.filter(r => !r.isDeleted);
  res.send(result);
});

// get one by id
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let doc = await Role.findById(id);
    if (doc && !doc.isDeleted) {
      res.send(doc);
    } else {
      res.status(404).send({ message: 'ID not found' });
    }
  } catch (error) {
    res.status(404).send({ message: 'ID not found' });
  }
});

// create new role
router.post('/', async function (req, res, next) {
  let newRole = new Role({
    name: req.body.name,
    description: req.body.description
  });
  await newRole.save();
  res.send(newRole);
});

// update
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updated = await Role.findByIdAndUpdate(id, req.body, { new: true });
    res.send(updated);
  } catch (err) {
    res.status(404).send({ message: 'ID not found' });
  }
});

// soft delete
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let removed = await Role.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    res.send(removed);
  } catch (err) {
    res.status(404).send({ message: 'ID not found' });
  }
});

module.exports = router;