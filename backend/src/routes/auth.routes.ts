import { Router } from "express";
import { registerUser ,loginUser} from "../controllers/auth.controller.js"; // .js obligatorio

const router = Router();

// Endpoint: POST http://localhost:3000/api/auth/register
//router.post("/register", registerUser);

export default router;
router.post("/register", registerUser);
router.post("/login", loginUser); // <-- ¡Nueva ruta!