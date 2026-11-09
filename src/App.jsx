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
  return <Page title="Bem-vindo ao meu site!">
    <Box title=">> Olá, visitante!">
      <div className="hero">
        <div className="avatar"><img src="/gifs/majora.gif" alt="Máscara de Majora, de The Legend of Zelda" width="150" height="150" /></div>
        <div><p>Meu nome é <strong className="highlight">Jaime Victor</strong>.</p>
          <p>Sou estudante de Engenharia da Computação pela UEMA, técnico em Informática pelo IFMA e apaixonado por infraestrutura, Linux, backend e DevOps.</p>
          <p>Este é meu espaço para guardar projetos, compartilhar o que aprendo e falar de tecnologia. Fique à vontade!</p></div>
      </div>
    </Box>
    <div className="grid">
      <Box title=">> Projetos em destaque">
        {projects.slice(0, 2).map(project => <Project key={project.title} project={project} />)}
        <Link to="/projetos">Ver todos os projetos »</Link>
      </Box>
      <Box title=">> Diário de bordo">
        <ul className="updates">{[...updates].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map(({ date, text }) => <li key={`${date}-${text}`}><time dateTime={date}>[{formatDate(date)}]</time> {text}</li>)}</ul>
        <Link to="/blog">Ler o blog »</Link>
      </Box>
    </div>
    <Box title=">> Tecnologias favoritas"><p>Java • Spring Boot • Linux • Docker • Git • PostgreSQL • AWS • Bash • React</p></Box>
    <Box title=">> Pela vizinhança"><p><Link to="/sobre">Minha trajetória</Link> / <Link to="/projetos">Meus projetos</Link> / <Link to="/blog">Meus artigos</Link> / <Link to="/contato">Vamos conversar</Link></p></Box>
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
    <div className="computer-gif"><img src="/gifs/computerhasownmind.gif" alt="Um computador com vontade própria" /></div>
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
