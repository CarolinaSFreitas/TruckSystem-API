import bcrypt from 'bcrypt'

import { DataTypes } from "sequelize";
import { sequelize } from '../database/conecta.js'

export const Usuario = sequelize.define('usuario', { // nome da tabela
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nomeMotorista: {
        type: DataTypes.STRING(42),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(24),
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    telefone: {
        type: DataTypes.INTEGER(18),
        allowNull: false
    },
    rgOuCpf: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    registroCNH: {
        type: DataTypes.INTEGER(18),
        allowNull: false
    },
    nascimento: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    tableName: 'usuario',
    // timestamps: false
    paranoid: true
});

// hook (gancho) do Sequelize que é executado antes da inserção
// de um registro. Faz a criptografia da senha
// e atribui o hash ao campo senha
Usuario.beforeCreate(usuario => {
    const salt = bcrypt.genSaltSync(12)
    const hash = bcrypt.hashSync(usuario.senha, salt)
    usuario.senha = hash
})

Usuario.beforeUpdate(usuario => {
    const salt = bcrypt.genSaltSync(12)
    const hash = bcrypt.hashSync(usuario.senha, salt)
    usuario.senha = hash
})