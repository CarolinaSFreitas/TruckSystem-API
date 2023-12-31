import express from 'express'
import { sequelize } from './database/conecta.js'
import { Caminhao } from './models/Caminhao.js'
import { Usuario } from './models/Usuario.js'
import routes from './routes.js'
import cors from 'cors'
import { log } from './models/Log.js'
import { Troca } from './models/Troca.js'
import { Viagem } from './models/Viagem.js'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
app.use(routes)
app.use(express.static('images'));


async function conecta_db() {
  try {
    await sequelize.authenticate();
    console.log('Conexão bem sucedida.');

    await Viagem.sync()
    console.log("Tabela de Viagens: Ok!")

    await Caminhao.sync()
    console.log("Tabela de Caminhões: Ok!")

    await Usuario.sync({ alter: true })
    console.log("Tabela de Usuários Motoristas: Ok!")

    await log.sync()
    console.log("Tabela de Logs: Ok")

    await Troca.sync()
    console.log("Tabela de Solicitações de Troca de Senhas: Ok")

    await sequelize.authenticate();
    console.log('Conexão bem sucedida.');
  } catch (error) {
    console.error('Impossível conectar ao banco de dados:', error);
  }
}
conecta_db()

app.listen(port, () => {
  console.log(`API TruckSystem ${port}`)
})

app.get('/', (req, res) => {
  res.send(`
    <html lang="pt-br">
      <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
      <title>API TruckSystem</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap');
          .welcome-text {
            font-family: 'Montserrat', sans-serif;
            font-size: 32px;
            color: #010103;
            margin-top: 20px;
            text-align: center;
            font-weight: bold;
          }
          .center-image {
            display: block; 
            margin: 0 auto; 
            margin-top: 20px;
            border-radius: 10px;
          }
          .button-container {
            text-align: center;
            margin-top: 20px; 
          }
          .button-container button {
            display: inline-block; 
            padding: 10px 10px; 
            background-color: #7B152C; 
            border: none;
            border-radius: 10px; 
            cursor: pointer; 
            margin: 10px; 
          }
          .button-container button a{
            color: #f1f1f1; 
            text-decoration: none; 
            font-family: 'Montserrat', sans-serif; 
            font-size: 18px; 
          }
          .button-container button:hover {
            background-color: #8B1531; 
        </style>
      </head>
      <body>
        <div class="welcome-text">Bem-vindo(a)! <br> API TruckSystem </div>
        <img src="/truck.jpg" class="center-image" width="650px">

      <div class="btn d-flex justify-content-center py-5">
       
        <div class="m-2">
          <a href="/viagens" target="_blank>
            <button type="button" class="btn btn-outline-dark">Viagens</button>
          </a>
        </div>

        <div class="m-2">
          <a href="/usuarios" target="_blank>
            <button type="button" class="btn btn-outline-dark">Motoristas</button>
          </a>
        </div>
        
        <div class="m-2">
          <a href="/caminhoes" target="_blank>
            <button type="button" class="btn btn-outline-dark">Caminhões</button>
          </a>
        </div>
      </div>
      </body>
    </html>
  `);
});

