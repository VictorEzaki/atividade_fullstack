'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usuario', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nome: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(160), allowNull: false, unique: true },
      senha: { type: Sequelize.STRING(255), allowNull: false },
      perfil: { type: Sequelize.ENUM('JOGADOR', 'ADMINISTRADOR'), allowNull: false, defaultValue: 'JOGADOR' },
      criadoEm: { type: Sequelize.DATE, allowNull: false },
      atualizadoEm: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.addIndex('Usuario', ['email'], { unique: true, name: 'indice_usuario_email' });
    await queryInterface.addIndex('Usuario', ['perfil'], { name: 'indice_usuario_perfil' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Usuario');
  }
};
