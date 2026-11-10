import { useState } from 'react';
import { NavLink, Link } from 'react-router';
import clippy from '../assets/clipy.gif';

const navigation = [['/', '⌂', 'Início'], ['/sobre', '☺', 'Sobre mim'], ['/projetos', '▣', 'Projetos'], ['/blog', '▤', 'Blog'], ['/contato', '✉', 'Contato']];

export function Box({ title, children }) {
  return <section className="box"><h2 className="box-title"><span>{title.replace(/^>> /, '')}</span><span aria-hidden="true" className="window-dots">▪ ▪</span></h2><div className="box-body">{children}</div></section>;
}

export function Project({ project }) {
  return <article className="project">
    <span className="project-icon" aria-hidden="true">▣</span><div>
    <h3>{project.title}</h3><p className="tech">{project.tech}</p>
    <p>{project.description}</p>
    {project.link ? <a href={project.link}>Abrir repositório ↗</a> : <Link to="/blog">Explorar o diário do lab ↗</Link>}</div>
  </article>;
}

export default function Layout({ children }) {
  const [animations, setAnimations] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [tip, setTip] = useState(0);
  const tips = ['Parece que você está explorando um site pessoal. Que tal conhecer meus projetos?', 'Dica de navegação: o blog guarda descobertas do meu home lab!', 'Não precisa de disquete. Meus projetos estão no GitHub.'];
  return <div className={animations ? 'desktop' : 'desktop still'}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div className="desktop-top"><span>jaime@internet:~</span><span>São Luís, MA <span aria-hidden="true">☀</span></span></div>
    <div className="site-layout">
      <header className="masthead">
        <div><div className="site-kicker">Um pequeno endereço na grande internet.</div><Link to="/" className="site-title">jaime<span className="title-star">✳</span>victor<span className="title-dot">.dev</span></Link><p className="subtitle">Código, pinguins & outras experiências.</p></div>
        <div className="masthead-sticker">100% pessoal<br/><strong>0% algoritmo</strong><span aria-hidden="true">✦</span></div>
      </header>
      <div className="welcome-strip"><span>★ Você chegou ao meu cantinho da web!</span><span>Entre, explore e fique à vontade. ★</span></div>
      <aside className="sidebar left-sidebar" aria-label="Navegação e interesses">
        <section className="directory"><h2>Explorar o site</h2><nav aria-label="Navegação principal">{navigation.map(([path, icon, label]) => <NavLink key={path} to={path} end={path === '/'}><span aria-hidden="true">{icon}</span>{label}<span className="nav-arrow" aria-hidden="true">▸</span></NavLink>)}</nav><div className="directory-bottom">5 pastas • muitas ideias</div></section>
        <section className="linux-note"><span className="note-pin" aria-hidden="true">✦</span><h2>Há um pinguim<br/>neste computador.</h2><img className="animated" src="/gifs/pcpinguin.gif" alt="Pinguim digitando no computador" width="130"/><p>Linux user<br/><strong>e com orgulho!</strong></p></section>
        <div className="badge-stack"><span className="web-badge purple">I ♥ PERSONAL WEBSITES</span><span className="web-badge">feito à mão / React</span><span className="web-badge green">powered by curiosity</span></div>
        <button className="motion-toggle" onClick={() => setAnimations(!animations)} aria-pressed={!animations}>{animations ? '◼ Esconder GIFs' : '▶ Mostrar GIFs'}</button>
      </aside>
      <div className="content-area"><div className="browser-bar"><span aria-hidden="true">◉</span><span>jaime.local / meu espaço na internet</span><span aria-hidden="true">✦</span></div><main id="conteudo" tabIndex={-1}>{children}</main></div>
      <aside className="sidebar right-sidebar" aria-label="Anotações pessoais">
        <section className="status-note"><h2><span className="status-light"/>Neste momento</h2><p>Entre um commit<br/>e um café.</p><hr/><span>Estudando</span><strong>Java & Spring Boot</strong><span>Explorando</span><strong>Linux & DevOps</strong><Link to="/sobre">Mais sobre mim ↗</Link></section>
        <section className="clippy-note"><p aria-live="polite">{tips[tip]}</p><button onClick={() => setTip((tip + 1) % tips.length)}>Outra dica</button><img className="animated" src={clippy} alt="Clippy, o assistente do Office" width="100"/></section>
        <div className="construction"><img className="animated" src="/gifs/constrct.gif" alt="" width="130"/><p>Um site pessoal nunca<br/>fica pronto. Ainda bem.</p></div>
        <a className="mail-stamp" href="mailto:azevedocarneirojaimevictor@gmail.com"><span aria-hidden="true">✉</span>Mande um alô!</a>
      </aside>
      <footer className="footer"><span>© {new Date().getFullYear()} Jaime Victor <span aria-hidden="true">✳</span> Feito com curiosidade.</span><span>A web é melhor com sites pessoais. <a href="#top" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'instant' }); }}>Voltar ao topo ↑</a></span></footer>
    </div>
  </div>;
}
