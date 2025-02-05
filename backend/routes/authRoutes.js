import express from "express";
import { registerUser, loginUser, refreshData} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
 

export default router;
