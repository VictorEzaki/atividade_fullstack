const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TemaRequisito extends Model {}

  TemaRequisito.init(
    {
      temaId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
      requisitoId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true }
    },
    {
      sequelize,
      modelName: 'TemaRequisito',
      tableName: 'TemaRequisito',
      timestamps: false
    }
  );

  return TemaRequisito;
};
