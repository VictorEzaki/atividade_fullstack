import { Outlet } from 'react-router-dom';
import Cabecalho from '../components/Cabecalho';
import Menu from '../components/Menu';

const ITENS_MENU = [
  { caminho: '/administracao', rotulo: 'Painel', icone: 'fa-solid fa-chart-simple', exato: true },
  { caminho: '/administracao/usuarios', rotulo: 'Usuarios', icone: 'fa-solid fa-users' },
  { caminho: '/administracao/temas', rotulo: 'Temas', icone: 'fa-solid fa-layer-group' },
  { caminho: '/administracao/requisitos', rotulo: 'Requisitos', icone: 'fa-solid fa-list-check' },
  { caminho: '/administracao/dificuldades', rotulo: 'Dificuldades', icone: 'fa-solid fa-gauge-high' }
];

export default function LayoutAdministrador() {
  return (
    <div className="area-administrativa">
      <Cabecalho compacto />
      <div className="area-administrativa__corpo">
        <aside className="area-administrativa__lateral">
          <span className="rotulo-secao">Administracao</span>
          <Menu itens={ITENS_MENU} orientacao="vertical" />
        </aside>
        <main className="area-administrativa__conteudo">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
