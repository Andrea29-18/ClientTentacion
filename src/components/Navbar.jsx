import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">D. Tentación</span>
      </div>
      <ul className="navbar-links">
        <li><a href="#nosotros">Nosotros</a></li>
        <li><a href="#sucursales">Sucursales</a></li>
        <li><a href="#productos">Productos</a></li>
        <li><a href="#familia">Familia</a></li>
        <li><a href="#ordena-aqui">Ordena Aquí</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;