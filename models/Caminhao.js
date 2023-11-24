import { DataTypes } from "sequelize";
import { sequelize } from '../database/conecta.js'
import { Motorista } from "./Usuario.js";

export const Caminhao = sequelize.define('caminhao', { // nome da tabela
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    modelo: {
        type: DataTypes.STRING(16),
        allowNull: false
    },
    placa: {
        type: DataTypes.STRING(7),
        allowNull: false
    },
    chassi: {
        type: DataTypes.STRING(18),
        allowNull: false
    },
}, {
    timestamps: false
});

// relacionamento:
Caminhao.belongsTo(Motorista); // Um caminhão pertence a um motorista
