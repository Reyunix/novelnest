import { NavLink } from "react-router-dom";

export const Login:React.FC = () => {
  return (
    <div className="center">
      <div className="form-layout">
        <header className="form-header">
          <h1 className="form-h1">¡Hola de nuevo!</h1>
          <p>¡Nos alegramos mucho de volver a verte!</p>
        </header>
        <form action="" method="post" className="form">
          <div>
            <label htmlFor="username" className="form-label">
              Usuario o Correo <span className="required-field">*</span>
            </label>
            <input type="text" id="username" autoFocus />
          </div>
          <div>
            <label htmlFor="userpass" className="form-label">
              Contraseña <span className="required-field">*</span>
            </label>
            <input type="password" id="userpass" />
            <NavLink to="" className="links">
              ¿Has olvidado la contraseña?
            </NavLink>  
          </div>
        </form>
        <footer className="form-footer">
          <button type="submit" className="btn">Iniciar sesión</button>
          <div className="flex-row">
            <p>¿Necesitas una cuenta?</p>
            <NavLink className="links" to="/register"> Registrarse </NavLink>

          </div>
        </footer>
      </div>
    </div>
  );
};
