
import { sequelize } from "../database/db.js";
import requisito from "./requisito.js";
import tema from "./tema.js";
import user from "./user.js";
import joga from "./joga.js";
import administra from "./administra.js";

const associations = () =>{

// Cria a tabela assoativa tema_requisito
requisito.belongsToMany(tema,{
    through:'tema_requisito'
})

tema.belongsToMany(requisito,{
    through:'tema_requisito'
})

// Faz a associação um para muitos com user é jogo e tema é jogo
user.hasMany(joga
    ,{
    foreignKey:'fkUserIdJoga',
    as:'jogadas'
}
)

joga.belongsTo(user,{
    foreignKey:'fkUserIdJoga'
})

tema.hasMany(joga
    ,{
    foreignKey:'fkTemaIdJoga',
    as:'jogadasDoTema'
}
)

joga.belongsTo(tema,{
    foreignKey:'fkTemaIdJoga'
})

// Faz a associação um para muitos com user é administra e tema é administra
user.hasMany(administra,{
    foreignKey:'fkUserIdAdministra',
    as:'administra'
})

administra.belongsTo(user,{
    foreignKey:'fkUserIdAdministra'
})

tema.hasMany(administra,{
    foreignKey:'fkTemaIdAdministra',
    as:'administrados'
})

administra.belongsTo(tema,{
    foreignKey:'fkUserIdAdministra'
})

}


export {associations,user,tema,requisito,joga,administra}