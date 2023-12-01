import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

import * as dotenv from 'dotenv'
dotenv.config()

import { Usuario } from "../models/Usuario.js"
import { log } from "../models/Log.js"

export async function loginUsuario(req, res) {
    const { email, senha } = req.body

    const mensaErroPadrao = "Erro... Login ou Senha Inválidos"

    if (!email || !senha) {
        res.status(400).json({ erro: mensaErroPadrao })
        return
    }

    //verifica se o e-mail está cadastrado 
    try {
        const usuario = await Usuario.findOne({ where: { email } })

        await log.create({
            descricao: `Tentativa de Login Inválida`,
            complemento: `Nome: ${usuario.nomeMotorista}, E-mail: ${email}`
        })
        if (usuario == null) {
            res.status(400).json({ erro: mensaErroPadrao })
            return
        }

        if (bcrypt.compareSync(senha, usuario.senha)) {
            const token = jwt.sign({
                usuario_logado_id: usuario.id,
                usuario_logado_nome: usuario.nomeMotorista
            },
                process.env.JWT_KEY,
                { expiresIn: "1h" })


            await log.create({
                descricao: `Tentativa de Login Bem-sucedida`,
                complemento: `Nome: ${usuario.nomeMotorista}, E-mail: ${email}`
            })


            res.status(200).json({ msg: "Logado", token })


        }
        else {
            res.status(400).json({ erro: mensaErroPadrao })
            return
        }
    } catch (error) {
        res.status(400).json(error)
    }
}
