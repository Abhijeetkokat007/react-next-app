import express from "express";
import { fetchUsers, addUser, healthCheck } from "../controllers/userController.js";

const router = express.Router();

router.get("/", fetchUsers);
router.post("/", addUser);
router.get("/health", healthCheck);


export default router;
