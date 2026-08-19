/**
 * Dados utilizados pelos seeders e pelo ambiente de testes.
 * Cada tema precisa de requisitos suficientes para montar uma partida valida.
 */

const dificuldades = [
  { nome: 'Facil', tempo: 100, pontos: 10, ativo: true },
  { nome: 'Medio', tempo: 80, pontos: 15, ativo: true },
  { nome: 'Dificil', tempo: 60, pontos: 20, ativo: true },
  { nome: 'Hard', tempo: 40, pontos: 30, ativo: true }
];

const temas = [
  {
    nome: 'Sistema de Restaurante',
    descricao: 'Requisitos de um sistema de gestao de pedidos, cozinha e reservas para restaurantes.',
    requisitos: [
      { texto: 'O sistema deve permitir que o garcom registre pedidos por mesa.', tipo: 'RF' },
      { texto: 'O sistema deve permitir que o cliente faca reservas de mesa pelo aplicativo.', tipo: 'RF' },
      { texto: 'O sistema deve emitir a comanda para a cozinha assim que o pedido for confirmado.', tipo: 'RF' },
      {
        texto: 'O sistema deve permitir o fechamento da conta dividindo o valor entre os clientes da mesa.',
        tipo: 'RF'
      },
      { texto: 'O sistema deve permitir o cadastro do cardapio com fotos, preco e descricao dos pratos.', tipo: 'RF' },
      { texto: 'O tempo de resposta ao registrar um pedido nao deve ultrapassar 2 segundos.', tipo: 'RNF' },
      { texto: 'O sistema deve funcionar em tablets com conexao Wi-Fi instavel sem perder pedidos.', tipo: 'RNF' },
      { texto: 'Os dados de pagamento dos clientes devem trafegar criptografados por TLS.', tipo: 'RNF' },
      { texto: 'O sistema deve suportar 50 pedidos simultaneos nos horarios de pico.', tipo: 'RNF' },
      {
        texto: 'Reservas nao confirmadas em ate 15 minutos apos o horario marcado sao canceladas automaticamente.',
        tipo: 'RN'
      },
      { texto: 'Um pedido so pode ser enviado a cozinha apos a confirmacao da mesa pelo garcom.', tipo: 'RN' },
      { texto: 'Descontos em promocoes nao podem ser aplicados sobre bebidas alcoolicas.', tipo: 'RN' },
      { texto: 'A conta de uma mesa so pode ser fechada apos todos os pedidos serem entregues.', tipo: 'RN' }
    ]
  },
  {
    nome: 'Sistema de Escola',
    descricao: 'Requisitos de um sistema de gestao escolar com turmas, notas e comunicacao com responsaveis.',
    requisitos: [
      { texto: 'O sistema deve permitir o cadastro de alunos vinculados a uma turma.', tipo: 'RF' },
      { texto: 'O sistema deve permitir que o professor registre a frequencia diaria dos alunos.', tipo: 'RF' },
      { texto: 'O sistema deve permitir o lancamento de notas por bimestre.', tipo: 'RF' },
      { texto: 'O sistema deve enviar comunicados aos responsaveis pelo aplicativo.', tipo: 'RF' },
      { texto: 'O sistema deve emitir o boletim escolar em formato PDF.', tipo: 'RF' },
      { texto: 'O sistema deve estar disponivel durante o horario letivo com 99% de disponibilidade.', tipo: 'RNF' },
      { texto: 'A interface deve ser responsiva para uso em smartphones dos responsaveis.', tipo: 'RNF' },
      { texto: 'Os dados dos alunos devem ser armazenados conforme a LGPD.', tipo: 'RNF' },
      { texto: 'O sistema deve suportar o cadastro de 2.000 alunos sem perda de desempenho.', tipo: 'RNF' },
      { texto: 'O aluno com frequencia inferior a 75% no bimestre fica em recuperacao.', tipo: 'RN' },
      { texto: 'A media minima para aprovacao direta e 6,0.', tipo: 'RN' },
      { texto: 'Um responsavel so pode visualizar os dados dos alunos vinculados a ele.', tipo: 'RN' },
      {
        texto: 'O lancamento de notas so pode ser alterado pelo professor em ate 5 dias apos o fechamento do bimestre.',
        tipo: 'RN'
      }
    ]
  }
];

const usuarios = [
  {
    nome: 'Administrador do sistema',
    email: 'admin@jogorequisitos.com',
    senha: 'Admin@123',
    perfil: 'ADMINISTRADOR'
  },
  {
    nome: 'Jogador de exemplo',
    email: 'jogador@jogorequisitos.com',
    senha: 'Jogador@123',
    perfil: 'JOGADOR'
  }
];

module.exports = { dificuldades, temas, usuarios };
