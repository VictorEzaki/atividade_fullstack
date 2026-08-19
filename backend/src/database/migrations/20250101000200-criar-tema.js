'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tema', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nome: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      descricao: { type: Sequelize.TEXT, allowNull: true },
      ativo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      criadoEm: { type: Sequelize.DATE, allowNull: false },
      atualizadoEm: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.addIndex('Tema', ['ativo'], { name: 'indice_tema_ativo' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Tema');
  }
};
