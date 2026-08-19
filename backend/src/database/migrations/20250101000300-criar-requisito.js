'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Requisito', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      texto: { type: Sequelize.TEXT, allowNull: false },
      tipo: { type: Sequelize.ENUM('RF', 'RNF', 'RN'), allowNull: false },
      criadoEm: { type: Sequelize.DATE, allowNull: false },
      atualizadoEm: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.addIndex('Requisito', ['tipo'], { name: 'indice_requisito_tipo' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Requisito');
  }
};
