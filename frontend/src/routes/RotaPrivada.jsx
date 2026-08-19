import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usarAutenticacao } from '../contexts/AutenticacaoContexto';
import Carregamento from '../components/Carregamento';

export default function RotaPrivada() {
  const { autenticado, carregando } = usarAutenticacao();
  const localizacao = useLocation();

  if (carregando) return <Carregamento mensagem="Verificando sua sessão..." />;
  if (!autenticado) return <Navigate to="/entrar" state={{ de: localizacao.pathname }} replace />;

  return <Outlet />;
}
