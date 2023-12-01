import { DataTypes } from "sequelize";
import { sequelize } from '../database/conecta.js'

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
    marca: {
        type: DataTypes.STRING(12),
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
    tableName: 'caminhao',
    timestamps: false,
    paranoid: true
});

