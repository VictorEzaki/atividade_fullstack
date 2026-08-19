const { Model, DataTypes } = require('sequelize');
const { RESPOSTAS_POSSIVEIS } = require('../utils/constantes');

module.exports = (sequelize) => {
  class RespostaPartida extends Model {
    static associar({ Partida, Requisito }) {
      RespostaPartida.belongsTo(Partida, { foreignKey: 'partidaId', as: 'partida' });
      RespostaPartida.belongsTo(Requisito, { foreignKey: 'requisitoId', as: 'requisito' });
    }
  }

  RespostaPartida.init(
    {
      partidaId: { type: DataTypes.INTEGER, allowNull: false },
      requisitoId: { type: DataTypes.INTEGER, allowNull: false },
      /** Ordem de apresentacao do requisito dentro da partida (1 a 10). */
      ordem: { type: DataTypes.INTEGER, allowNull: false },
      /** Indica se o requisito pertence ao tema escolhido na partida. */
      pertenceAoTema: { type: DataTypes.BOOLEAN, allowNull: false },
      respostaEscolhida: { type: DataTypes.ENUM(...RESPOSTAS_POSSIVEIS), allowNull: true },
      respostaCorreta: { type: DataTypes.ENUM(...RESPOSTAS_POSSIVEIS), allowNull: false },
      correta: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      /** Tempo gasto pelo jogador nesta questao, em segundos. */
      tempoResposta: { type: DataTypes.INTEGER, allowNull: true },
      criadaEm: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      respondidaEm: { type: DataTypes.DATE, allowNull: true }
    },
    {
      sequelize,
      modelName: 'RespostaPartida',
      tableName: 'RespostaPartida',
      timestamps: false
    }
  );

  return RespostaPartida;
};
