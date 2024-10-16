import express from "express";
import { createAccount, getUser, login } from "../controllers/userController.js";
import  authenticateToken from "../utils.js"

const router=  express.Router();

router.post("/create-account",createAccount);
router.post("/login",login);
router.get('/get-user',authenticateToken,getUser)


export default router