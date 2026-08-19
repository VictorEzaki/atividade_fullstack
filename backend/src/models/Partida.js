const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Partida extends Model {
    static associar({ Usuario, Tema, Dificuldade, RespostaPartida }) {
      Partida.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
      Partida.belongsTo(Tema, { foreignKey: 'temaId', as: 'tema' });
      Partida.belongsTo(Dificuldade, { foreignKey: 'dificuldadeId', as: 'dificuldade' });
      Partida.hasMany(RespostaPartida, { foreignKey: 'partidaId', as: 'respostas' });
    }
  }

  Partida.init(
    {
      usuarioId: { type: DataTypes.INTEGER, allowNull: false },
      temaId: { type: DataTypes.INTEGER, allowNull: false },
      dificuldadeId: { type: DataTypes.INTEGER, allowNull: false },
      pontuacao: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      /** Tempo total utilizado na partida, em segundos. */
      tempoTotal: { type: DataTypes.INTEGER, allowNull: true },
      iniciadaEm: { type: DataTypes.DATE, allowNull: false },
      finalizadaEm: { type: DataTypes.DATE, allowNull: true }
    },
    {
      sequelize,
      modelName: 'Partida',
      tableName: 'Partida',
      timestamps: false
    }
  );

  return Partida;
};
