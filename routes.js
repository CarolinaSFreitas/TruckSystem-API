import { Router } from "express"
import { caminhaoCreate, caminhaoIndex } from "./controllers/caminhaoController"
import { usuarioIndex, usuarioCreate, usuarioTrocaSenha } from "./controllers/usuarioController.js"
import { loginUsuario } from "./controllers/loginController.js"
import { verificaLogin } from "./middlewares/verificaLogin.js"
import { enviaEmail } from "./controllers/emailController.js"

const router = Router()

// --------------------------------------------------------- ROTAS DE caminhoes
router.get("/caminhoes", caminhaoIndex) //rota pra listagem
      .post("/caminhoes", caminhaoCreate) //rota pra criação de registro
      .delete("/caminhoes", verificaLogin, caminhaoDelete)

      
// --------------------------------------------------------- ROTAS DE USUARIOS
router.get("/usuarios", usuarioIndex) //rota pra listagem de usuarios
      .post("/usuarios", usuarioCreate) //rota pra criação de registro
      .get("/usuarios/solicitatroca", enviaEmail)           //faz a solicitação de mudança de senha
      .patch("/usuarios/trocasenha/:hash", usuarioTrocaSenha)                   //realiza a troca de senha


// --------------------------------------------------------- ROTAS DE LOGIN
router.get("/login", loginUsuario) //rota pra login

export default router