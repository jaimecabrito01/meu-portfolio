import { useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router';
import Markdown from 'react-markdown';
import Layout, { Box, Project } from './components/Layout.jsx';
import { projects } from './data/projects.js';
import { updates } from './data/updates.js';

const posts = Object.values(import.meta.glob('./content/blog/*.md', { eager: true, import: 'default' }))
  .filter(post => !post.draft)
  .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
const formatDate = date => date.split('-').reverse().join('/');
const normalizeSlug = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function Page({ title, children }) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = `${title} — Jaime Victor`;
    window.scrollTo(0, 0);
    document.getElementById('conteudo')?.focus({ preventScroll: true });
  }, [title, pathname]);
  return <><h1 className="page-heading">{title}</h1>{children}</>;
}

function Home() {
  return <Page title="Bem-vindo ao meu pedaço da internet!">
    <section className="intro-window">
      <div className="intro-caption"><span>hello_world.txt</span><span aria-hidden="true">― □ ×</span></div>
      <div className="hero"><div className="intro-copy"><span className="hello">Olá, visitante :)</span><h2>Eu sou o Jaime.<br/>Pode entrar!</h2>
        <p>Estudante de Engenharia da Computação, fã de Linux e curioso por tudo que acontece por trás de uma aplicação.</p>
        <p>Este é meu lugar para construir coisas, compartilhar descobertas e deixar a internet um pouco mais pessoal.</p>
        <Link className="retro-button primary" to="/projetos">Conheça meus projetos <span aria-hidden="true">↗</span></Link><Link className="intro-about" to="/sobre">Quem está por aqui?</Link>
      </div><div className="hero-art"><div className="orbit-label">welcome to my world!</div><img className="animated" src="/gifs/majora.gif" alt="Máscara de Majora, de The Legend of Zelda" width="150" height="150"/><span className="art-spark one" aria-hidden="true">✦</span><span className="art-spark two" aria-hidden="true">✧</span><span className="art-caption">um pouco de caos,<br/>muita curiosidade.</span></div></div>
      <div className="intro-foot"><span>⌘ Backend & infraestrutura</span><span>⌖ São Luís, Maranhão</span></div>
    </section>
    <div className="section-heading"><h2>Direto da minha oficina</h2><Link to="/projetos">Todos os projetos ↗</Link></div>
    <div className="home-projects">{projects.slice(0, 2).map((project, i) => <article className="project-tile" key={project.title}><div className={`project-cover cover-${i}`} aria-hidden="true">{i === 0 ? <><span className="recipe-paper">receitas.txt<br/><b>≋ ≋ ≋</b><br/>♡ + Java</span><span className="cover-label">feito em casa</span></> : <><span className="terminal-art">$ ./file-mover.sh<br/><span>Downloads/</span><br/>└── tudo no lugar ✓</span><span className="cover-label">menos bagunça!</span></>}</div><div className="tile-body"><h3>{project.title}</h3><p>{i === 0 ? 'Um lugar para guardar receitas. Do backend ao último ingrediente.' : 'Um script, uma pasta de Downloads e um pouco de ordem no caos.'}</p><a href={project.link}>Ver projeto ↗</a><span className="tile-tech">{i === 0 ? 'Java / Spring Boot' : 'Bash / Linux'}</span></div></article>)}</div>
    <div className="grid lower-grid"><Box title="Diário de bordo"><ul className="updates">{[...updates].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).map(({ date, text }) => <li key={`${date}-${text}`}><time dateTime={date}>{formatDate(date)}</time><p>{text}</p></li>)}</ul><Link to="/blog">Ler minhas anotações ↗</Link></Box><Box title="Minha caixa de ferramentas"><p>As peças que uso para tirar ideias do papel.</p><div className="tool-tags">{['Java', 'Spring Boot', 'Linux', 'Docker', 'Git', 'PostgreSQL', 'AWS', 'Bash', 'React'].map(tool => <span key={tool}>{tool}</span>)}</div><div className="tool-note">Sempre cabe algo novo<br/>nessa caixa. ✳</div></Box></div>
    <div className="guest-note"><span aria-hidden="true">✉</span><p>Gostou da visita? <Link to="/contato">Vamos trocar uma ideia.</Link><br/><small>Uma boa conversa também pode começar num site antigo.</small></p></div>
  </Page>;
}

