import { sequelize } from "../database/db.js";
import { DataTypes } from "sequelize";

const joga = sequelize.define('joga',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    score:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    tentativas:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
    ,
    fkUserIdJoga:{
        type:DataTypes.INTEGER,
        allowNull:true,
        references:{
            model:'users',
            key:'id'
        }
    },
    fkTemaIdJoga:{
        type:DataTypes.INTEGER,
        allowNull:true,
        references:{
            model:'temas',
            key:'id'
        }
    }
})

export default joga;


