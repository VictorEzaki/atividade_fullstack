import { Outlet } from 'react-router-dom';

export default function LayoutAutenticacao() {
  return (
    <div className="autenticacao">
      <section className="autenticacao__apresentacao">
        <span className="marca marca--clara">
          <span className="marca__simbolo" aria-hidden="true">
            RF
          </span>
          <span className="marca__nome">Classifica</span>
        </span>
        <h1>Requisito funcional, não funcional ou regra de negocio?</h1>
        <p>
          Dez requisitos por rodada, o relógio correndo e uma pegadinha no meio: alguns nem pertencem ao tema
          sorteado. Classifique rápido, acerte mais e suba no ranking.
        </p>
        <ul className="autenticacao__lista">
          <li>
            <i className="fa-solid fa-layer-group" aria-hidden="true" /> Temas variados de projetos reais
          </li>
          <li>
            <i className="fa-solid fa-stopwatch" aria-hidden="true" /> Quatro níveis de dificuldade
          </li>
          <li>
            <i className="fa-solid fa-chart-line" aria-hidden="true" /> Histórico e revisão dos seus erros
          </li>
        </ul>
      </section>

      <section className="autenticacao__formulario">
        <Outlet />
      </section>
    </div>
  );
}
