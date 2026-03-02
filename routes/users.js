var express = require('express');
var router = express.Router();
let User = require('../schemas/users');

// get all users (not deleted)
router.get('/', async function (req, res, next) {
  let data = await User.find({});
  let result = data.filter(u => !u.isDeleted);
  res.send(result);
});

// get user by id
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let user = await User.findById(id);
    if (user && !user.isDeleted) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'ID not found' });
    }
  } catch (error) {
    res.status(404).send({ message: 'ID not found' });
  }
});

// create new user
router.post('/', async function (req, res, next) {
  let newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    status: req.body.status,
    role: req.body.role,
    loginCount: req.body.loginCount
  });
  await newUser.save();
  res.send(newUser);
});

// update
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updated = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.send(updated);
  } catch (err) {
    res.status(404).send({ message: 'ID not found' });
  }
});

// soft delete
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let removed = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    res.send(removed);
  } catch (err) {
    res.status(404).send({ message: 'ID not found' });
  }
});

// enable user (status true)
router.post('/enable', async function (req, res, next) {
  let { email, username } = req.body;
  let user = await User.findOne({ email, username });
  if (user) {
    user.status = true;
    await user.save();
    res.send(user);
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

// disable user (status false)
router.post('/disable', async function (req, res, next) {
  let { email, username } = req.body;
  let user = await User.findOne({ email, username });
  if (user) {
    user.status = false;
    await user.save();
    res.send(user);
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

module.exports = router;
