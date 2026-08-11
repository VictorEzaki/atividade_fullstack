import { sequelize } from "./src/database/db.js"
import {associations} from './src/models/index.js'
import user from './src/service/user.js'

associations()

async function main() {
    try {
        await sequelize.authenticate()
        await sequelize.sync({})
    } catch (error) {
        console.error("Erro ao sincronizar com o banco:", error)
    }
}

main()

// const newUser = {
//     name:'nickolas',
//     email:'nickolas@gmail.com',
//     password:'sldfjaslf',
//     role:'admin'
// }

// user.Create(newUser)

// const test = await user.FindAll()
// console.log(test)

// const test2 = await user.FindById(1)
// console.log(test2)

// const AlterUser = {
//     id:'1',
//     name:'fogaça',
//     email:'Carlos@gmai.com',
//     password:'123',
//     role:'admin'
// }

// user.Update(AlterUser)

// const test3 = await user.Delete(1)
// console.log(test3)

