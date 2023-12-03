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

    if (!nomeMotorista || !email || !senha || !telefone || !rgOuCpf || !registroCNH || !nascimento) {
        res.status(400).json("Erro... Informe nome, email e senha.")
        return
    }

    const mensagem = validaSenha(senha)
    if (mensagem.length > 0) {
        res.status(400).json({ erro: mensagem.join(', ') })
        return
    }

    try {
        //verifica se ja tem email cadastrado no sistema
        const usuarioExistente = await Usuario.findOne({ where: { email } });

        if (usuarioExistente) {
            res.status(400).json({ erro: "E-mail já está em uso. Escolha outro e-mail." });
            return;
        }
        const usuario = await Usuario.create({
            nomeMotorista, email, senha, telefone, rgOuCpf, registroCNH, nascimento
        })
        res.status(201).json(usuario)
    } catch (error) {
        res.status(400).send(error)
    }
}

//ROTA DE TROCA DE SENHA DO USUARIO!!!!
export async function usuarioTrocaSenha(req, res) {
    const { hash } = req.params;
    const { email, novasenha } = req.body;

    if (!email || !novasenha) {
        res.status(400).json("Erro... Informe email e a nova senha do usuário");
        return;
    }

    const troca = await Troca.findOne({ where: { email, hash } });

    if (troca == null) {
        res.status(400).json({ msg: "Erro... Verifique seu e-mail ou os dados enviados" });
        return;
    }

    const mensagem = validaSenha(novasenha);
    if (mensagem.length > 0) {
        res.status(400).json({ erro: mensagem.join(', ') });
        return;
    }

    try {
        await Usuario.update({
            senha: novasenha
        }, {
            where: { email },
            individualHooks: true
        });

        res.status(200).json({ msg: 'Ok! Senha alterada com sucesso! :)' });
    } catch (error) {
        res.status(400).send(error);
    }
}

//desbloquear usuário por ID (depois de ser bloqueado por logins inválidos 3x)
export async function usuarioDesblock(req, res) {
    const userId = req.params.id;

    try {
        const usuario = await Usuario.findByPk(userId);

        if (!usuario) {
            res.status(404).json({ erro: 'Usuário não encontrado' });
            return;
        }

        usuario.bloqueado = false;
        usuario.tentativas_login = 0; 
        await usuario.save();

        res.status(200).json({ msg: 'Usuário desbloqueado com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao desbloquear o usuário' });
    }
}

