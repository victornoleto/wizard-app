# Estrutura do projeto

Relembrar estrutura de pastas: https://blog.codedimension.com.br/post/estrutura-de-pastas-em-projetos-angular/


# TODO

O que fazer amanhã 17 de julho

- [x] sort by/direction na tabela, criar diretiva
- [x] NG0956: The configured tracking expression (track by identity) caused re-creation of the entire collection of size 13. This is an expensive operation requiring destruction and subsequent creation of DOM nodes, directives, components etc. Please review the "track expression" and make sure that it uniquely identifies items in a collection. Find more at 
- [x] fazer com que a pesquisa não seja enviada toda hora (por exemplo, ficar escrevendo no campo search), tem que ter um timeout
- [x] componente para tabela vázia
- [x] loading ao carregar registros
- [x] componente para erro ao carregar tabela
- [x] botões de ação
    - [x] editar
    - [x] remover
    - [x] escrever regras de negócios para remover registro
- [x] ajustar cores do sistema, criar cores light e shade
- [x] responsividade da paginação
- [ ] ao mudar filtros alterar a url
- [ ] perguntar pra IA o que dá pra melhorar no fluxo da tela index
- [ ] tentar exibir o dd do backend dentro de um modal
- [ ] fazer diretiva, if, para lidar com renderização de componentes com base na autorização do usuário

## Estruturação inicial

- [ ] Autenticação completa
    - [x] Login
    - [x] Cadastro
    - [ ] Confirmação de e-mail
    - [ ] Recuperação de senha
- [x] Sidebar
- [x] Header
    - [ ] User dropdown
    - [ ] Sidebar toggle button
    - [ ] Dark mode?
- [ ] Tela de perfil
- [ ] Toast
- [ ] Loading Service (exibir loading em toda a tela)
- [x] Dialog (modal)
- [x] Breadcrumbs
- [x] Tela index genérica
- [ ] Tela Form
- [ ] Componentes
    - [ ] Inputs normais
    - [ ] Inputs de data
        - [ ] Normal
        - [ ] Range
    - [ ] Select
        - [ ] Com pesquisa
        - [ ] Múltiplo
        - [ ] Ajax
    - [ ] Tags input
    - [ ] Arquivos (imagens, etc)

# Angular

O angular 20 removeu o sufixo que indicava qual era o tipo daquela classe. Para adicionar novamente basta ajustar o `angular.json` da seguinte forma:

```json
{
  "projects": {
    "app": {
      ...
      "schematics": {
        "@schematics/angular:component": {
            "type": "component",
            "style": "scss"
        },
        "@schematics/angular:directive": { "type": "directive" },
        "@schematics/angular:service": { "type": "service" },
        "@schematics/angular:guard": { "typeSeparator": "." },
        "@schematics/angular:interceptor": { "typeSeparator": "." },
        "@schematics/angular:module": { "typeSeparator": "." },
        "@schematics/angular:pipe": { "typeSeparator": "." },
        "@schematics/angular:resolver": { "typeSeparator": "." }
      },
  ...
}
```

Leitura recomendada:
- https://www.reddit.com/r/Angular2/comments/1l9iq1s/angular_20_removing_suffixes_from_components/
- https://www.reddit.com/r/Angular2/comments/1kzh729/angular_20_cli_generates_userts_instead_of/

Estudos/leitura recomendada:
- Estrutura de pastas: https://blog.codedimension.com.br/post/estrutura-de-pastas-em-projetos-angular/
- https://www.youtube.com/watch?v=JGQmn3c5UeE
- https://angular.dev/guide/signals
    - A seção que fala sobre effects é muito importante. "Effects are rarely needed in most application code".
- https://courses.decodedfrontend.io/courses/advanced-angular-forms?coupon=VID_DYNAMIC_VALIDATION_TDF_10
- https://www.youtube.com/watch?v=ErHbxSq_dYM
- https://www.youtube.com/watch?v=S2DqZxjjL3o
- https://www.youtube.com/watch?v=W7-lsoL-Gi8
- https://www.youtube.com/watch?v=CeEWK9dqIQU

Se você quer passar um sinal de um parent para um child, você deve:
- Usar `input` caso o objetiva seja apenas ler (e ler novamente quando esse valor for alterado) o valor do sinal;
- Usar `model` caso além de ler você também deseje alterar o valor do sinal dentro do child.

Dois vídeos interessantes para entender melhor o 2 way data binding com models:
- https://www.youtube.com/watch?v=yjCeaiWXC0U
- https://www.youtube.com/watch?v=0b43U-l3yGA
- https://www.youtube.com/watch?v=frXIBKqzTK0


# Nginx

Editar arquivo de configuração do nginx: `sudo nano /etc/nginx/sites-enabled/starter-kit-app`

```
server {
    listen 80;
    server_name app.starter-kit.local;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name app.starter-kit.local;
    root /var/www/angular-starter-kit/dist/browser;

    ssl_certificate /etc/nginx/ssl/starter-kit.local+1.pem;
    ssl_certificate_key /etc/nginx/ssl/starter-kit.local+1-key.pem;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public";
    }
}
```