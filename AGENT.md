# Guia de Orientação do Agente de IA (AGENT.md)

> **Ponto de Entrada Central e Mapa de Navegação do Projeto Gás-Fácil**  
> Todo agente de IA (ou desenvolvedor) que atuar neste projeto deve iniciar a leitura por este documento para compreender a visão, restrições técnicas, padrões de interface e fluxo de implementação.

---

## 1. Visão Geral do Projeto

O **Gás-Fácil** é uma aplicação web para encomenda e entrega ao domicílio de gás butano (Angola), com foco em simplicidade, rapidez e confiabilidade.

- **Proposta de Valor:** Transformar a compra tradicional de gás (feita por canais manuais ou telefone) numa experiência digital com consulta rápida de catálogo, pedido ágil e rastreamento de entrega em tempo real.
- **Grande Diferencial Competitivo:** **Programa de Fidelidade com a função "Gás Bazou"**. Clientes com histórico positivo acumulam pontos e podem solicitar o botijão no modo **Kilape** (crédito emergencial sem pagamento imediato, com data limite estipulada para quitação).

---

## 2. Mapa da Documentação (Fontes da Verdade)

Antes de gerar ou alterar qualquer arquivo, consulte os documentos de referência conforme o objetivo da tarefa:

```text
               ┌────────────────────────────────────────────────────────┐
               │                        AGENT.md                        │
               │   (Ponto de Entrada, Orquestração e Regras Gerais)     │
               └───────────────────────────┬────────────────────────────┘
                                           │
         ┌───────────────────┬─────────────┴───────┬────────────────────┐
         │                   │                     │                    │
         ▼                   ▼                     ▼                    ▼
┌──────────────────┐ ┌───────────────┐ ┌───────────────────────┐ ┌──────────────────┐
│product-vision.md │ │   Stacks.md   │ │Conventions-and-rules.md││ System-Design.md │
│ Visão de Negócio,│ │ Tecnologias,  │ │ Anti-AI Clichés,      │ │ Tokens visuais,  │
│  Módulos, Jornada│ │ LocalStorage, │ │ Bootstrap estrito,    │ │ White-label 4 cores│
│  e "Gás Bazou"   │ │ Arquitetura JS│ │ Bootstrap Icons       │ │ Temas de botijas │
└──────────────────┘ └───────────────┘ └───────────────────────┘ └──────────────────┘
```

