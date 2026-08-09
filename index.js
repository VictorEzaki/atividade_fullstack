import { sequelize } from "./src/database/db.js"
import {associations} from './src/models/index.js'

associations()

async function main() {
    try {
        await sequelize.authenticate()
        await sequelize.sync({force:true})
    } catch (error) {
        console.error("Erro ao sincronizar com o banco:", error)
    }
}

main()