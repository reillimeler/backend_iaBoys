import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

export class UsuarioService {

  // 🔍 Verifica si ya existe un usuario por CI
  async existeCI(ci: string) {
    return await prisma.usuarios.findUnique({
      where: { ci }
    });
  }

  // 👤 Crear usuario con contraseña encriptada
  async crearUsuario(data: {
    ci: string;
    nombre_completo: string;
    password: string;
    id_rol: number;
  }) {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    return await prisma.usuarios.create({
      data: {
        ci: data.ci,
        nombre_completo: data.nombre_completo,
        password_hash: hashedPassword,
        id_rol: data.id_rol
      },
      select: {
        id_usuario: true,
        nombre_completo: true,
        id_rol: true
      }
    });
  }

  // 🔐 Buscar usuario para login
  async validarLogin(ci: string) {
    return await prisma.usuarios.findUnique({
      where: { ci },
      include: { roles: true }
    });
  }


  // Buscar por ID
  async buscarPorId(id: number) {
    return prisma.usuarios.findUnique({
      where: { id_usuario: id }
    });
  }

  async obtenerUsuarios() {
  return prisma.usuarios.findMany({
    include: { roles: true },
    orderBy: { id_usuario: 'desc' }
  });
}

// Actualizar usuario
  async actualizarUsuario(id: number, data: any) {

    let updateData: any = {
      ci: data.ci,
      nombre_completo: data.nombre_completo,
      id_rol: data.id_rol
    };

    // Si viene password, la encriptamos
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(data.password, salt);
    }

    return prisma.usuarios.update({
      where: { id_usuario: id },
      data: updateData
    });
  }

// Eliminar usuario
  async eliminarUsuario(id: number) {
    return prisma.usuarios.delete({
      where: { id_usuario: id }
    });
  }
  
}