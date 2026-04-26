import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const createLote = async (req: Request, res: Response) => {
  try {
    const { id_insumo, numero_lote, cantidad_inicial, fecha_vencimiento } = req.body;

    // 1. Validación de campos
    if (!id_insumo || !numero_lote || !cantidad_inicial || !fecha_vencimiento) {
      return res.status(400).json({ 
        success: false, 
        message: "Todos los campos son obligatorios para la reposición" 
      });
    }

    // 2. Verificar que el insumo existe
    const insumoExiste = await prisma.insumos.findUnique({
      where: { id_insumo: Number(id_insumo) }
    });

    if (!insumoExiste) {
      return res.status(404).json({ success: false, message: "El insumo no existe" });
    }

    // 3. Crear el nuevo lote
    const nuevoLote = await prisma.lotes.create({
      data: {
        id_insumo: Number(id_insumo),
        numero_lote,
        //cantidad_inicial: Number(cantidad_inicial),
        cantidad_disponible: Number(cantidad_inicial), // Al inicio es la misma
        fecha_vencimiento: new Date(fecha_vencimiento),
      }
    });

    res.status(201).json({
      success: true,
      message: `Stock repuesto: Se agregaron ${cantidad_inicial} unidades a ${insumoExiste.nombre}`,
      data: nuevoLote
    });

  } catch (error: any) {
    console.error("❌ Error al crear lote:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};