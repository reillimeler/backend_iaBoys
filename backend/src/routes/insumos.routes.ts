import { Router } from "express";
import { createInsumo,getInsumos, getStockTotal,getInsumosDashboard ,getAlertasVencimiento,getBajoStock,updateInsumo,deleteInsumo} from "../controllers/insumos.controller.js";

const router = Router();

// Ruta para guardar insumos sprint 1

router.post("/", createInsumo);
// rutas del sprin 2
router.get('/getinsumos', getInsumos);
router.get("/dashboard",getInsumosDashboard); // La más completa para Rodrigo
router.get("/stock-total", getStockTotal);      // Solo stock sumado
router.get("/vencimientos", getAlertasVencimiento); // Solo lo que va a caducar
router.get("/bajo-stock", getBajoStock);        // Solo alertas de cantidad

// probando crud de editar y eleiminar;
// 🔥 NUEVAS
router.put("/:id", updateInsumo);
router.delete("/:id", deleteInsumo);

export default router;