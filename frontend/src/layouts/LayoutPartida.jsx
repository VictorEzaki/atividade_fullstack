import { Outlet } from 'react-router-dom';

/**
 * Layout exclusivo da partida em andamento: sem navegacao lateral e sem
 * cabecalho do hub, para que o jogador fique imerso na rodada. A saida
 * antecipada acontece pelo cronometro/servidor, nao por navegacao livre.
 */
export default function LayoutPartida() {
  return (
    <div className="area-partida">
      <Outlet />
    </div>
  );
}
