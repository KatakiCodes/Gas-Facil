# Diretrizes de Tecnologias e Stacks do Projeto (Stacks.md)

Este documento estabelece as diretrizes técnicas, arquitetura de software, padrões de código e restrições mandatórias para o desenvolvimento do **Gás-Fácil**. 

> [!IMPORTANT]
> **Atenção para o Agente de IA e Desenvolvedores:**  
> Este projeto possui restrições estritas de tecnologias. **Não é permitido** introduzir frameworks modernos de front-end (como React, Angular, Vue, Svelte, Next.js ou similares), nem depender de geradores de bundle complexos (Webpack, Vite, etc.) sem aprovação expressa. O projeto deve rodar diretamente no navegador via servidor estático (como Live Server ou Nginx).

---

## 1. Stack Tecnológica Principal

| Camada | Tecnologia Adotada | Observações e Regras |
| :--- | :--- | :--- |
| **Marcação** | **HTML5 Semântico** | Tags estruturais (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`). Semântica rica e acessibilidade (a11y). |
| **Estilização** | **CSS3 Moderno + Bootstrap 5 (Local)** | Bootstrap v5.3+ armazenado **localmente** no projeto (sem dependência de links externos/CDN). CSS customizado para identidade visual. |
| **Linguagem / Lógica** | **JavaScript Vanilla (ES6+)** | Javascript puro moderno. Sem TypeScript, sem frameworks. Modular via padrão de Namespace (`window.GasFacil`) e scripts clássicos desacoplados, garantindo compatibilidade total com execução direta em `file:///` (duplo clique) e servidores HTTP. |
| **Persistência de Dados** | **Browser `localStorage`** | Principal mecanismo de banco de dados e persistência de sessão (offline-first / mock data). |
| **Ícones / Recursos** | **Bootstrap Icons (Local) ou SVG** | Arquivos locais de fontes/SVGs para garantir funcionamento sem internet externa. |

---

## 2. Princípios e Regras Mandatórias de Desenvolvimento

### 2.1. Regra de Ouro: Vanilla Web Only
- **Proibido o uso de frameworks de componentes**: NADA de React, Vue, Angular, Preact ou Svelte.
- **Proibido o uso de transpiladores pesados**: O código JS e CSS escrito deve ser interpretável diretamente pelos navegadores modernos.
- **Independência de CDN**: Todos os arquivos de bibliotecas de terceiros (Bootstrap CSS, Bootstrap JS Bundle, ícones) devem ser mantidos nas pastas do repositório local (ex: `assets/vendor/` ou `assets/css/` e `assets/js/`).

### 2.2. Arquitetura de Persistência via `localStorage`
Toda a dinâmica da aplicação (cadastro de clientes, login, catálogo de botijões, carrinho, criação e acompanhamento de pedidos) operará com base no `localStorage` do navegador:

1. **Camada de Abstração Obrigatória (`StorageService` / Data Layer):**
   - Nunca chame `localStorage.setItem()` ou `localStorage.getItem()` diretamente nos componentes de UI ou manipuladores de eventos de páginas.
   - Crie módulos ou serviços dedicados para cada entidade (ex: `authService.js`, `orderService.js`, `productService.js`, `storage.js`).
   - Todos os dados salvos devem ser serializados em JSON (`JSON.stringify`) e validados na leitura (`JSON.parse` com tratamento de `try/catch`).

2. **Namespacing de Chaves:**
   - Para evitar colisões no navegador, todas as chaves no `localStorage` devem utilizar o prefixo `gasfacil_` ou `gf_`:
     - `gf_users`: Coleção de utilizadores registados.
     - `gf_session`: Dados do utilizador logado no momento (token fictício, id, perfil).
     - `gf_products`: Catálogo com tipos de botijão, preços, recargas e vasilhames novos.
     - `gf_orders`: Lista de pedidos realizados, contendo histórico e status.
     - `gf_addresses`: Endereços salvos por utilizador.
     - `gf_settings`: Configurações do sistema (ex: bairros atendidos, taxa de entrega base).

3. **Inicialização Automática (Seed / Mock Data):**
   - A aplicação deve conter um script de inicialização (`seedData.js` ou rotina no `storage.js`) que verifica se as chaves existem no `localStorage`. Caso estejam vazias, deve popular automaticamente com dados de exemplo (ex: catálogo inicial de botijões de 13kg e 45kg, utilizador administrador de teste e áreas de atendimento).

4. **Preparação para Futura API:**
   - As funções dos serviços devem simular comportamento assíncrono (retornando `Promise.resolve()` ou usando `async/await`), facilitando uma migração futura para backend real (Node.js, Python, PHP, etc.) sem refatorar a interface.

---

## 3. Estrutura de Diretórios Recomendada

A aplicação deve manter uma organização modular, limpa e intuitiva:

```text
Gas-Facil/
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css        # Bootstrap local
│   │   ├── styles.css               # Estilos globais e identidade visual
│   │   └── components.css           # Estilos de cards, timeline, badges
│   ├── js/
│   │   ├── vendor/
│   │   │   └── bootstrap.bundle.min.js  # Bootstrap JS local (com Popper)
│   │   ├── services/
│   │   │   ├── storage.js           # Gerenciador central de localStorage (CRUD genérico)
│   │   │   ├── seedData.js          # Carga de dados iniciais (produtos, configs)
│   │   │   ├── authService.js       # Registro, login, logout e sessão
│   │   │   ├── productService.js    # Consulta de produtos/botijões
│   │   │   ├── orderService.js      # Criação, busca e atualização de pedidos
│   │   │   └── loyaltyService.js   # Motor de pontos e regras do "Gás Bazou" (Kilape)
│   │   ├── utils/
│   │   │   ├── formatters.js        # Moeda (Kz / R$), datas, telefones
│   │   │   ├── validators.js        # Validação de formulários e campos
│   │   │   └── alerts.js            # Notificações e toasts visuais
│   │   └── pages/
│   │       ├── home.js              # Interações da Landing Page
│   │       ├── auth.js              # Lógica de telas de login e registo
│   │       ├── checkout.js          # Fluxo do pedido
│   │       ├── tracking.js          # Timeline de rastreamento do pedido
│   │       ├── history.js           # Histórico de pedidos
│   │       └── admin.js             # Painel básico de gestão de pedidos
│   ├── images/
│   │   ├── logo.svg
│   │   ├── products/                # Imagens de botijões (13kg, 45kg, etc.)
│   │   └── icons/                   # Ícones locais em SVG
│   └── fonts/                       # Fontes locais (se aplicável)
├── index.html                       # Landing Page pública com catálogo
├── login.html                       # Tela de autenticação
├── register.html                    # Tela de cadastro de clientes
├── checkout.html                    # Seleção de botijão, endereço e pagamento
├── tracking.html                    # Rastreamento do pedido em tempo real
├── history.html                     # Histórico de pedidos do cliente
├── admin.html                       # Painel administrativo de controle de pedidos
├── product-vision.md                # Visão e requisitos do produto
├── Stacks.md                        # Este documento de especificações técnicas
└── README.md                        # Documentação de execução do projeto
```

---

## 4. Padrões de Código e Boas Práticas

### 4.1. HTML & Acessibilidade
- Utilize tags semânticas para todas as seções.
- Formulários devem possuir atributos `required`, `type` corretos (`email`, `tel`, `password`), `autocomplete` e labels associados por `for`/`id`.
- Suporte a acessibilidade: uso de `aria-label`, `role` e estados dinâmicos (ex: `aria-expanded`).

### 4.2. CSS & Bootstrap
- Respeite a metodologia **Mobile-First**: use as classes de grid e breakpoints do Bootstrap (`col-12`, `col-md-6`, `col-lg-4`).
- Variáveis CSS personalizadas para a paleta de cores (ex: cor primária de gás/energia, cores de status: Recebido, Em Rota, Entregue).
- Mantenha classes utilitárias do Bootstrap para espaçamentos (`p-*`, `m-*`, `d-flex`, `gap-*`), evitando reinvenção de estilos básicos.

### 4.3. JavaScript
- **Modularidade:** Prefira ES Modules (`<script type="module" src="...">`) ou organização por objetos/namespaces seguros.
- **Manipulação do DOM Segura:**
  - Evite `innerHTML` com interpolação direta de dados vindos do utilizador para prevenir vulnerabilidades de Cross-Site Scripting (XSS).
  - Use `element.textContent`, `element.setAttribute()`, ou funções auxiliares de sanitização ao gerar elementos dinâmicos.
- **Tratamento de Erros:** Todas as operações que leem ou gravam no `localStorage` devem prever cenários como limite de quota excedido (`QuotaExceededError`) ou JSON mal formatado.

---

## 5. Modelo de Dados no `localStorage` (Schema Reference)

### 5.1. Utilizadores (`gf_users`)
```json
[
  {
    "id": "usr_001",
    "name": "Maria Silva",
    "email": "maria@exemplo.com",
    "phone": "+244 923 000 000",
    "password": "hash_ou_senha_simulada",
    "role": "customer",
    "addresses": [
      {
        "id": "addr_01",
        "title": "Casa",
        "street": "Rua Principal, 123",
        "neighborhood": "Centro",
        "city": "Luanda",
        "reference": "Próximo à padaria"
      }
    ],
    "loyalty": {
      "points": 350,
      "tier": "Prata",
      "kilapeEligible": true,
      "activeKilape": false
    },
    "createdAt": "2026-11-25T10:00:00Z"
  }
]
```

### 5.2. Produtos (`gf_products`)
```json
[
  {
    "id": "prod_gas_13kg",
    "name": "Botijão de Gás Butano 13kg",
    "description": "Ideal para residências e uso doméstico diário.",
    "weight": "13kg",
    "refillPrice": 3500.00,
    "completePrice": 18000.00,
    "image": "assets/images/products/gas-13kg.png",
    "available": true
  }
]
```

### 5.3. Pedidos (`gf_orders`)
```json
[
  {
    "id": "ord_1001",
    "userId": "usr_001",
    "customerName": "Maria Silva",
    "customerPhone": "+244 923 000 000",
    "items": [
      {
        "productId": "prod_gas_13kg",
        "name": "Botijão de Gás Butano 13kg (Recarga)",
        "quantity": 1,
        "unitPrice": 3500.00,
        "type": "refill"
      }
    ],
    "deliveryAddress": {
      "street": "Rua Principal, 123",
      "neighborhood": "Centro",
      "city": "Luanda",
      "reference": "Próximo à padaria"
    },
    "deliveryFee": 500.00,
    "totalAmount": 4000.00,
    "paymentMethod": "gas_bazou_kilape",
    "kilapeDetails": {
      "isKilape": true,
      "dueDate": "2026-12-10T23:59:59Z",
      "isSettled": false,
      "settledAt": null
    },
    "status": "in_transit",
    "statusHistory": [
      { "status": "received", "timestamp": "2026-11-25T10:15:00Z" },
      { "status": "preparing", "timestamp": "2026-11-25T10:20:00Z" },
      { "status": "in_transit", "timestamp": "2026-11-25T10:35:00Z" }
    ],
    "createdAt": "2026-11-25T10:15:00Z",
    "updatedAt": "2026-11-25T10:35:00Z"
  }
]
```

---

## 6. Fluxos de Estados do Pedido (Timeline Status)

Ao gerenciar pedidos, o agente deve respeitar a máquina de estados estrita:

```text
[ Recebido ] ───► [ Em Preparação ] ───► [ Em Rota / A Caminho ] ───► [ Entregue ]
      │                   │                         │
      └───────────────────┴─────────────────────────┴───────────────► [ Cancelado ]
```

1. **`received`**: Pedido registrado pelo cliente no checkout.
2. **`preparing`**: O entregador/distribuidora separou o botijão e preparou a saída.
3. **`in_transit`**: Entregador em trânsito até o endereço do cliente.
4. **`delivered`**: Botijão entregue e pagamento liquidado.
5. **`cancelled`**: Pedido cancelado pelo cliente ou pelo suporte antes da entrega.

---

## 7. Instruções Diretas para o Agente de IA ao Gerar Código

1. **Sempre verificar caminhos relativos:** Ao linkar arquivos HTML, CSS ou JS, certifique-se de usar caminhos relativos consistentes (`./assets/css/...` ou `assets/js/...`).
2. **Não inventar dependências NPM:** Não crie arquivos `package.json` com dependências de build que forcem o desenvolvedor a rodar `npm install` ou `npm run build` para visualizar a aplicação. O site deve abrir com duplo clique no `index.html` ou com `Live Server`.
3. **Reutilização de Layouts:** Crie componentes visuais consistentes (Navbar com estado de usuário logado/deslogado, Rodapé, Modais de confirmação) e mantenha o mesmo padrão em todas as páginas.
4. **Respeitar os requisitos da Visão de Produto:** Mantenha alinhamento absoluto com o arquivo [product-vision.md](file:///c:/Users/master/Documents/DEVELOPMENT/ASOFTMEDIA%20-%20PROJECTS/GAS-FACIL/Gas-Facil/product-vision.md).
