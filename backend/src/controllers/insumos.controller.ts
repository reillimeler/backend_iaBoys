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


// control pro lotes de. Consulta de Disponibilidad (HU06)
export const getStockTotal = async (req: Request, res: Response) => {
  try {
    const stock = await prisma.insumos.findMany({
      include: {
        lotes: true // Traemos los lotes asociados [cite: 208]
      }
    });

    // Formateamos para que el Frontend reciba el "stock_total" sumado [cite: 195]
    const resultado = stock.map(insumo => ({
      codigo_interno: insumo.codigo_interno,
      nombre: insumo.nombre,
      stock_total: insumo.lotes.reduce((acc, lote) => acc + lote.cantidad_disponible, 0) // Si en el futuro el hospital tuviera miles de lotes, podrías usar _sum en .reduce()
    }));

    res.status(200).json({ success: true, data: resultado });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getInsumosDashboard = async (req: Request, res: Response) => {
  try {
    // Traemos los insumos incluyendo sus lotes activos [cite: 199, 242]
    const insumos = await prisma.insumos.findMany({
      include: {
        lotes: {
          where: { cantidad_disponible: { gt: 0 } } // Solo lotes con stock [cite: 199]
        }
      }
    });

    const fechaHoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaHoy.getDate() + 30); // Margen de 30 días [cite: 199]

    const dataConAlertas = insumos.map(insumo => {
      // 1. Calculamos el stock total sumando todos sus lotes (HU06) [cite: 199]
      const stockTotal = insumo.lotes.reduce((acc, lote) => acc + lote.cantidad_disponible, 0);

      // 2. Verificamos si algún lote está próximo a vencer (HU05) [cite: 147, 199]
      const tieneVencimientoCercano = insumo.lotes.some(lote => 
        new Date(lote.fecha_vencimiento) <= fechaLimite
      );

      return {
        id_insumo: insumo.id_insumo,
        codigo_interno: insumo.codigo_interno,
        nombre: insumo.nombre,
        stock_total: stockTotal,
        stock_minimo: insumo.stock_minimo,
        // HU07: Alerta de Bajo Stock si el total es <= al mínimo [cite: 151, 200]
        alertaStock: stockTotal <= (insumo.stock_minimo ?? 0),
        // HU05: Alerta de Vencimiento si algún lote vence pronto [cite: 147, 199]
        alertaVencimiento: tieneVencimientoCercano,
        // Detalle de lotes para que Rodrigo pueda mostrarlos si quiere
        detalles_lotes: insumo.lotes 
      };
    });

    res.status(200).json({ success: true, data: dataConAlertas });
  } catch (error: any) {
    console.error("Error en Dashboard:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// por lotes:Control de Vencimientos (HU05)
export const getAlertasVencimiento = async (req: Request, res: Response) => {
  try {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 30);

    const lotesProximos = await prisma.lotes.findMany({
      where: {
        fecha_vencimiento: { lte: fechaLimite },
        cantidad_disponible: { gt: 0 } // Solo lotes que aún tienen stock [cite: 55]
      },
      include: { insumo: true },
      orderBy: { fecha_vencimiento: 'asc' }
    });

    res.status(200).json({ success: true, data: lotesProximos });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//Alerta de Bajo Stock (HU07)
export const getBajoStock = async (req: Request, res: Response) => {
  try {
    const insumos = await prisma.insumos.findMany({
      include: { lotes: true }
    });

    // Filtramos solo los que cumplen la condición de alerta [cite: 150, 151]
    const alertas = insumos
      .map(i => ({
        nombre: i.nombre,
        stock_minimo: i.stock_minimo,
        stock_actual: i.lotes.reduce((acc, l) => acc + l.cantidad_disponible, 0)
      }))
      .filter(i => i.stock_actual <= (i.stock_minimo ?? 0));

    res.status(200).json({ success: true, data: alertas });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};




// Obtener todos los insumos para el Dashboard
export const getInsumos = async (req: Request, res: Response) => {
  try {
    const insumos = await prisma.insumos.findMany({
      orderBy: { creado_en: 'desc' } // Los más nuevos primero
    });
    res.status(200).json({ success: true, data: insumos });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
