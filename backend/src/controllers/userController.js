import user from "../service/user.js";
import e from "express";
import jwt from "jsonwebtoken";
import authConfig from "../config/jwt.js"
import bcrypt, { hash } from "bcrypt"

class UserController {

    async Login(data) {
        const { email, password } = data

        if (!email || !password) {
            throw new Error("Favor informar email e senha")
        }

        const LoginUser = await user.findOne(
            { where: { email } }
        )

        if (!LoginUser) {
            throw new Error("Email ou Senha inválidos");
        }

        const verify = await bcrypt.compare(password, user.password)

        if (verify) {
            return jwt.sign({
                id: LoginUser.id,
                role: LoginUser.role
            }, authConfig.jwt.secret, { expiresIn: authConfig.jwt.expiresIn })
        }

        throw new Error("Email ou senha inválidos")

    }


}