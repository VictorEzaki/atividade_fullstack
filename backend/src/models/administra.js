import { sequelize } from "../database/db.js";
import { DataTypes } from "sequelize";
import user from "./user.js";
import tema from "./tema.js";

const administra = sequelize.define('administra',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    data_atribuicao:{
        type:DataTypes.DATE,
        allowNull:true
    }
    ,
    fkTemaIdAdministra:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:tema,
            key:'id'
        }
    },
    fkUserIdAdministra:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:user,
            key:'id'
        }
    }
})

export default administra