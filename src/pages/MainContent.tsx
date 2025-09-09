export const MainContent: React.FC = () => {
  return (
    <main className="main-content">
      <section className="main-section">
        <article className="article">
          <section id="introduction">
            <h2>¿Te gusta leer?</h2>
            <p>
              Estás en el lugar indicado. Este es un rincón personal en el que
              podrás guardar todas tus obras favoritas y llevarlas contigo a
              cualquier parte. Nos complace poder acompañarte en el maravilloso
              mundo de la lectura.
            </p>
          </section>
          <section>
            <h2>
              ¿Qué puedes hacer en <em>Mi Colección de Libros?</em>
            </h2>
            <p>
              En esta web podrás crear tu propia biblioteca personal con
              <strong> listas personalizadas</strong> de libros. Podrás
              organizarlos, clasificarlos y llevar un seguimiento.
            </p>
            <ul>
              <li>Visualizar libros disponibles</li>
              <li>
                Crear múltiples listas y clasificarlas por temática o género
              </li>
              <li>Marcar libros como leídos o en proceso de lectura</li>
              <li>Filtrar los libros por género, autor o fecha de lectura</li>
              <li>Consultar el progreso de tus lecturas</li>
            </ul>
          </section>
          <a href="html/micoleccion.html" className="action-link hover-opacity">
            ¡Empieza a coleccionar!
          </a>
        </article>
      </section>
      {/* <!-- Contenido complementario --> */}
      <section className="top-books-section">
        <article>
          <h2>Top libros del mes</h2>
          <ol>
            <li>
              <em>
                <strong>La llamada</strong>, Leila Guerriero
              </em>
            </li>
            <li>
              <em>
                <strong>La biblioteca de la medianoche</strong>, Matt Haig
              </em>
            </li>
            <li>
              <em>
                <strong>El club de los libros prohibidos</strong>, Kim
                Hyun-sook, Ryan Estrada, Ko Hyung-ju
              </em>
            </li>
            <li>
              <em>
                <strong>Un cuento perfecto</strong>, Elísabet Benavent
              </em>
            </li>
            <li>
              <em>
                <strong>La sombra del viento</strong>, Carlos Ruiz Zafón
              </em>
            </li>
            <li>
              <em>
                <strong>1984</strong>, George Orwell
              </em>
            </li>
            <li>
              <em>
                <strong>Los siete maridos de Evelyn Hugo</strong>, Taylor
                Jenkins Reid
              </em>
            </li>
            <li>
              <em>
                <strong>El cuento de la criada</strong>, Margaret Atwood
              </em>
            </li>
            <li>
              <em>
                <strong>Matar a un ruiseñor</strong>, Harper Lee
              </em>
            </li>
          </ol>
        </article>
      </section>
    </main>
  );
};
