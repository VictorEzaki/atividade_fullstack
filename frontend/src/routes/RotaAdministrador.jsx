import { Navigate, Outlet } from 'react-router-dom';
import { usarAutenticacao } from '../contexts/AutenticacaoContexto';
import Carregamento from '../components/Carregamento';

export default function RotaAdministrador() {
  const { autenticado, administrador, carregando } = usarAutenticacao();

  if (carregando) return <Carregamento mensagem="Verificando suas permissoes..." />;
  if (!autenticado) return <Navigate to="/entrar" replace />;
  if (!administrador) return <Navigate to="/" replace />;

  return <Outlet />;
}
