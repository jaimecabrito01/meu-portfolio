---
title: "Meu servidor de impressão"
description: "Meu servidor de impressão para uma impressora sem conexão de internet"
date: 2026-06-02
tags: ["blog", "pessoal","linux"]
draft: false
---



# Resumo
> Eu fiz um servidor de impressão
> Conectei via USB a impressora ao meu servidor local
> Adicionei a impressora local ao CUPS e deixei ela visivel na rede local para impressão pelo  celular e computador.

# 1- Instalação do CUPS

- Primeiro é preciso fazer a instalçao do cups e dos drivers para a impressora,no meu caso eu usei a hplib

> [!NOTE]
> `sudo apt install cups hplip `

- O dashboard é visto no https://ip_do_seu_servidor:631/admin
- O login é seu login de usuario do servidor
## Possiveis erros
### Erro de permissão
- Caso seu usuario não tenha certas permissões,ele vai bloquear para entrar em /admin . É necessario então fazer a permissão do seu usuario com o comando.
  - `` sudo usermod -aG lpadmin <seu_user> ``
### Erro de acesso por outra maquina
- Caso tente acessar remotamente usando o IP  e a porta. Talvez não funcione de primeira e é necessario fazer a atualização do arquivo de configuração para permitir acesso remoto.
- Em */etc/cups* se encontra o arquivp *cupsd.conf*
- Abrimos e editamos nos blocos `<Location />`, `<Location /admin>` e `<Location /admin/conf>` ,e colocamos ``Allow @LOCAL`` em cada bloco.
- Depois editamos em ``Listen localhost:631`` para  ``Port 631``
- E por fim reiniciamos ``sudo systemctl restart cups``


# Adicionando uma impressora
- Depois de entrarmos em ``/admin`` adicionamos uma impressora entrando no botao de adicionar impressora e seguimos os passos. E selecionamos para compartilhar impressora.
# 3- Instalando o Avahi
- Agora para qualquer dispositivo poder fazer uma impressão é necessario instalar o avahi com o comando ``sudo apt update && sudo apt install avahi-daemon`` 
- Voltamos no arquivo de configuração e mudamos em `` Browsing No `` para``Browsing On`` salvamos e reiniciamos os dois serviços:
```
sudo systemctl restart cups
sudo systemctl restart avahi-daemon
```