| Documento | Quando Consultar | Principais Conteúdos |
| :--- | :--- | :--- |
| [product-vision.md](file:///c:/Users/master/Documents/DEVELOPMENT/ASOFTMEDIA%20-%20PROJECTS/GAS-FACIL/Gas-Facil/product-vision.md) | Para entender o escopo do produto, regras de negócio e jornadas de usuário. | Pilares de valor, catálogo de botijões (13kg e 45kg), checkout, máquina de status de pedidos e regras do "Gás Bazou" (Kilape). |
| [Stacks.md](file:///c:/Users/master/Documents/DEVELOPMENT/ASOFTMEDIA%20-%20PROJECTS/GAS-FACIL/Gas-Facil/Stacks.md) | Para orientações técnicas de backend, persistência e arquitetura de software. | Proibição de frameworks SPA, HTML5 + CSS3 + Vanilla JS, Bootstrap 5 local, camada de dados (`localStorage`), schemas e serviços. |
| [Conventions-and-rules.md](file:///c:/Users/master/Documents/DEVELOPMENT/ASOFTMEDIA%20-%20PROJECTS/GAS-FACIL/Gas-Facil/Conventions-and-rules.md) | Para construir qualquer elemento visual, tela, formulário ou estilização. | **Anti-AI Clichés** (sem bordas tracejadas, sem setas flutuantes, sem neon/glassmorphism), fidelidade ao Bootstrap 5 e uso exclusivo de **Bootstrap Icons (`bi bi-*`)**. |
| [System-Design.md](file:///c:/Users/master/Documents/DEVELOPMENT/ASOFTMEDIA%20-%20PROJECTS/GAS-FACIL/Gas-Facil/System-Design.md) | Para paleta de cores, tipografia e troca dinâmica de temas. | White-Label temático com as 4 cores de botijões de Angola (Azul Sonangol, Verde PumanGás, Laranja Total, Amarela Regional) com seletor no header. |
| [Landing-page.md](file:///c:/Users/master/Documents/DEVELOPMENT/ASOFTMEDIA%20-%20PROJECTS/GAS-FACIL/Gas-Facil/Landing-page.md) | Ao planejar ou implementar a página inicial (`index.html`). | Estrutura de seções da Landing Page, chamadas para ação (CTAs), apresentação de botijões e FAQ. |

---

## 3. As 6 Leis Fundamentais do Agente (Restrições Inegociáveis)

Todo código ou documento produzido por um agente de IA deve respeitar rigorosamente estas 6 regras:

1. **Vanilla Web Only (Sem Frameworks de Componentes):**
   - Não crie componentes React, Vue, Angular ou Svelte.
   - Não configure bundlers como Vite, Webpack ou transpiladores TypeScript. O projeto roda abrindo arquivos HTML diretamente no navegador ou via servidor estático local.
2. **Bootstrap 5 Local & Fiel:**
   - Não utilize CDNs externos para carregar estilos ou scripts.
   - Utilize as classes nativas do Bootstrap (`.card`, `.btn`, `.badge`, `.alert`, `.container`, `.row`, `.col-*`) sem distorcer o framework.
3. **Anti-Estética de IA (Anti-AI Clichés):**
   - **NUNCA** use bordas tracejadas (`border: dashed`) ou malhas pontilhadas (*dot grids*).
   - **NUNCA** use setas curvas desenhadas, conectores pontilhados ou ilustrações rabiscadas (*doodles*).
   - **NUNCA** aplique *glassmorphism* exagerado, efeitos neon/glow ou bolinhas pulsantes em badges.
4. **Exclusividade do Bootstrap Icons:**
   - **Apenas** a biblioteca Bootstrap Icons (`bi bi-*`) é permitida.
   - Proibido misturar FontAwesome, Lucide, Feather ou utilizar emojis avulsos como ícones de interface.
5. **Persistência Exclusiva no `localStorage` (com Abstração):**
   - Toda lógica de autenticação, catálogo, carrinho, histórico e fidelidade deve operar sobre `localStorage` com o prefixo `gf_`.
   - Sempre utilize a camada de serviços (`storage.js`, `orderService.js`, `authService.js`, `loyaltyService.js`), nunca chamando `localStorage` diretamente nos arquivos de página.
6. **Alinhamento do Diferencial de Negócio:**
   - Mantenha sempre a fidelidade e a funcionalidade **"Gás Bazou" (Kilape)** presente nos modelos de checkout e perfil do cliente, garantindo a verificação de pontuação e data limite para liquidação.

---

## 4. Estrutura Padrão de Arquivos do Projeto

Ao criar novos módulos ou telas, siga fielmente a distribuição de pastas:

```text
Gas-Facil/
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css        # Framework local (v5.3+)
│   │   ├── bootstrap-icons.css      # Ícones locais
│   │   ├── theme.css                # Variáveis CSS dos 4 temas (System-Design.md)
│   │   └── styles.css               # Estilos personalizados complementares
│   ├── js/
│   │   ├── vendor/
│   │   │   └── bootstrap.bundle.min.js  # Bootstrap JS local
│   │   ├── services/
│   │   │   ├── storage.js           # Gerenciador central de localStorage
│   │   │   ├── seedData.js          # Mock data inicial (produtos, usuário teste)
│   │   │   ├── authService.js       # Autenticação e sessão (gf_session)
│   │   │   ├── productService.js    # Catálogo de botijões (13kg, 45kg)
│   │   │   ├── orderService.js      # Criação e atualização de pedidos
│   │   │   └── loyaltyService.js    # Regras de pontos e "Gás Bazou" (Kilape)
│   │   ├── utils/
│   │   │   ├── formatters.js        # Moeda (Kz), datas, formatação de telefone
│   │   │   ├── validators.js        # Validação de formulários
│   │   │   └── themeSwitcher.js     # Lógica do seletor de cores das botijas
│   │   └── pages/
│   │       ├── home.js              # Interatividade da Landing Page
│   │       ├── auth.js              # Login e registro
│   │       ├── checkout.js          # Carrinho, seleção de botija e "Gás Bazou"
│   │       ├── tracking.js          # Linha do tempo do pedido
│   │       ├── history.js           # Histórico de compras e saldo de pontos
│   │       └── admin.js             # Painel administrativo
│   └── images/
│       ├── products/                # Ilustrações/fotos das botijas
│       └── logo.svg                 # Identidade visual
├── index.html                       # Landing Page
├── login.html                       # Autenticação
├── register.html                    # Registo de clientes
├── checkout.html                    # Realização de pedidos
├── tracking.html                    # Rastreamento em tempo real
├── history.html                     # Histórico e pontos de fidelidade
├── admin.html                       # Gestão de pedidos e Kilapes
├── AGENT.md                         # Este documento de mapeamento do agente
├── product-vision.md                # Visão e requisitos de produto
├── Stacks.md                        # Tecnologias e especificações técnicas
├── Conventions-and-rules.md         # Regras de UI e convenções de código
├── System-Design.md                 # Design system, tokens e White-label
└── Landing-page.md                  # Especificação da Landing Page
```

---

## 5. Workflow Recomendado para o Agente em Cada Tarefa

Sempre que o usuário solicitar uma nova funcionalidade, alteração ou criação de tela:

```
[1. Leitura do Mapa] ───► [2. Checagem de Regras] ───► [3. Implementação] ───► [4. Verificação]
  Consultar AGENT.md        Validar restrições           Escrever código          Checklist final
  e docs específicos        de Stacks & Conventions      limpo e modular          antes de entregar
```

1. **Leitura Prévia:** Identifique quais seções de `product-vision.md`, `Stacks.md`, `Conventions-and-rules.md` e `System-Design.md` tratam do assunto da tarefa.
2. **Checagem de Restrições:** Relembre: *Não usar React/Vue? Bootstrap Icons apenas? Sem tracejados de IA? Persistência no storage?*
3. **Implementação Limpa:**
   - Se for criar uma tela HTML: use caminhos relativos para `assets/`, componentes oficiais do Bootstrap e ícones `bi bi-*`.
   - Se for criar lógica de dados: implemente nos módulos em `assets/js/services/` com promises assíncronas.
4. **Verificação Pré-Entrega:** Realize um teste mental ou visual contra o Checklist do Capítulo 6.

---

## 6. Checklist de Verificação Pré-Entrega do Agente

Antes de finalizar qualquer resposta ao usuário, o agente deve validar:

- [ ] A solução utiliza apenas **HTML5, CSS3 e JavaScript Vanilla** (sem frameworks SPA)?
- [ ] Os recursos do Bootstrap e ícones estão apontados para caminhos locais (sem links CDN externos)?
- [ ] Foram evitados todos os vícios de UI de IA (sem bordas tracejadas, sem setas soltas, sem gradientes neon, sem cards com reflexos plásticos)?
- [ ] Foram utilizados **apenas Bootstrap Icons (`bi bi-*`)**?
- [ ] Os dados manipulados passam pela camada de abstração em `assets/js/services/` utilizando o prefixo `gf_` no `localStorage`?
- [ ] Formulários possuem validação semântica com feedback acessível (`needs-validation`)?
- [ ] A funcionalidade **"Gás Bazou" (Kilape)** foi respeitada nas opções de pedido quando o contexto envolver checkout, pagamento ou histórico?
- [ ] O layout é totalmente **responsivo (mobile-first)**?
