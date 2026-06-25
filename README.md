# SEI+Trello _(fork comunitário — versão Beta)_

> **Este é um fork não oficial** do projeto original [SEI+Trello](https://github.com/luiscrjunior/sei-trello), criado por [Luís Carlos Reischak Júnior](https://github.com/luiscrjunior). O projeto original parou de receber atualizações e esta versão surgiu da necessidade de compatibilidade com o SEI 4.x e o Manifest V3 do Chrome/Firefox.
>
> ⚠️ **Versão Beta.** Pode conter instabilidades. Contribuições são bem-vindas!

Extensão para Chrome e Firefox que integra o [Sistema Eletrônico de Informações (SEI)](https://www.gov.br/gestao/pt-br/sei) ao [Trello](https://trello.com), permitindo visualizar e criar cartões diretamente na interface do SEI — sem precisar alternar entre os dois sistemas.

## O que há de novo neste fork?

Comparado ao projeto original, esta versão traz:

- ✅ **Compatibilidade com SEI 4.x** — novos seletores DOM e fallbacks para a interface atualizada do SEI
- ✅ **Manifest V3** — necessário para continuar funcionando no Chrome e Firefox modernos
- ✅ **Cores responsivas ao tema do SEI** — os cartões Trello assumem automaticamente a cor de tema escolhida pelo usuário no SEI
- ✅ **Build atualizado** — migração de `node-sass` para `sass` (Dart Sass), compatível com Node.js 22+

## Política de Privacidade

Esta extensão **não coleta, armazena, vende nem transfere dados pessoais dos usuários** a terceiros.

Os únicos dados salvos são as credenciais do Trello (APP-KEY e TOKEN) e as preferências do usuário (quadro e lista padrão), armazenados localmente no navegador via `chrome.storage.sync`. Esses dados são usados exclusivamente para autenticar as requisições à API oficial do Trello (`api.trello.com`) e nunca são enviados a nenhum servidor externo além do próprio Trello.

A extensão não monitora atividade do usuário, não lê histórico de navegação e não acessa nenhuma informação além das páginas do SEI onde é ativada.

:pencil: Acesse o [CHANGELOG](CHANGELOG.md) para conhecer as atualizações de cada versão.

## Quer apenas usar a extensão?

:arrow_right: Está usando o **Chrome**? Acesse a página da extensão [na Chrome Web Store](https://chromewebstore.google.com/detail/sei%2Btrello/jfegjbaokkioppehhmelfdbjinfcbdmj?hl=pt-BR) e clique em `Usar no Chrome` (canto superior direito).

:arrow_right: Está usando o **Firefox**? Acesse a página da extensão [no Firefox Browser Add-Ons](https://addons.mozilla.org/pt-BR/firefox/addon/sei-trello-fork/) e clique em `Adicionar ao Firefox`.

Depois de instalar, acesse a página de opções da extensão e informe:
1. Sua **Trello APP-KEY** (obtenha em [trello.com/app-key](https://trello.com/app-key))
2. Seu **Trello TOKEN**
3. O nome do **quadro padrão**
4. O nome da **lista padrão**

Pronto! Abra o SEI e seu Trello já estará integrado.

## Encontrou um bug ou tem uma sugestão?

Abra uma [issue neste repositório](https://github.com/awlmdnitce/sei-trello/issues). Esta é uma versão Beta mantida pela comunidade — todo feedback é bem-vindo.

## Quer contribuir com o desenvolvimento?

Fique à vontade para abrir _pull requests_. O projeto usa as seguintes tecnologias:

- **JavaScript ES6+** transpilado via [`babel`](https://babeljs.io/)
- **React** para os componentes de interface
- **Webpack 5** como bundler
- **Sass** (Dart Sass) para os estilos
- **npm** como gerenciador de pacotes

### Requisitos

- Node.js 18+ (testado no Node.js 22 no Windows)
- npm instalado

### Ambiente de desenvolvimento

Clone este repositório:

```
git clone https://github.com/awlmdnitce/sei-trello.git
cd sei-trello
npm install
```

Compile em modo desenvolvimento (com watch):

```
npm run webpack:dev:watch
```

O código gerado fica em `dist/expanded`. Carregue esse diretório no Chrome em **Gerenciar extensões → Modo desenvolvedor → Carregar extensão expandida**, ou no Firefox em **about:debugging → Carregar extensão temporária**.

Para gerar a versão de produção (minificada):

```
npm run webpack:prod
```

### Testes

```
npm run webpack:test   # gera bundle de testes (necessário para e2e)
npm run test           # executa todos os testes
```

Testes unitários/integração apenas:
```
npx jest --selectProjects 'Unit and Integration Tests'
```

Testes e2e apenas:
```
npx jest --selectProjects 'E2E Tests'
```

### Playground

Ambiente com hot reload para desenvolvimento de componentes React:

```
npm run playground
```

Acesse `http://localhost:8080/` no navegador.

### Padrões de código

O projeto usa `eslint` e `prettier`. As regras estão em `.eslintrc.js` e `.prettierrc.js`. Todo o código é escrito em inglês.

---

_Fork mantido pela comunidade. Projeto original por [Luís Carlos Reischak Júnior](https://github.com/luiscrjunior/sei-trello) — licença MIT._
