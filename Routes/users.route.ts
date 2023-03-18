import express ,{ Express } from "express";
import controller from '../Controllers/users.controller';

const router = express();

router.get('/user/:id', controller.getUsers);
router.post('/user', controller.addUser);

module.exports = router;