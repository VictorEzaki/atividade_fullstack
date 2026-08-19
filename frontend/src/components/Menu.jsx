import { NavLink } from 'react-router-dom';

export default function Menu({ itens, orientacao = 'horizontal' }) {
  return (
    <nav className={`menu menu--${orientacao}`} aria-label="Navegação principal">
      {itens.map((item) => (
        <NavLink
          key={item.caminho}
          to={item.caminho}
          end={item.exato}
          className={({ isActive }) => `menu__item ${isActive ? 'menu__item--ativo' : ''}`}
        >
          <i className={item.icone} aria-hidden="true" />
          <span>{item.rotulo}</span>
        </NavLink>
      ))}
    </nav>
  );
}
