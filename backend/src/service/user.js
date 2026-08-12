import dotenv from "dotenv"
import user from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { where } from "sequelize";
import authConfig from "../config/jwt.js"

dotenv.config()

const roles = ['admin', 'user']
const salt = 12

class userService {
    async FindAll() {
        return await user.findAll()
    }

    async FindById(id) {
        return await user.findByPk(id)
    }

    async Create(data) {

        const { name, email, password, role } = data

        if (!name) {
            throw new Error("Favor informar o nome")
        } else if (!email) {
            throw new Error("Favor informar o email")
        } else if (!password) {
            throw new Error("Favor informar senha")
            // se Não for uma role ou se não estiver dentro das roles
        } else if (!role || !roles.includes(role)) {
            throw new Error("Favor informe a permissão corretamente")
        }

        const hashPass = await bcrypt.hash(password, salt)

        return await user.create({ name, email, password: hashPass, role })
    }

    async Update(data) {

        const { id, name, email, password, role } = data

        const oldUser = await this.FindById(id)

        if (!oldUser) {
            throw new Error("Usuário não encontrado")
        };

        if (role && !roles.includes(role)) {
            throw new Error("Favor informar a permissão corretamente")
        }
        // A role só sera alterado se o usuario quiser
        if (role) {
            oldUser.role = role
        }

        oldUser.name = name || oldUser.name
        oldUser.email = email || oldUser.email
        oldUser.password = password ? await bcrypt.hash(password, salt) : oldUser.password

        await oldUser.save()

        return oldUser

    }

    async Delete(id) {
        const oldUser = await this.FindById(id)

        if (!oldUser) {
            throw new Error("Usuário não encontrado")
        }

        await oldUser.destroy()

    }
}

export default new userService()