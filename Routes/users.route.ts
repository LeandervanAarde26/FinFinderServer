import express ,{ Express } from "express";
import controller from '../Controllers/users.controller';

const router = express();

router.get('/user/:email', controller.getQuestions);
router.get('/user/:id', controller.getUsers);
router.post('/user', controller.addUser);
router.get('/user/materials/:id', controller.getUserMaterials);


module.exports = router;