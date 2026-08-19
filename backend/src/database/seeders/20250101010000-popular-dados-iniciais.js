'use strict';

const bcrypt = require('bcrypt');
const { dificuldades, temas, usuarios } = require('../dadosIniciais');

const agora = () => new Date();

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Dificuldade',
      dificuldades.map((dificuldade) => ({ ...dificuldade, criadoEm: agora(), atualizadoEm: agora() }))
    );

    const usuariosComSenhaCriptografada = await Promise.all(
      usuarios.map(async (usuario) => ({
        ...usuario,
        senha: await bcrypt.hash(usuario.senha, 10),
        criadoEm: agora(),
        atualizadoEm: agora()
      }))
    );
    await queryInterface.bulkInsert('Usuario', usuariosComSenhaCriptografada);

    await queryInterface.bulkInsert(
      'Tema',
      temas.map(({ nome, descricao }) => ({ nome, descricao, ativo: true, criadoEm: agora(), atualizadoEm: agora() }))
    );

    const temasPersistidos = await queryInterface.sequelize.query(
      'SELECT id, nome FROM Tema',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (const tema of temas) {
      const temaPersistido = temasPersistidos.find((registro) => registro.nome === tema.nome);

      await queryInterface.bulkInsert(
        'Requisito',
        tema.requisitos.map(({ texto, tipo }) => ({ texto, tipo, criadoEm: agora(), atualizadoEm: agora() }))
      );

      const textos = tema.requisitos.map((requisito) => requisito.texto);
      const requisitosPersistidos = await queryInterface.sequelize.query(
        'SELECT id, texto FROM Requisito',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      const associacoes = requisitosPersistidos
        .filter((registro) => textos.includes(registro.texto))
        .map((registro) => ({ temaId: temaPersistido.id, requisitoId: registro.id }));

      await queryInterface.bulkInsert('TemaRequisito', associacoes);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('TemaRequisito', null, {});
    await queryInterface.bulkDelete('RespostaPartida', null, {});
    await queryInterface.bulkDelete('Partida', null, {});
    await queryInterface.bulkDelete('Requisito', null, {});
    await queryInterface.bulkDelete('Tema', null, {});
    await queryInterface.bulkDelete('Dificuldade', null, {});
    await queryInterface.bulkDelete('Usuario', null, {});
  }
};
