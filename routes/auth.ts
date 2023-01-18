/*
  Rutas de Usuarios / Auth
  host + api/auth
*/
import { Router } from "express";
import { check } from "express-validator";
import { createUser, loginUser, validateToken } from "../controllers";

import { fieldsValidate, jwtValidate } from "../middlewares";

const router: Router = Router();

// Si queremos agregar un middleware , tendrian que ir como segundo parametro
// Tambien podemos tener un array de middlewares
// Evaluamos que el name no venga vacio
router.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe tener almenos 6 caracteres").isLength({
      min: 6,
    }),
    fieldsValidate,
  ],
  createUser
);
router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe tener almenos 6 caracteres").isLength({
      min: 6,
    }),
    fieldsValidate,
  ],
  loginUser
);

// En todas las rutas en que necesite saber si estoy autenticado necesitare en JWT
//
router.get("/renew", jwtValidate, validateToken);

export default router;