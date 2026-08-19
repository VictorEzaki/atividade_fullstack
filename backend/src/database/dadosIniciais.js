/**
 * Dados utilizados pelos seeders e pelo ambiente de testes.
 * Cada tema precisa de requisitos suficientes para montar uma partida válida.
 */

const dificuldades = [
  { nome: 'Fácil', tempo: 100, pontos: 10, ativo: true },
  { nome: 'Médio', tempo: 80, pontos: 15, ativo: true },
  { nome: 'Difícil', tempo: 60, pontos: 20, ativo: true },
  { nome: 'Hard', tempo: 40, pontos: 30, ativo: true }
];

const temas = [
  {
    nome: 'Sistema de Restaurante',
    descricao: 'Requisitos de um sistema de gestão de pedidos, cozinha e reservas para restaurantes.',
    requisitos: [
      { texto: 'O sistema deve permitir que o garçom registre pedidos por mesa.', tipo: 'RF' },
      { texto: 'O sistema deve permitir que o cliente faça reservas de mesa pelo aplicativo.', tipo: 'RF' },
      { texto: 'O sistema deve emitir a comanda para a cozinha assim que o pedido for confirmado.', tipo: 'RF' },
      {
        texto: 'O sistema deve permitir o fechamento da conta dividindo o valor entre os clientes da mesa.',
        tipo: 'RF'
      },
      { texto: 'O sistema deve permitir o cadastro do cardápio com fotos, preço e descrição dos pratos.', tipo: 'RF' },
      { texto: 'O tempo de resposta ao registrar um pedido não deve ultrapassar 2 segundos.', tipo: 'RNF' },
      { texto: 'O sistema deve funcionar em tablets com conexão Wi-Fi instável sem perder pedidos.', tipo: 'RNF' },
      { texto: 'Os dados de pagamento dos clientes devem trafegar criptografados por TLS.', tipo: 'RNF' },
      { texto: 'O sistema deve suportar 50 pedidos simultâneos nos horários de pico.', tipo: 'RNF' },
      {
        texto: 'Reservas não confirmadas em até 15 minutos após o horário marcado são canceladas automaticamente.',
        tipo: 'RN'
      },
      { texto: 'Um pedido só pode ser enviado à cozinha após a confirmação da mesa pelo garçom.', tipo: 'RN' },
      { texto: 'Descontos em promoções não podem ser aplicados sobre bebidas alcoólicas.', tipo: 'RN' },
      { texto: 'A conta de uma mesa só pode ser fechada após todos os pedidos serem entregues.', tipo: 'RN' }
    ]
  },
  {
    nome: 'Sistema de Escola',
    descricao: 'Requisitos de um sistema de gestão escolar com turmas, notas e comunicação com responsáveis.',
    requisitos: [
      { texto: 'O sistema deve permitir o cadastro de alunos vinculados a uma turma.', tipo: 'RF' },
      { texto: 'O sistema deve permitir que o professor registre a frequência diária dos alunos.', tipo: 'RF' },
      { texto: 'O sistema deve permitir o lançamento de notas por bimestre.', tipo: 'RF' },
      { texto: 'O sistema deve enviar comunicados aos responsáveis pelo aplicativo.', tipo: 'RF' },
      { texto: 'O sistema deve emitir o boletim escolar em formato PDF.', tipo: 'RF' },
      { texto: 'O sistema deve estar disponível durante o horário letivo com 99% de disponibilidade.', tipo: 'RNF' },
      { texto: 'A interface deve ser responsiva para uso em smartphones dos responsáveis.', tipo: 'RNF' },
      { texto: 'Os dados dos alunos devem ser armazenados conforme a LGPD.', tipo: 'RNF' },
      { texto: 'O sistema deve suportar o cadastro de 2.000 alunos sem perda de desempenho.', tipo: 'RNF' },
      { texto: 'O aluno com frequência inferior a 75% no bimestre fica em recuperação.', tipo: 'RN' },
      { texto: 'A média mínima para aprovação direta é 6,0.', tipo: 'RN' },
      { texto: 'Um responsável só pode visualizar os dados dos alunos vinculados a ele.', tipo: 'RN' },
      {
        texto: 'O lançamento de notas só pode ser alterado pelo professor em até 5 dias após o fechamento do bimestre.',
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