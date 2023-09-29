import express from "express";

import users from './users/users.routes';
import comments from './comments/comments.routes';

const router = express.Router();

router.use("/users", users)
router.use("/comments", comments)

export default router;
