import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.model";
import { generateJWT } from "../helpers/jwt";

const createUser = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
  }: { name: string; email: string; password: string } = req.body;
  try {
    // En caso no encuentre nada el findOne retorna null
    const user = await UserModel.findOne({ email: email });
    console.log("user", user);
    if (user) {
      return res.status(400).json({
        ok: true,
        msg: `Ya existe un usuario con el correo ${email}`,
      });
    }
    const userDb = new UserModel(req.body);
    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    userDb.password = bcrypt.hashSync(password, salt);
    await userDb.save();
    // Generar JWT
    const token = await generateJWT(userDb.id, userDb.name);
    // El 201 es cuando grabamos informacion y esta todo ok
    res
      .status(201)
      .json({ ok: true, uid: userDb.id, name: userDb.name, token: token });
  } catch (error) {
    console.log(error);
    // 500 error de servidor
    res
      .status(500)
      .json({ ok: false, msg: "Por favor hable con el administrador" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    // En caso no encuentre nada el findOne retorna null
    const user = await UserModel.findOne({ email: email });
    console.log("user", user);
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: `El usuario ${email} no se encuentra registrado`,
      });
    }

    // Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, user.password);
    // Si no es valido
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: `El password es incorrecto`,
      });
    }

    // Generamos nuestro JsonWebToken (JWT)
    const token = await generateJWT(user.id, user.name);

    res
      .status(200)
      .json({ ok: true, uid: user.id, name: user.name, token: token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Por favor hable con el administrador" });
  }
};

const validateToken = async (req: Request, res: Response) => {
  const { uid, name }: { uid: string; name: string } = req.body;

  // Generamos un nuevo token JsonWebToken (JWT)
  const token = await generateJWT(uid, name);
  res.json({ ok: true, token: token });
};

export { createUser, loginUser, validateToken };