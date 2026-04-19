import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Role } from "../constants/roles.enum.js"; 
import { prisma } from "../lib/prisma.js"; // <--- Usamos solo la instancia única

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { ci, nombre_completo, password, id_rol } = req.body;

    if (!ci || !nombre_completo || !password || !id_rol) {
      return res.status(400).json({ 
        success: false, 
        message: "Faltan datos obligatorios" 
      });
    }

    const existingUser = await prisma.usuarios.findUnique({ 
      where: { ci: String(ci) } 
    });
    
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Esta CI ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.usuarios.create({
      data: {
        ci: String(ci),
        nombre_completo,
        password_hash: hashedPassword,
        id_rol: Number(id_rol) 
      },
      select: { id_usuario: true, nombre_completo: true, id_rol: true }
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { ci, password } = req.body;

    if (!ci || !password) {
      return res.status(400).json({ success: false, message: "Datos incompletos" });
    }

    const user = await prisma.usuarios.findUnique({
      where: { ci: String(ci) },
      include: { roles: true } 
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }

    // --- APLICACIÓN DEL ENUM ---
    let welcomeMessage = "Bienvenido al sistema";
    
    if (user.id_rol === Role.ADMIN) {
      welcomeMessage = "Bienvenido, Administrador Principal";
    } else if (user.id_rol === Role.ALMACEN) {
      welcomeMessage = "Acceso concedido al Inventario de Insumos";
    }

    res.status(200).json({
      success: true,
      message: welcomeMessage,
      user: {
        id: user.id_usuario,
        nombre: user.nombre_completo,
        rol: user.roles.nombre_rol 
      }
    });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};