const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Tema extends Model {
    static associar({ Requisito, Partida, TemaRequisito }) {
      Tema.belongsToMany(Requisito, {
        through: TemaRequisito,
        foreignKey: 'temaId',
        otherKey: 'requisitoId',
        as: 'requisitos'
      });
      Tema.hasMany(Partida, { foreignKey: 'temaId', as: 'partidas' });
    }
  }

  Tema.init(
    {
      nome: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
        validate: { notEmpty: true }
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'Tema',
      tableName: 'Tema',
      createdAt: 'criadoEm',
      updatedAt: 'atualizadoEm'
    }
  );

  return Tema;
};
