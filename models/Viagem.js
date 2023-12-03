import { DataTypes } from "sequelize";
import { sequelize } from '../database/conecta.js'
import { Usuario } from "./Usuario.js";
import { Caminhao } from "./Caminhao.js";

export const Viagem = sequelize.define('viagem', { // nome da tabela
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    descricao: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    tipoCarga: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    origem: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    destino: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    valorCarga: {
        type: DataTypes.DECIMAL(9, 2),
        allowNull: false
    },
}, {
    tableName: 'viagem',
    timestamps: false,
    paranoid: true
});


Viagem.belongsTo(Usuario, {
    foreignKey: {
        name: 'usuario_id', 
        allowNull: false,    
        unique: false,      
    },
    onDelete: 'RESTRICT',   
    onUpdate: 'CASCADE'      
});
Usuario.hasMany(Viagem, {
    foreignKey: "usuario_id"
})

Viagem.belongsTo(Caminhao, {
    foreignKey: {
        name: 'caminhao_id', 
        allowNull: false,    
        unique: false,       
    },
    onDelete: 'CASCADE',   
});
