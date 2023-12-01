import { Troca } from "../models/Troca.js"
import { Usuario } from "../models/Usuario.js"

//função de get - vai listar no insomnia
export async function usuarioIndex(req, res) {
    try {
        const usuario = await Usuario.findAll()
        res.status(200).json(usuario)
    } catch (error) {
        res.status(400).send(error)
    }
}

function validaSenha(senha) {

    const mensa = []
    // .length: retorna o tamanho da string (da senha)

    if (senha.length < 8) {
        mensa.push("Erro... senha deve possuir, no mínimo, 8 caracteres")
    }

    // contadores
    let pequenas = 0
    let grandes = 0
    let numeros = 0
    let simbolos = 0


    for (const letra of senha) {

        // expressão regular
        if ((/[a-z]/).test(letra)) {
            pequenas++
        }
        else if ((/[A-Z]/).test(letra)) {
            grandes++
        }
        else if ((/[0-9]/).test(letra)) {
            numeros++
        } else {
            simbolos++
        }
    }
    if (pequenas == 0 || grandes == 0 || numeros == 0 || simbolos == 0) {
        mensa.push("Erro... senha deve possuir letras minúsculas, maiúsculas, números e símbolos")
    }
    return mensa
}

// função de create - vai criar um novo registro no insomnia
export async function usuarioCreate(req, res) {
    const { nomeMotorista, email, senha, telefone, rgOuCpf, registroCNH, nascimento } = req.body

    if (!nomeMotorista || !email || !senha|| !telefone || !rgOuCpf || !registroCNH || !nascimento) {
        res.status(400).json("Erro... Informe nome, email e senha.")
        return
    }

    const mensagem = validaSenha(senha)
    if (mensagem.length > 0) {
        res.status(400).json({ erro: mensagem.join(', ') })
        return
    }

    try {
        const usuario = await Usuario.create({
            nomeMotorista, email, senha, telefone, rgOuCpf, registroCNH, nascimento
        })
        res.status(201).json(usuario)
    } catch (error) {
        res.status(400).send(error)
    }
}

//TESTAR A ROTA DE TROCA DE SENHA DO USUARIO!!!!
export async function usuarioTrocaSenha(req, res) {
    const { hash } = req.params
    const { email, novasenha } = req.body

    if (!email || !novasenha) {
        res.status(400).json("Erro... Informe nome, email e senha.")
        return
    }

    const mensagem = validaSenha(novasenha)
    if (mensagem.length > 0) {
        res.status(400).json({ erro: mensagem.join(', ') })
        return
    }

    try {

        const solicitacao = await Troca.findOne({ where: { hash, email } })

        if (solicitacao == null) {
            res.status(400).json({ erro: "Não foi possível trocar a senha." })
            return
        }

        Usuario.update({
            senha: novasenha
        }, { 
           where: { email },
           individualHooks: true
        })
        res.status(200).json({ msg: "OK! Troca de senha realizada com sucesso :)" })
    } catch (error) {
        res.status(400).send(error)
    }
}