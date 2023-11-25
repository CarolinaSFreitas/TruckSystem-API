import { sequelize } from "../database/conecta.js"
import { log } from "../models/Log.js";
import { Usuario } from "../models/Usuario.js"
import { Caminhao } from "../models/Caminhao.js"
import { Op, Sequelize } from 'sequelize';

//função de get - vai listar os vinhos no insomnia
export async function caminhaoIndex(req, res) {
    try {
        const caminhoes = await Caminhao.findAll({
            include: Usuario
        })
        res.status(200).json(caminhoes)
    } catch (error) {
        res.status(400).send(error)
    }
}

// função de create - vai criar um novo registro no insomnia
export async function caminhaoCreate(req, res) {
    const { modelo, marca, placa, chassi } = req.body

    if (!modelo || !marca || !placa || !chassi) {
        res.status(400).json("Erro... Informe modelo, marca, placa e chassi.")
        return
    }

    try {
        const caminhoes = await Caminhao.create({
            modelo, marca, placa, chassi
        })
        res.status(201).json(caminhoes)
    } catch (error) {
        res.status(400).send(error)
    }
}

//função de deletar registro no insomnia
export async function caminhaoDelete(req, res) {
    const { id } = req.params

    try {
        await Caminhao.destroy({
            where: { id }
        })

        await log.create({descricao: `Exclusão de Caminhão id: ${id}`, 
        complemento: `Usuário: ${req.usuario_logado_id} - ${red.usuario_logado_nome}`})
    
        res.status(200).json({ msg: "Ok! Removido com sucesso :)" })
    } catch (error) {
        res.status(400).send(error)
    }
}
