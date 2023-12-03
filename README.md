# API - TruckSystem - Trabalho #3

Trabalho #3 de Desenvolvimento de APIs - Entrega: 08/12/23

### Instalações e p/ rodar:

1. `` npm init -y `` 
2. ``npm i express sequelize mysql2 cors `` 
3. ``npm i bcrypt ``  
4. `` npm i jsonwebtoken `` 
5. `` npm i dotenv `` 
6. `` npm i nodemailer `` 
7. ``npm i md5 ``
8. `` npm i --save-dev nodemon ``
9.   ``npx nodemon app `` 

### Docs e links úteis:
- https://sequelize.org/docs/v6/core-concepts/paranoid/
- https://nodemailer.com/about/
- https://mailtrap.io/pt/

### Acesso Localhost: 
- ``http://localhost:3000/``

## Logs nas rotas que tem o middleware:

Na rota de deletar um caminhão registrado no sistema, ele verifica quem está fazendo (através do "Bearer TOKEN_JWT") e traz esse registro para a tabela "Logs" do banco de dados:

- A exclusão sendo feita com sucesso:
![image](https://github.com/CarolinaSFreitas/TruckSystem-API/assets/99994934/88268605-364c-48a6-8dec-aad628fc9920)

- O registro nos Logs:
![image](https://github.com/CarolinaSFreitas/TruckSystem-API/assets/99994934/679b4db3-e56b-4c8a-9f17-3d1ad2dd74b2)

# Recursos Escolhidos:
**4. Impedir o cadastro de 2 usuários com o mesmo e-mail. Exibir mensagem indicativa deste erro.**
   
````
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
````
Saída no Insomnia: 
![image](https://github.com/CarolinaSFreitas/TruckSystem-API/assets/99994934/95fb283a-81d1-4ebc-acdb-e649deaf0c76)

**5. Registrar data/hora do último login do usuário. Exibir essa data/hora no login (“Bem-vindo ... Seu último 
acesso ao sistema foi ...”)**

````

export async function loginUsuario(req, res) {
    const { email, senha } = req.body;
    const mensaErroPadrao = "Erro... Login ou Senha Inválidos";

    if (!email || !senha) {
        res.status(400).json({ erro: mensaErroPadrao });
        return;
    }

    try {
        const usuario = await Usuario.findOne({ where: { email } });

        await log.create({
            descricao: `Tentativa de Login Inválida`,
            complemento: `Nome: ${usuario ? usuario.nomeMotorista : 'Usuário Desconhecido'}, E-mail: ${email}`
        });

        if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
            res.status(400).json({ erro: mensaErroPadrao });
            return;
        }

        await Usuario.update({ ultimo_login: new Date() }, { where: { id: usuario.id } });

        const token = jwt.sign({
            usuario_logado_id: usuario.id,
            usuario_logado_nome: usuario.nomeMotorista
        }, process.env.JWT_KEY, { expiresIn: "1h" });

        await log.create({
            descricao: `Tentativa de Login Bem-sucedida`,
            complemento: `Nome: ${usuario.nomeMotorista}, E-mail: ${email}`
        });

        res.status(200).json({
            msg: `Bem-vindo ${usuario.nomeMotorista}! Seu último acesso ao sistema foi em ${new Date().toLocaleString()}.`,
            token
        });

    } catch (error) {
        res.status(400).json({ erro: 'Erro interno no servidor...' });
    }
}
````

![image](https://github.com/CarolinaSFreitas/TruckSystem-API/assets/99994934/f5199705-217f-4119-b00b-bc68a9dacb14)

**3. Implementar um controle de tentativas de acesso inválidas para o usuário. Desta forma, ao atingir, por 
exemplo, 3 tentativas inválidas bloqueia o usuário (não permite novos acessos até ser retirado o 
bloqueio).**

Nesse recurso, o usuário tem seus acessos bloqueados após 3 tentativas de login inválidas e isso é registrado no banco de dados:
![image](https://github.com/CarolinaSFreitas/TruckSystem-API/assets/99994934/33b74294-12c7-4106-a3f0-cae8512c08c7)

![image](https://github.com/CarolinaSFreitas/TruckSystem-API/assets/99994934/85930c09-964c-454c-bd37-0944afd44fc1)

Como sugerido na mensagem de erro, o usuário deve solicitar o desbloqueio de conta e após isso trocar a senha e, assim, executar o login novamente. Então:
- O desbloqueio de usuário é feito na rota `` http://localhost:3000/usuario/desbloquear/:id ``
  ![image](https://github.com/CarolinaSFreitas/TruckSystem-API/assets/99994934/5854fa5b-6757-4d6a-91ec-06a92f8f7294)
- Após isso ele deve trocar de senha e tentar logar novamente com a nova senha (além de que o valor de tentativas de login no banco é alterado para 0):
  ![image](https://github.com/CarolinaSFreitas/TruckSystem-API/assets/99994934/c18aff2d-661a-4226-a943-8e04c1231a7e)

  ![image](https://github.com/CarolinaSFreitas/TruckSystem-API/assets/99994934/23dbf324-64ab-49e3-ac99-7f0e1fbb6e8a)



