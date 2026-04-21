import { Router } from "express";
import { createInsumo,getInsumos } from "../controllers/insumos.controller.js";

const router = Router();

// Ruta para guardar insumos
router.post("/insumos", createInsumo);
router.get('/', getInsumos);

export default router;