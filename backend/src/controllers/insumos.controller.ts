import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js"; // Importación limpia del Singleton

export const createInsumo = async (req: Request, res: Response) => {
  try {
    const { codigo_interno, nombre, stock_minimo } = req.body;

    // 1. Validación de campos obligatorios
    if (!codigo_interno || !nombre) {
      return res.status(400).json({ 
        success: false, 
        message: "El código interno y el nombre son obligatorios" 
      });
    }

    // 2. Verificar si el código ya existe (Evita duplicados en hospital_db)
    const existingInsumo = await prisma.insumos.findUnique({
      where: { codigo_interno }
    });

    if (existingInsumo) {
      return res.status(400).json({ 
        success: false, 
        message: "Ese código de insumo ya está registrado" 
      });
    }

    // 3. Guardar en la base de datos usando la instancia única
    const newInsumo = await prisma.insumos.create({
      data: {
        codigo_interno,
        nombre,
        stock_minimo: stock_minimo ? Number(stock_minimo) : 0
      }
    });

    res.status(201).json({ 
      success: true, 
      message: "Insumo guardado correctamente",
      data: newInsumo 
    });

  } catch (error: any) {
    console.error("❌ Error al guardar insumo:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};