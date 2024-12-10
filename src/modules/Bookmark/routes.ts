import { Router } from "express";
import bookmarkControler from "./controller.js";
import auth from "./controller.js";
import validationSchema from ""

const router = Router();
router.post("/", auth, createBookmark);


export default router;
