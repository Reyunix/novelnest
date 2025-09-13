import { NavLink } from "react-router-dom";

export const Register: React.FC = () => {
  return (
    <div className="center">
      <div className="form-layout">
        <header className="form-header">
          <h1 className="form-h1">Crear una cuenta</h1>
        </header>
        <form action="" method="post" className="form">
          <div>
            <label htmlFor="username" className="form-label">
              Correo electrónico <span className="required-field">*</span>
            </label>
            <input type="text" id="username" autoFocus />
          </div>
          <div>
            <label htmlFor="username" className="form-label">
              Nombre de usuario <span className="required-field">*</span>
            </label>
            <input type="text" id="username" />
          </div>
          <div>
            <label htmlFor="userpass" className="form-label">
              Contraseña <span className="required-field">*</span>
            </label>
            <input type="password" id="userpass" />
          </div>
          <div>
            <label htmlFor="userpass" className="form-label">
              Repetir contraseña <span className="required-field">*</span>
            </label>
            <input type="password" id="userpass" />
          </div>
        </form>
        <footer className="form-footer">
          <button className="btn">Crear cuenta</button>
          <div className="flex-row">
            <NavLink to="" className="links">Condiciones del Servicio</NavLink>
            <NavLink to="" className="links">Pólitica de Privacidad</NavLink>
            <NavLink to="/login" className="links">¿Ya tienes una cuenta? Inicia sesión</NavLink>

          </div>
        </footer>
      </div>
    </div>
  );
};
