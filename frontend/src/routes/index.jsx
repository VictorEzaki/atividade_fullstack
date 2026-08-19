import { Navigate, Route, Routes } from 'react-router-dom';

import RotaPublica from './RotaPublica';
import RotaPrivada from './RotaPrivada';
import RotaAdministrador from './RotaAdministrador';

import LayoutAutenticacao from '../layouts/LayoutAutenticacao';
import LayoutJogador from '../layouts/LayoutJogador';
import LayoutPartida from '../layouts/LayoutPartida';
import LayoutAdministrador from '../layouts/LayoutAdministrador';

import Entrar from '../pages/Entrar';
import Cadastro from '../pages/Cadastro';
import Inicio from '../pages/Inicio';
import NovaPartida from '../pages/NovaPartida';
import Jogo from '../pages/Jogo';
import Resultado from '../pages/Resultado';
import Historico from '../pages/Historico';
import Ranking from '../pages/Ranking';

import Painel from '../pages/administrador/Painel';
import Usuarios from '../pages/administrador/Usuarios';
import Temas from '../pages/administrador/Temas';
import Requisitos from '../pages/administrador/Requisitos';
import Dificuldades from '../pages/administrador/Dificuldades';

export default function Rotas() {
  return (
    <Routes>
      <Route element={<RotaPublica />}>
        <Route element={<LayoutAutenticacao />}>
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Route>
      </Route>

      <Route element={<RotaPrivada />}>
        <Route element={<LayoutJogador />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/partidas/nova" element={<NovaPartida />} />
          <Route path="/partidas/:partidaId/resultado" element={<Resultado />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/ranking" element={<Ranking />} />
        </Route>

        <Route element={<LayoutPartida />}>
          <Route path="/partidas/:partidaId" element={<Jogo />} />
        </Route>
      </Route>

      <Route element={<RotaAdministrador />}>
        <Route element={<LayoutAdministrador />}>
          <Route path="/administracao" element={<Painel />} />
          <Route path="/administracao/usuarios" element={<Usuarios />} />
          <Route path="/administracao/temas" element={<Temas />} />
          <Route path="/administracao/requisitos" element={<Requisitos />} />
          <Route path="/administracao/dificuldades" element={<Dificuldades />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
