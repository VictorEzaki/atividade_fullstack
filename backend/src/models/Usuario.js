const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { PERFIS } = require('../utils/constantes');

const RODADAS_BCRYPT = 10;

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associar({ Partida }) {
      Usuario.hasMany(Partida, { foreignKey: 'usuarioId', as: 'partidas' });
    }

    async verificarSenha(senhaInformada) {
      return bcrypt.compare(senhaInformada, this.senha);
    }

    /** Remove a senha antes de qualquer serializacao para a API. */
    toJSON() {
      const valores = { ...this.get() };
      delete valores.senha;
      return valores;
    }
  }

  Usuario.init(
    {
      nome: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: { notEmpty: true, len: [3, 120] }
      },
      email: {
        type: DataTypes.STRING(160),
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      senha: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      perfil: {
        type: DataTypes.ENUM(PERFIS.JOGADOR, PERFIS.ADMINISTRADOR),
        allowNull: false,
        defaultValue: PERFIS.JOGADOR
      }
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'Usuario',
      createdAt: 'criadoEm',
      updatedAt: 'atualizadoEm',
      hooks: {
        beforeSave: async (usuario) => {
          if (usuario.changed('senha')) {
            usuario.senha = await bcrypt.hash(usuario.senha, RODADAS_BCRYPT);
          }
        }
      }
    }
  );

  return Usuario;
};
