import { ProvedorAutenticacao } from './contexts/AutenticacaoContexto';
import Rotas from './routes';

export default function App() {
  return (
    <ProvedorAutenticacao>
      <Rotas />
    </ProvedorAutenticacao>
  );
}
