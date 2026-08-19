'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Partida', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuario', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      temaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Tema', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      dificuldadeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Dificuldade', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      pontuacao: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      tempoTotal: { type: Sequelize.INTEGER, allowNull: true },
      iniciadaEm: { type: Sequelize.DATE, allowNull: false },
      finalizadaEm: { type: Sequelize.DATE, allowNull: true }
    });
    await queryInterface.addIndex('Partida', ['usuarioId'], { name: 'indice_partida_usuario' });
    await queryInterface.addIndex('Partida', ['temaId', 'dificuldadeId'], { name: 'indice_partida_tema_dificuldade' });
    await queryInterface.addIndex('Partida', ['pontuacao'], { name: 'indice_partida_pontuacao' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Partida');
  }
};
