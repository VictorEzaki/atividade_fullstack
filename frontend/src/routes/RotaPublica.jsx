import { Navigate, Outlet } from 'react-router-dom';
import { usarAutenticacao } from '../contexts/AutenticacaoContexto';
import Carregamento from '../components/Carregamento';

export default function RotaPublica() {
  const { autenticado, administrador, carregando } = usarAutenticacao();

  if (carregando) return <Carregamento mensagem="Verificando sua sessao..." />;
  if (autenticado) return <Navigate to={administrador ? '/administracao' : '/'} replace />;

  return <Outlet />;
}
