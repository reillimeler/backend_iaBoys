import { Router } from "express";
import { createInsumo } from "../controllers/insumos.controller.js";

const router = Router();

// Ruta para guardar insumos
router.post("/insumos", createInsumo);

export default router;