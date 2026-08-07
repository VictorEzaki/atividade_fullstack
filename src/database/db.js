import { Sequelize } from "sequelize";

const sequelize = new Sequelize('quiz_system','root','210400',{
    host:'localhost',
    dialect:'mysql'
})

export {sequelize}