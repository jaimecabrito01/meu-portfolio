# Site pessoal de Jaime Victor

Portfólio em **React + Vite**, em português, com a estética de páginas pessoais da web antiga: fundo azul, links amarelos, bordas em relevo e GIFs. Inclui início, sobre, projetos, blog em Markdown e contato, com layout adaptado para celular.

## Desenvolvimento

Requer Node.js **22.12 ou superior** e Yarn Classic 1.22.

```sh
yarn install --frozen-lockfile
yarn dev                 # http://localhost:4321
yarn test                # blog e simulações de deploy
yarn build               # gera dist/
yarn preview             # preview do build na porta 4321
```

O desenvolvimento usa `yarn.lock`; Docker e CI usam `npm ci` com `package-lock.json`. Ao alterar dependências, atualize o `yarn.lock` com `yarn install`. Para regenerar o lockfile npm, copie `package.json` e `yarn.lock` para uma pasta temporária limpa, execute nela `npm install --package-lock-only --ignore-scripts` e copie o `package-lock.json` resultante de volta. Isso reutiliza as resoluções do Yarn e inclui os pacotes opcionais de outras plataformas. Confira ambos os lockfiles e valide o build Docker.

```text
src/
  App.jsx                 Rotas e páginas
  components/Layout.jsx   Navegação, caixas e rodapé
  content/blog/*.md        Artigos originais
  data/                   Projetos e atualizações
  styles/global.css       Visual retrô e layout responsivo
scripts/
  blog.mjs                Metadados Markdown processados no build
  deploy.sh               Build, healthcheck e rollback no servidor
nginx/default.conf        Arquivos estáticos e fallback das rotas React
compose.yaml              Serviço web
.github/workflows/main.yml
```

As rotas antigas com `.html` redirecionam dentro da aplicação. `/experiencia` abre a trajetória em `/sobre`. O Nginx permite abrir ou atualizar diretamente rotas como `/blog/primeiro-post`. URLs desconhecidas mostram uma página 404 no React; como é uma SPA, o documento HTML responde HTTP 200. O conteúdo requer JavaScript e não é pré-renderizado.

## Publicar artigos

Crie um arquivo em `src/content/blog/`, por exemplo `meu-artigo.md`:

```md
---
title: "Meu artigo"
description: "Uma descrição curta."
date: 2026-11-09
tags: [linux, devops]
draft: false
---

## O que aprendi

Texto em Markdown.
```

A publicação acontece no próximo build. O nome do arquivo vira a URL (`/blog/meu-artigo`); acentos nos nomes são normalizados. Artigos com `draft: true` não têm conteúdo incluído no bundle público. HTML arbitrário dentro de Markdown não é executado.

## Docker Compose

```sh
cp .env.example .env
# Ajuste PORT e BIND_ADDRESS se necessário.
docker compose up -d --build --wait --wait-timeout 90
docker compose ps
docker compose logs -f web
```

Padrão: **http://IP_DO_SERVIDOR:8080**. O container serve arquivos pelo Nginx na porta 80; o Node só é usado no build. `/health` responde `ok` e é usado pelo healthcheck. Para publicar atrás de um proxy instalado no host, configure `BIND_ADDRESS=127.0.0.1` e encaminhe o domínio para `127.0.0.1:8080`. TLS e DNS devem ser configurados no proxy/servidor. Se o proxy roda em outro container, configure uma rede compartilhada conforme sua infraestrutura.

## Preparar o runner no servidor

