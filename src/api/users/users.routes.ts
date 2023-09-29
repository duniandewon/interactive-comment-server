import { Router } from "express";
import { getUsers, registerUser } from "./users.controller";

const router = Router()

router.get("/", getUsers)
router.post("/", registerUser)


export default router