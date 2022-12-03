const router = require('express').Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getuserInfo,
} = require('../controllers/users');

router.post('/signin', login);

router.get('/', getUsers);

router.get('/me', getuserInfo);

router.get('/:userId', getUser);

router.post('/signup', createUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
