import { DataTypes } from "sequelize";
import { sequelize } from '../database/conecta.js'
import { Caminhao } from "./Caminhao.js";

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
    // timestamps: false
    paranoid: true
});

// após construir a tabela do model, os relacionamentos são feitos fora:
Motorista.hasOne(Caminhao); // Um motorista possui um caminhão

