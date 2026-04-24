import { Router } from "express";
import { createLote } from "../controllers/lote.controller.js";

const router = Router();

// Ruta para reponer stock (Crear nuevo lote)
router.post("/", createLote);

export default router;