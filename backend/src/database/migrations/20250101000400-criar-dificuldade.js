'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Dificuldade', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nome: { type: Sequelize.STRING(60), allowNull: false, unique: true },
      tempo: { type: Sequelize.INTEGER, allowNull: false },
      pontos: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 10 },
      ativo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      criadoEm: { type: Sequelize.DATE, allowNull: false },
      atualizadoEm: { type: Sequelize.DATE, allowNull: false }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Dificuldade');
  }
};
