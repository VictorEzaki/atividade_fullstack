import { toDefaultValue } from "sequelize/lib/utils";
import { sequelize } from "../database/db.js";
import { DataTypes } from "sequelize";

const tema = sequelize.define('tema',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false
    },
    difficulty_level:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    active:{
        type:DataTypes.BOOLEAN,
        defaultValue: true
    }
})

export default tema;