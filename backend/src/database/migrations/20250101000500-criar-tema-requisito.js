'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TemaRequisito', {
      temaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'Tema', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      requisitoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'Requisito', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
    await queryInterface.addIndex('TemaRequisito', ['requisitoId'], { name: 'indice_tema_requisito_requisito' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('TemaRequisito');
  }
};
