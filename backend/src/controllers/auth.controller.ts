import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Role } from "../constants/roles.enum.js"; 

import { UsuarioService } from "../service/usuario.service.js";
const usuarioService = new UsuarioService();
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { ci, nombre_completo, password, id_rol } = req.body;

    if (!ci || !nombre_completo || !password || !id_rol) {
      return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    const existingUser = await usuarioService.existeCI(String(ci));
    if (existingUser) {
      return res.status(400).json({ success: false, message: "CI ya existe" });
    }

    const newUser = await usuarioService.crearUsuario({
      ci: String(ci),
      nombre_completo,
      password,
      id_rol
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

    const user = await usuarioService.validarLogin(String(ci));

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