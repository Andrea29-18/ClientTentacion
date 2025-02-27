import './Navbar.css';
import cartIcon from "../assets/Navbar/cartIcon.png";
import storeIcon from "../assets/Navbar/storeIcon.png";
import userIcon from "../assets/Navbar/userIcon.png";

const Navbar = () => {
  const handleCartClick = () => {
    alert('Carrito de compras clickeado'); // Función para manejar el clic
  };

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
        <li>
          <button onClick={handleCartClick} className="icon-button">
            <img src={storeIcon} alt="Sucursal" className="icon-image" /> {/* Imagen como botón */}
          </button>
        </li>
        <li>
          <button onClick={handleCartClick} className="icon-button">
            <img src={cartIcon} alt="Carrito" className="icon-image" /> {/* Imagen como botón */}
          </button>
        </li>
        <li>
          <button onClick={handleCartClick} className="icon-button">
            <img src={userIcon} alt="Usuario" className="icon-image" /> {/* Imagen como botón */}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;