import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();
import { Usuario } from "../models/Usuario.js";
import { log } from "../models/Log.js";

export async function loginUsuario(req, res) {
    const { email, senha } = req.body;
    const mensaErroPadrao = "Erro... Login ou Senha Inválidos";

    if (!email || !senha) {
        res.status(400).json({ erro: mensaErroPadrao });
        return;
    }

    try {
        let usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            res.status(400).json({ erro: mensaErroPadrao });
            return;
        }

        if (usuario.bloqueado) {
            res.status(400).json({ erro: "Usuário bloqueado devido a múltiplas tentativas inválidas de login." });
            return;
        }

        await log.create({
            descricao: `Tentativa de Login Inválida`,
            complemento: `Nome: ${usuario.nomeMotorista}, E-mail: ${email}`
        });

        if (!bcrypt.compareSync(senha, usuario.senha)) {

            usuario.tentativas_login = (usuario.tentativas_login || 0) + 1;

            
            if (usuario.tentativas_login >= 4) {

                usuario.bloqueado = true;
                res.status(400).json({ erro: "Usuário bloqueado devido a múltiplas tentativas inválidas de login. Recomendamos que você solicite o desbloqueio de conta e após isso troque sua senha como medida de segurança." });
                return;
            }

            await usuario.save();

            res.status(400).json({ erro: mensaErroPadrao });
            return;
        }

        usuario.tentativas_login = 0;
        usuario.ultimo_login = new Date();
        await usuario.save();

        const token = jwt.sign({
            usuario_logado_id: usuario.id,
            usuario_logado_nome: usuario.nomeMotorista
        }, process.env.JWT_KEY, { expiresIn: "1h" });

        await log.create({
            descricao: `Tentativa de Login Bem-sucedida`,
            complemento: `Nome: ${usuario.nomeMotorista}, E-mail: ${email}`
        });

        res.status(200).json({
            msg: `Bem-vindo(a) ${usuario.nomeMotorista}! Seu último acesso ao sistema foi em ${usuario.ultimo_login.toLocaleString()}.`,
            token
        });

    } catch (error) {
        res.status(400).json({ erro: 'Erro interno no servidor...' });
    }
}
