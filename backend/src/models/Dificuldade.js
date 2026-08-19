const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Dificuldade extends Model {
    static associar({ Partida }) {
      Dificuldade.hasMany(Partida, { foreignKey: 'dificuldadeId', as: 'partidas' });
    }
  }

  Dificuldade.init(
    {
      nome: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
        validate: { notEmpty: true }
      },
      /** Tempo total da partida, em segundos. */
      tempo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 10 }
      },
      /** Pontos concedidos por resposta correta. */
      pontos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        validate: { min: 1 }
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'Dificuldade',
      tableName: 'Dificuldade',
      createdAt: 'criadoEm',
      updatedAt: 'atualizadoEm'
    }
  );

  return Dificuldade;
};
