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

