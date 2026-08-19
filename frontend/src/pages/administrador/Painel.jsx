import { useEffect, useState } from 'react';
import { painelService } from '../../services/painelService';
import Cartao from '../../components/Cartao';
import Carregamento from '../../components/Carregamento';
import MensagemErro from '../../components/MensagemErro';
import Tabela from '../../components/Tabela';

export default function Painel() {
  const [indicadores, definirIndicadores] = useState(null);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState('');

  useEffect(() => {
    painelService
      .buscarIndicadores()
      .then((dados) => definirIndicadores(dados.indicadores))
      .catch((falha) => definirErro(falha.message))
      .finally(() => definirCarregando(false));
  }, []);

  if (carregando) return <Carregamento mensagem="Carregando indicadores..." />;
  if (erro) return <MensagemErro mensagem={erro} />;
  if (!indicadores) return null;

  const { totais } = indicadores;

  const cartoesNumericos = [
    { rotulo: 'Jogadores', valor: totais.jogadores, icone: 'fa-solid fa-users' },
    { rotulo: 'Partidas concluídas', valor: totais.partidas, icone: 'fa-solid fa-gamepad' },
    { rotulo: 'Temas', valor: totais.temas, icone: 'fa-solid fa-layer-group' },
    { rotulo: 'Requisitos', valor: totais.requisitos, icone: 'fa-solid fa-list-check' },
    { rotulo: 'Aproveitamento geral', valor: `${indicadores.aproveitamentoGeral}%`, icone: 'fa-solid fa-bullseye' }
  ];

  return (
    <div className="pilha" style={{ gap: 'var(--espaco-6)' }}>
      <div>
        <span className="rotulo-secao">Visão geral</span>
        <h1>Painel</h1>
      </div>

      <div className="grade grade-3">
        {cartoesNumericos.map((cartao) => (
          <Cartao key={cartao.rotulo} className="indicador">
            <span className="indicador__rotulo">
              <i className={cartao.icone} aria-hidden="true" /> {cartao.rotulo}
            </span>
            <strong className="indicador__valor">{cartao.valor}</strong>
          </Cartao>
        ))}
      </div>

      <div className="grade grade-2">
        <Cartao titulo="Temas mais jogados">
          <Tabela
            chave={(item) => item.tema}
            mensagemVazia="Nenhuma partida registrada ainda."
            colunas={[
              { campo: 'tema', titulo: 'Tema' },
              { campo: 'totalPartidas', titulo: 'Partidas' }
            ]}
            dados={indicadores.temasMaisJogados}
          />
        </Cartao>

        <Cartao titulo="Usuários mais ativos">
          <Tabela
            chave={(item) => item.usuario}
            mensagemVazia="Nenhum jogador ativo ainda."
            colunas={[
              { campo: 'usuario', titulo: 'Jogador' },
              { campo: 'totalPartidas', titulo: 'Partidas' },
              { campo: 'pontuacaoTotal', titulo: 'Pontos' }
            ]}
            dados={indicadores.usuariosMaisAtivos}
          />
        </Cartao>
      </div>

      <Cartao titulo="Requisitos com maior taxa de erro" descricao="Bons candidatos a revisão de texto ou classificação.">
        <Tabela
          chave={(item) => item.requisito}
          mensagemVazia="Ainda não há respostas suficientes."
          colunas={[
            { campo: 'requisito', titulo: 'Requisito' },
            { campo: 'tipo', titulo: 'Tipo', largura: '90px' },
            { campo: 'totalRespostas', titulo: 'Respostas', largura: '110px' },
            { campo: 'taxaErro', titulo: 'Erro', largura: '90px', conteudo: (item) => `${item.taxaErro}%` }
          ]}
          dados={indicadores.requisitosComMaiorErro}
        />
      </Cartao>
    </div>
  );
}
