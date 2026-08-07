import { sequelize } from "./src/database/db.js";

async function main() {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log("Deu pau na maquina só vai",sequelize)
    } catch (error) {
        console.error("Erro ao sincronizar com o banco:",error)
    }
}

main()