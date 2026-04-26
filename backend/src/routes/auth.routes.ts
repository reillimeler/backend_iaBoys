import { Router } from "express";
import { registerUser ,loginUser,getUsuarios,updateUsuario,deleteUsuario} from "../controllers/auth.controller.js"; // .js obligatorio

const router = Router();

// Endpoint: POST http://localhost:3000/api/auth/register
//router.post("/register", registerUser);

export default router;
router.post("/register", registerUser);
router.post("/login", loginUser); // <-- ¡Nueva ruta!

router.get('/getUsuario', getUsuarios);
router.put("/:id", updateUsuario); // <-- ¡Nueva ruta!
router.delete("/:id", deleteUsuario); // <-- ¡Nueva ruta!
