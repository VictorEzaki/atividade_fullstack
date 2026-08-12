import dotenv from "dotenv"
import joga from "../models/joga.js"
import {where} from "sequelize"

class JogaService{

    async FindAll() {
        return await joga.findAll()
    }

    async FindById(id){
        return await joga.findByPk(id)
    }

    
    async Create(data){

        const {score,tentativas,JogadorId,TemaId} = data

        if(!score){
            throw new Error("Favor informar o Score")
        }else if(!tentativas){
            throw new Error("Favor informar Tentativas")
        }// Criar uma regra de negocio para não criar jogos sem um jogador existente no banco
        else if(!JogadorId){
            throw new Error ("Favor informa Id do jogador")
        }// Criar uma regra de negocioa para não criar jogos sem um tema existente no banco
        else if (!TemaId){
            throw new Error ("Favor informar o Id do tema")
        }

        return await joga.create({score,tentativas,JogadorId,TemaId})

    }

    async Update(data){
        const {id,score,tentativas,JogadorId,TemaId} = data

        if(!id){
            throw new Error("Favor informar o id do Jogo")
        }

        const oldJogada = await this.FindById(id)

        if(!score){
            throw new Error("Favor informar o Score")
        }else if(!tentativas){
            throw new Error("Favor informar Tentativas")
        }else if(!JogadorId){
            throw new Error ("Favor informa Id do jogador")
        }else if (!TemaId){
            throw new Error ("Favor informar o Id do tema")
        }

        oldJogada.score = score 
        oldJogada.tentativas = tentativas 
        oldJogada.JogadorId = JogadorId 
        oldJogada.TemaId = TemaId 

        await oldJogada.save()

        return oldJogada
    }

    async Delete(id){
        const oldJogada = await this.FindById(id)

        if(!oldJogada){
            throw new Error("Jogada não encontrada")
        }

        await oldJogada.destroy()

    }

}

export default new JogaService()