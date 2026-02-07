import express from "express";
import healthCheck from "../config/healthCheck.config.js";

const router = express.Router();

router.get('/',healthCheck);

export default router;