function About() {
  return <Page title="Sobre mim">
    <Box title=">> Quem sou eu">
      <p>Meu nome é <strong className="highlight">Jaime Victor</strong>, sou estudante de Engenharia da Computação pela UEMA e técnico em Informática pelo IFMA.</p>
      <p>Tenho interesse em backend, Linux, infraestrutura, cloud computing, DevOps e desenvolvimento de sistemas.</p>
      <p>Gosto de entender como uma aplicação é desenvolvida, implantada, monitorada e mantida em produção.</p>
    </Box>
    <Box title=">> Minha jornada"><ul className="timeline">
      <li><strong>IFMA</strong><br />Formação técnica em Informática: programação, bancos de dados, redes e sistemas operacionais.</li>
      <li><strong>Grupo Dimensão</strong><br />Estágio de TI com suporte técnico, implantação do GLPI e desenvolvimento de aplicações internas.</li>
      <li><strong>UEMA</strong><br />Graduação em Engenharia da Computação, aprofundando conhecimentos em computação, arquitetura, redes e software.</li>
      <li><strong>Atualmente</strong><br />Estudando Java, Spring Boot, Docker, Linux, cloud computing e práticas DevOps.</li>
    </ul></Box>
    <Box title=">> Fora do código"><p>Gosto de experimentar no meu home lab, aprender sobre redes e automatizar tarefas. Sempre há um serviço para configurar ou alguma coisa nova para entender.</p></Box>
    <Box title=">> Objetivo"><p>Construir uma carreira em desenvolvimento de software, infraestrutura e automação, aprendendo continuamente e participando de projetos úteis para empresas e usuários.</p></Box>
  </Page>;
}

function Projects() {
  return <Page title="Meus projetos">
    <div className="computer-gif animated"><img src="/gifs/computerhasownmind.gif" alt="Um computador com vontade própria" /></div>
    <Box title=">> Feitos e experimentos">{projects.map(project => <Project key={project.title} project={project} />)}</Box>
    <p>Mais código no <a href="https://github.com/jaimecabrito01">meu GitHub</a>.</p>
  </Page>;
}

function Tags({ tags }) {
  return <div className="tags">{tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>;
}

function Blog() {
  return <Page title="Blog">
    <Box title=">> Anotações, descobertas e tutoriais">
      <p>Um registro do que aprendo com Linux, desenvolvimento e meu home lab.</p>
      {posts.length === 0 ? <p>Nenhum artigo publicado ainda. Volte em breve!</p> : posts.map(post => <article className="post-list-item" key={post.slug}>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p>{post.description}</p><Tags tags={post.tags} />
      </article>)}
    </Box>
  </Page>;
}

function Post() {
  const { slug } = useParams();
  const post = posts.find(post => post.slug === normalizeSlug(slug));
  if (!post) return <NotFound />;
  return <Page title={post.title}>
    <Box title=">> Blog"><article className="post-content">
      <div className="post-meta"><time dateTime={post.date}>{formatDate(post.date)}</time><Tags tags={post.tags} /></div>
      <Markdown>{post.content}</Markdown>
    </article></Box>
    <Link to="/blog">« Voltar para o blog</Link>
  </Page>;
}

function Contact() {
  return <Page title="Contato">
    <Box title=">> Escreva para mim">
      <p>Quer conversar sobre tecnologia, oportunidades, projetos ou apenas trocar ideias? Me encontre por aqui:</p>
      <dl className="contacts">
        <dt>E-mail</dt><dd><a href="mailto:azevedocarneirojaimevictor@gmail.com">azevedocarneirojaimevictor@gmail.com</a></dd>
        <dt>GitHub</dt><dd><a href="https://github.com/jaimecabrito01">jaimecabrito01</a></dd>
        <dt>LinkedIn</dt><dd><a href="https://www.linkedin.com/in/jaime-victor-azevedo-carneiro-santos-7b9215271/">Jaime Victor</a></dd>
        <dt>Localização</dt><dd>São Luís — Maranhão — Brasil</dd>
      </dl>
    </Box>
    <p className="availability">★ Disponível para oportunidades ★</p>
  </Page>;
}

function NotFound() {
  return <Page title="404 — Página não encontrada"><Box title=">> Caminho perdido"><p>Essa página não existe ou mudou de endereço.</p><Link to="/">Voltar para o início</Link></Box></Page>;
}

export default function App() {
  return <Layout><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/sobre" element={<About />} />
    <Route path="/projetos" element={<Projects />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<Post />} />
    <Route path="/contato" element={<Contact />} />
    <Route path="/experiencia" element={<Navigate to="/sobre" replace />} />
    {['index', 'sobre', 'projetos', 'blog', 'contato'].map(page => <Route key={page} path={`/${page}.html`} element={<Navigate to={page === 'index' ? '/' : `/${page}`} replace />} />)}
    <Route path="*" element={<NotFound />} />
  </Routes></Layout>;
}
