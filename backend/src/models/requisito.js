const { Model, DataTypes } = require('sequelize');
const { TIPOS_REQUISITO } = require('../utils/constantes');

module.exports = (sequelize) => {
  class Requisito extends Model {
    static associar({ Tema, RespostaPartida, TemaRequisito }) {
      Requisito.belongsToMany(Tema, {
        through: TemaRequisito,
        foreignKey: 'requisitoId',
        otherKey: 'temaId',
        as: 'temas'
      });
      Requisito.hasMany(RespostaPartida, { foreignKey: 'requisitoId', as: 'respostas' });
    }
  }

  Requisito.init(
    {
      texto: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true }
      },
      tipo: {
        type: DataTypes.ENUM(TIPOS_REQUISITO.RF, TIPOS_REQUISITO.RNF, TIPOS_REQUISITO.RN),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Requisito',
      tableName: 'Requisito',
      createdAt: 'criadoEm',
      updatedAt: 'atualizadoEm'
    }
  );

  return Requisito;
};
