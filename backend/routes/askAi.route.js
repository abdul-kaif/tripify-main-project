import express from "express";
import { askAi } from "../controllers/askAi.controller.js";

const router = express.Router();

router.post("/", askAi);

export default router;