import { Link } from 'react-router-dom';
import { usarAutenticacao } from '../contexts/AutenticacaoContexto';
import Menu from './Menu';

export default function Cabecalho({ itens = [], compacto = false }) {
  const { usuario, sair } = usarAutenticacao();

  return (
    <header className={`cabecalho ${compacto ? 'cabecalho--compacto' : ''}`}>
      <div className="cabecalho__interno">
        <Link to="/" className="marca" aria-label="Classifica, pagina inicial">
          <span className="marca__simbolo" aria-hidden="true">
            RF
          </span>
          <span className="marca__nome">Classifica</span>
        </Link>

        {itens.length > 0 && <Menu itens={itens} />}

        <div className="cabecalho__usuario">
          <span className="cabecalho__nome">{usuario?.nome}</span>
          <button type="button" className="botao botao--texto botao--pequeno botao-sair" onClick={sair}>
            <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
