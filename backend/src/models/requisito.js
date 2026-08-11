import { sequelize } from "../database/db.js";
import { DataTypes } from "sequelize";

const requisito = sequelize.define('requisito',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    type:{
        type:DataTypes.STRING,
        allowNull:true
    },
    weight:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
})

export default requisito