import { sequelize } from "../database/conecta.js"
import { log } from "../models/Log.js";
import { Viagem } from "../models/Viagem.js";
import { Usuario } from "../models/Usuario.js";
import { Caminhao } from "../models/Caminhao.js";
import { Op, Sequelize } from 'sequelize';

//função de get - vai listar os vinhos no insomnia
export async function viagensIndex(req, res) {
    try {
        const viagens = await Viagem.findAll({
            include: 
            [
                {
                    model: Usuario,
                   
                    attributes: ['nomeMotorista', 'telefone', 'registroCNH'],
                },
                {
                    model: Caminhao, 
                    attributes: ['modelo', 'marca', 'placa'],
                },
            ],
        });
    
        res.status(200).json(viagens)
    } catch (error) {
        res.status(400).send(error)
    }
}

// função de create - vai criar um novo registro no insomnia
export async function viagemCreate(req, res) {
    const { descricao, tipoCarga, origem, destino, valorCarga, usuario_id, caminhao_id } = req.body

    if (!descricao || !tipoCarga || !origem || !destino || !valorCarga || !usuario_id || !caminhao_id) {
        res.status(400).json("Erro... Informe as informações da viagem.")
        return
    }

    try {
        const viagens = await Viagem.create({
            descricao, tipoCarga, origem, destino, valorCarga, usuario_id, caminhao_id
        })
        res.status(201).json(viagens)
    } catch (error) {
        res.status(400).send(error)
    }
}

//função de deletar registro no insomnia
export async function viagemDelete(req, res) {
    const { id } = req.params;

    try {
        await Viagem.destroy({
            where: { id }
        });

        await log.create({
            descricao: `Exclusão de Viagem id: ${id}`,
            complemento: `Usuário: ${req.usuario_logado_id} - ${req.usuario_logado_nome}`
        });

        res.status(200).json({ msg: "Ok! Removido com sucesso :)" });
    } catch (error) {
        console.error("Erro ao excluir a viagem:", error);
        res.status(500).json({ erro: "Erro interno do servidor ao excluir a viagem" });
    }
}

///função de alteração do registro no insomnia
export async function viagemUpdate(req, res) {
    const { id } = req.params

    const { descricao, tipoCarga, origem, destino, valorCarga, usuario_id, caminhao_id } = req.body

    if (!descricao || !tipoCarga || !origem || !destino || !valorCarga || !usuario_id || !caminhao_id) {
        res.status(400).json("Erro...")
        return
    }

    try {
        const viagem = await Viagem.update({
            descricao, tipoCarga, origem, destino, valorCarga, usuario_id, caminhao_id
        }, {
            where: { id }
        })

        await log.create({
            descricao: `Alteração de Viagem id: ${id}`,
            complemento: `Usuário: ${req.usuario_logado_id} - ${req.usuario_logado_nome}`
        });

        res.status(200).json(viagem)
    } catch (error) {
        res.status(400).send(error)
    }
}


///função de pesquisa na tabela viagem
// étodo de filtro que o tipo contenha a string passada como parametro 
export async function viagemPesquisa(req, res) {
    const { termo } = req.params;

    try {
        const viagens = await Viagem.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ['nomeMotorista', 'email', 'telefone', 'registroCNH'],
                },
                {
                    model: Caminhao,
                    attributes: [],
                },
            ],
            where: {
                [Op.or]: [
                    {
                        destino: {
                            [Op.like]: `%${termo}%`,
                        },
                    },
                    {
                        origem: {
                            [Op.like]: `%${termo}%`,
                        },
                    },
                    {
                        '$usuario.nomeMotorista$': {
                            [Op.like]: `%${termo}%`,
                        },
                    },
                ],
            },
        });

        res.status(200).json(viagens);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar as viagens." });
    }
}