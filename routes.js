import { Router } from "express"
import { caminhaoCreate, caminhaoIndex, caminhaoDelete } from "./controllers/caminhaoController.js"
import { usuarioIndex, usuarioCreate, usuarioTrocaSenha } from "./controllers/usuarioController.js"
import { loginUsuario } from "./controllers/loginController.js"
import { verificaLogin } from "./middlewares/verificaLogin.js"
import { enviaEmail } from "./controllers/emailController.js"

const router = Router()

// --------------------------------------------------------- ROTAS DE caminhoes
router.get("/caminhoes", caminhaoIndex) //rota pra listagem
      .post("/caminhao", caminhaoCreate) //rota pra criação de registro
      .delete("/caminhao/:id", verificaLogin, caminhaoDelete)

      
// --------------------------------------------------------- ROTAS DE USUARIOS
router.get("/usuarios", usuarioIndex) //rota pra listagem de usuarios
      .post("/usuario", usuarioCreate) //rota pra criação de registro
      .get("/usuario/solicitatroca", enviaEmail)           //faz a solicitação de mudança de senha
      .patch("/usuario/trocasenha/:hash", usuarioTrocaSenha)                   //realiza a troca de senha


// --------------------------------------------------------- ROTAS DE LOGIN
router.get("/login", loginUsuario) //rota pra login

export default router