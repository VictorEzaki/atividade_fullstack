'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RespostaPartida', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      partidaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Partida', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      requisitoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Requisito', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      ordem: { type: Sequelize.INTEGER, allowNull: false },
      pertenceAoTema: { type: Sequelize.BOOLEAN, allowNull: false },
      respostaEscolhida: { type: Sequelize.ENUM('RF', 'RNF', 'RN', 'NAO_CONDIZ_COM_TEMA'), allowNull: true },
      respostaCorreta: { type: Sequelize.ENUM('RF', 'RNF', 'RN', 'NAO_CONDIZ_COM_TEMA'), allowNull: false },
      correta: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      tempoResposta: { type: Sequelize.INTEGER, allowNull: true },
      criadaEm: { type: Sequelize.DATE, allowNull: false },
      respondidaEm: { type: Sequelize.DATE, allowNull: true }
    });
    await queryInterface.addConstraint('RespostaPartida', {
      fields: ['partidaId', 'requisitoId'],
      type: 'unique',
      name: 'restricao_resposta_partida_requisito_unico'
    });
    await queryInterface.addIndex('RespostaPartida', ['requisitoId'], { name: 'indice_resposta_requisito' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('RespostaPartida');
  }
};
