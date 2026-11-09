import { NavLink, Link } from 'react-router';
import clippy from '../assets/clipy.gif';

const navigation = [['/', 'Início'], ['/sobre', 'Sobre'], ['/projetos', 'Projetos'], ['/blog', 'Blog'], ['/contato', 'Contato']];

export function Box({ title, children }) {
  return <section className="box"><h2 className="box-title">{title}</h2>{children}</section>;
}

export function Project({ project }) {
  return <article className="project">
    <h3>{project.title}</h3>
    <p className="tech">{project.tech}</p>
    <p>{project.description}</p>
    {project.link && <a href={project.link}>Ver no GitHub</a>}
  </article>;
}

export default function Layout({ children }) {
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div className="site-layout">
      <aside className="sidebar" aria-label="Cantinho Linux">
        <div className="sidebar-note">Este site tem<br />um pinguim dentro.</div>
        <img src="/gifs/pcpinguin.gif" alt="Pinguim no computador" width="150" />
        <div className="web-badge">Linux user<br /><strong>e com orgulho!</strong></div>
        <img src="/gifs/esqueleto.gif" alt="" width="110" />
      </aside>
      <div className="content-area">
        <header>
          <div className="welcome-strip">★ Bem-vindo ao meu cantinho da internet ★</div>
          <Link to="/" className="site-title">★ Jaime Victor ★</Link>
          <p className="subtitle">Backend Developer • DevOps Enthusiast • Linux User</p>
          <nav className="navbar" aria-label="Navegação principal">
            {navigation.map(([path, label]) => <NavLink key={path} to={path} end={path === '/'}>{label}</NavLink>)}
          </nav>
        </header>
        <main id="conteudo" tabIndex={-1}>{children}</main>
        <footer className="footer">
          <p className="footer-badges"><span className="web-badge">Feito à mão<br /><strong>com React</strong></span><span className="web-badge">A web é melhor<br /><strong>com sites pessoais</strong></span></p>
          <p>Obrigado pela visita. Volte sempre!</p>
          <p className="nostalgia">No espírito do Netscape, com espaço para o seu celular.</p>
          <div className="statusbar"><span>© {new Date().getFullYear()} Jaime Victor</span><Link to="/contato">Escreva para mim</Link></div>
        </footer>
      </div>
      <aside className="sidebar" aria-label="Cantinho do Clippy">
        <img src={clippy} alt="Clippy, o assistente clássico do Office" width="140" />
        <div className="sidebar-note">Parece que você está<br />visitando um site pessoal!</div>
        <img src="/gifs/constrct.gif" alt="" width="130" />
        <p>Sempre em construção.</p>
      </aside>
    </div>
  </>;
}