1. Instale Docker Engine e **Docker Compose v2** com suporte a `--wait` e `--wait-timeout`. O host precisa de Bash, Git, tar, `flock` (util-linux) e acesso à internet para imagens e dependências. Não é necessário instalar Node no servidor.
2. No repositório do GitHub, abra **Settings → Actions → Runners → New self-hosted runner**, escolha Linux e execute no servidor os comandos exibidos pelo GitHub, usando um usuário dedicado. Adicione a label **`portfolio`**; as labels `self-hosted` e `linux` já são fornecidas pelo runner. Instale e inicie o runner como serviço usando `svc.sh`, conforme as instruções exibidas.
3. Dê ao usuário do runner acesso ao Docker e permissão de escrita em `$HOME/apps/portfolio`. Se usar o grupo `docker`, reinicie a sessão/serviço após adicionar o usuário. Esse acesso concede controle administrativo sobre o host; mantenha o runner restrito ao repositório confiável.
4. Crie o environment **`production`** em **Settings → Environments**. O workflow não exige aprovação manual; qualquer regra de aprovação configurada nesse environment será respeitada.
5. Opcionalmente, configure as variáveis abaixo em **Settings → Secrets and variables → Actions → Variables** ou no environment `production`.

| Variável | Padrão | Uso |
| --- | --- | --- |
| `PORTFOLIO_DEPLOY_ROOT` | `$HOME/apps/portfolio` | Caminho absoluto persistente, fora do workspace do runner |
| `PORTFOLIO_PORT` | `8080` | Porta publicada no servidor |
| `PORTFOLIO_BIND_ADDRESS` | `0.0.0.0` | IPv4 de escuta; use `127.0.0.1` com proxy no host |

Não há secrets de aplicação, login de registry ou conexão SSH neste modelo. O runner constrói a imagem diretamente no servidor. Uma `.env` do checkout não configura o deploy automático: ele gera uma configuração por release a partir dessas variáveis.

Se o servidor já hospeda a versão anterior em Kubernetes ou outro container, ajuste o proxy/domínio e a porta para o novo Compose e encerre a instalação antiga depois de validar a nova. Os manifests Kubernetes foram retirados desta versão; a pipeline não altera clusters existentes.

## CI e deploy automático

- **PR para `main`:** instala com `npm ci`, testa o processamento dos artigos e os cenários de deploy, compila o React, valida Compose e sobe a imagem em `ubuntu-latest` para testar healthcheck e respostas HTTP das rotas no Nginx. Código de PR não roda no servidor de produção.
- **Push na `main`:** repete a validação e, após sucesso, faz deploy em `[self-hosted, linux, portfolio]`.
- **Execução manual:** disponível em **Actions → CI e deploy do portfolio → Run workflow**. Selecione `main` para implantar; outras branches só são validadas.
- **Deploys serializados:** um deploy em andamento não é cancelado por outro push. `flock` também impede deploys manuais simultâneos no servidor.

Recomenda-se proteger `main` exigindo o check **Validar React e Docker** antes do merge. O healthcheck verifica o Nginx do container; não verifica DNS, HTTPS ou acesso público ao domínio.

O script exporta o commit validado com `git archive` para `releases/<sha>.<id>`, fora do checkout temporário. As imagens recebem a tag do SHA, o build termina antes da substituição e o Compose usa sempre o projeto `portfolio`. O link `current` só muda após o healthcheck passar.

Se o build falhar, a versão em execução continua ativa. Se a subida/healthcheck falhar, o script tenta restaurar a imagem e a configuração da última release saudável, mantendo o job como falho. **No primeiro deploy ainda não existe rollback.** Se o rollback falhar, os logs indicam a necessidade de intervenção. A substituição do container pode causar uma breve interrupção; não há promessa de zero downtime.

Para restaurar manualmente uma release existente no servidor, escolha o diretório desejado e execute como o usuário do runner:

```sh
release="$HOME/apps/portfolio/releases/SHA.ID"
env -u IMAGE_TAG -u PORT -u BIND_ADDRESS docker compose \
  --project-name portfolio --env-file "$release/.env" -f "$release/compose.yaml" \
  up -d --no-build --pull never --wait --wait-timeout 90
# Somente após sucesso:
ln -sfn "$release" "$HOME/apps/portfolio/current"
```

Adapte o caminho se configurou `PORTFOLIO_DEPLOY_ROOT`. Releases e imagens anteriores são preservadas para recuperação; monitore o espaço em disco e faça manutenção consciente das versões que ainda precisa manter. Não use `docker image prune -a` enquanto depender dessas imagens para rollback.
