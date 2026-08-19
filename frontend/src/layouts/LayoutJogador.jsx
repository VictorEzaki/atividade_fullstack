import { Outlet } from 'react-router-dom';
import Cabecalho from '../components/Cabecalho';

export default function LayoutJogador() {
  return (
    <div className="area-jogador">
      <Cabecalho />
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  );
}
