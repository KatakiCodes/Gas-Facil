# Documento de System Design & Design System

## Gás-Fácil — Identidade Visual, Design Tokens e Padrão de Estilos de Elementos

---

### 1. Visão Geral da Arquitetura Visual (White-Label Dinâmico)

O **Gás-Fácil** adota uma arquitetura de design baseada em **White-Label dinâmico e tematizável**, inspirada nas cores das principais botijas e marcas de gás butano presentes no mercado de Angola:

- **Azul (Padrão / Sonangol Gás)**: Cor institucional de referência no país.
- **Verde Escuro (PumanGás / Pumangol)**: Identidade corporativa de combustíveis e distribuição ecológica.
- **Laranja (TotalEnergies / Distribuidoras Parceiras)**: Alta visibilidade, dinamismo e energia.
- **Amarela (Vasilhames Amarelos / Galp / Marcas Regionais)**: Proximidade, calor e atenção.

> **Regra de Negócio & Interatividade:**  
> O utilizador tem a liberdade de alternar o tema cromático diretamente:
>
> 1. Na **Landing Page** (através de um seletor visual na barra de navegação/header ou rodapé).
> 2. No **Painel do Utilizador / Dashboard** (em _Definições de Aparência / Preferências_).
>
> A escolha é persistida localmente (`localStorage.getItem('gf_theme')`) e sincronizada com o perfil do utilizador quando autenticado.

---

### 2. Design Tokens & Paletas Temáticas

O sistema utiliza **CSS Custom Properties (Variáveis CSS)** no escopo `:root` com seletores de atributo `[data-theme="nome-do-tema"]`. Isso permite troca instantânea de tema em tempo real sem recarregar a página.

#### 2.1. Tabela de Cores das Botijas (Temas Principais)

| Tema              | Identificador    | Cor Primária (`--color-primary`)    | Hover / Foco (`--color-primary-hover`) | Fundo Suave (`--color-primary-subtle`) | Contraste de Texto |
| :---------------- | :--------------- | :---------------------------------- | :------------------------------------- | :------------------------------------- | :----------------- |
| **Azul (Padrão)** | `blue` (default) | `#0B5ED7`                           | `#084298`                              | `#E7F1FF`                              | `#FFFFFF`          |
| **Verde Escuro**  | `green`          | `#0A6C38`                           | `#074D28`                              | `#E8F5EE`                              | `#FFFFFF`          |
| **Laranja**       | `orange`         | `#E65100`                           | `#BF360C`                              | `#FFF3E0`                              | `#FFFFFF`          |
| **Amarela**       | `yellow`         | `#D98200` _(ajustado p/ contraste)_ | `#B36B00`                              | `#FFF8E1`                              | `#FFFFFF`          |

_(Nota de Acessibilidade: O tema amarelo utiliza um tom dourado/âmbar escuro para garantir conformidade mínima com a norma WCAG AA de contraste 4.5:1 contra fundos brancos)._

---

### 3. Implementação Técnica dos Tokens (CSS Custom Properties)

```css
/* ==========================================================================
   THEME TOKENS - GÁS-FÁCIL
   ========================================================================== */

:root,
[data-theme="blue"] {
  --color-primary: #0b5ed7;
  --color-primary-hover: #084298;
  --color-primary-active: #052c65;
  --color-primary-subtle: #e7f1ff;
  --color-primary-foreground: #ffffff;
  --color-primary-border: #9ec5fe;
  --theme-brand-name: "Azul Sonangol";
}

[data-theme="green"] {
  --color-primary: #0a6c38;
  --color-primary-hover: #074d28;
  --color-primary-active: #04361c;
  --color-primary-subtle: #e8f5ee;
  --color-primary-foreground: #ffffff;
  --color-primary-border: #a3cfbb;
  --theme-brand-name: "Verde PumanGás";
}

[data-theme="orange"] {
  --color-primary: #e65100;
  --color-primary-hover: #bf360c;
  --color-primary-active: #8c2607;
  --color-primary-subtle: #fff3e0;
  --color-primary-foreground: #ffffff;
  --color-primary-border: #ffcc80;
  --theme-brand-name: "Laranja Total";
}

[data-theme="yellow"] {
  --color-primary: #d98200;
  --color-primary-hover: #b36b00;
  --color-primary-active: #804d00;
  --color-primary-subtle: #fff8e1;
  --color-primary-foreground: #ffffff;
  --color-primary-border: #ffe082;
  --theme-brand-name: "Amarela Galp/Regional";
}

/* ==========================================================================
   NEUTRAL COLORS (Comuns a todos os temas)
   ========================================================================== */
:root {
  --color-bg-base: #f8fafc; /* Fundo padrão das telas */
  --color-bg-surface: #ffffff; /* Fundo de cards, tabelas e modais */
  --color-bg-muted: #f1f5f9; /* Fundo de inputs inativos e cabeçalhos */

  --color-text-main: #0f172a; /* Texto de alto contraste / Títulos */
  --color-text-body: #334155; /* Texto de corpo de página */
  --color-text-muted: #64748b; /* Texto secundário / legendas */
  --color-text-disabled: #94a3b8; /* Texto desabilitado */

  --color-border-base: #e2e8f0; /* Linhas divisórias e bordas de cards */
  --color-border-hover: #cbd5e1; /* Borda em estado hover */
  --color-border-focus: var(--color-primary);

  /* Feedback Semântico */
  --color-success: #16a34a;
  --color-success-bg: #dcfce7;
  --color-warning: #ea580c;
  --color-warning-bg: #ffedd5;
  --color-danger: #dc2626;
  --color-danger-bg: #fee2e2;
  --color-info: #0284c7;
  --color-info-bg: #e0f2fe;

  /* Tipografia */
  --font-family-base:
    "Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  --font-family-heading:
    "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;

  /* Espaçamento (Escala 4px/8px) */
  --spacing-1: 0.25rem; /* 4px */
  --spacing-2: 0.5rem; /* 8px */
  --spacing-3: 0.75rem; /* 12px */
  --spacing-4: 1rem; /* 16px */
  --spacing-5: 1.25rem; /* 20px */
  --spacing-6: 1.5rem; /* 24px */
  --spacing-8: 2rem; /* 32px */
  --spacing-12: 3rem; /* 48px */
  --spacing-16: 4rem; /* 64px */

  /* Raios de Borda (Border Radius) */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Sombras (Box Shadows do Bootstrap / Sutis) */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md:
    0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
  --shadow-lg:
    0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03);
  --shadow-subtle: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
}
```

---

### 4. Tipografia e Hierarquia de Texto

A tipografia recomendada é a **Plus Jakarta Sans** (ou **Inter** como fallback), por conferir clareza para números, tabelas e alta legibilidade em ecrãs móveis.

| Elemento               | Tamanho (px / rem)                                          | Peso (Weight)  | Altura de Linha (Line-height) | Aplicação                              |
| :--------------------- | :---------------------------------------------------------- | :------------- | :---------------------------- | :------------------------------------- |
| **Display / H1 Hero**  | `36px` / `2.25rem` (móvel) <br> `48px` / `3.0rem` (desktop) | Bold (700)     | 1.15                          | Título de impacto da Landing Page      |
| **H2 Section Heading** | `28px` / `1.75rem`                                          | SemiBold (600) | 1.25                          | Títulos de seções principais           |
| **H3 Card / Modal**    | `20px` / `1.25rem`                                          | SemiBold (600) | 1.35                          | Títulos de cards de produto e modais   |
| **Body (Principal)**   | `16px` / `1.0rem`                                           | Regular (400)  | 1.50                          | Texto corrido, descrições, formulários |
| **Body Small**         | `14px` / `0.875rem`                                         | Medium (500)   | 1.40                          | Metadados, instruções, labels de input |
| **Caption / Badge**    | `12px` / `0.75rem`                                          | SemiBold (600) | 1.30                          | Status de pedidos, tags de botija      |

---

### 5. Padrão de Estilos de Elementos e Componentes

Todos os componentes interativos do **Gás-Fácil** herdam a variável `--color-primary`, adaptando-se instantaneamente quando o utilizador muda a cor da botija/tema.

#### 5.1. Botões (Buttons)

- **Botão Primário (CTA Principal):**
  - Fundo: `var(--color-primary)`
  - Texto: `var(--color-primary-foreground)` (#ffffff)
  - Raio de Borda: `var(--radius-sm)` (8px)
  - Hover: `var(--color-primary-hover)` com transição sutil e sombra padrão do Bootstrap (`shadow-sm`).
- **Botão Secundário / Outline:**
  - Fundo: Transparente
  - Borda: 1.5px sólida `var(--color-primary)`
  - Texto: `var(--color-primary)`
  - Hover: `var(--color-primary-subtle)`
- **Botão Sutil / Ghost:**
  - Sem borda aparente. Fundo `var(--color-primary-subtle)` no hover.

#### 5.2. Campos de Formulário (Inputs, Selects, Checkboxes)

- **Estado Padrão:** Fundo `#FFFFFF`, borda `1px solid var(--color-border-base)`, raio `8px`, texto `#0F172A`.
- **Estado de Foco (Focus State):** Borda `2px solid var(--color-primary)` e anel de foco suave padrão Bootstrap `box-shadow: 0 0 0 0.25rem var(--color-primary-subtle)`.
- **Estado de Erro (Validation Error):** Borda `2px solid var(--color-danger)` e texto de apoio vermelho (`.is-invalid` / `.invalid-feedback`).

#### 5.3. Cards de Produtos e Vasilhames (Botijas)

- Estrutura com fundo branco, borda `1px solid var(--color-border-base)` e sombra suave `var(--shadow-sm)`.
- **Efeito de Seleção:** Quando o utilizador clica no botijão desejado (ex.: 13kg ou 45kg), o card recebe:
  - Borda ativa: `2px solid var(--color-primary)`
  - Badge de confirmação com a cor primária ativa.
  - Ilustração em vetor da botija na cor do tema selecionado.

#### 5.4. Badges de Estado do Pedido (Order Tracking Status)

O rastreamento de pedidos na aplicação utiliza o padrão semântico universal do Bootstrap 5 com ícones exclusivos do **Bootstrap Icons (`bi bi-*`)**:

| Status do Pedido | Cor de Fundo | Cor do Texto | Classe Bootstrap / Ícone Oficial |
| :--- | :--- | :--- | :--- |
| **Recebido** | `#E0F2FE` (Info sutil) | `#0369A1` | `<i class="bi bi-file-earmark-text me-1"></i>` |
| **Em Preparação** | `var(--color-primary-subtle)` | `var(--color-primary)` | `<i class="bi bi-hourglass-split me-1"></i>` |
| **A Caminho (Em Rota)** | `#FEF3C7` (Amarelo alerta) | `#B45309` | `<i class="bi bi-truck me-1"></i>` |
| **Entregue** | `#DCFCE7` (Verde sucesso) | `#15803D` | `<i class="bi bi-check-circle-fill me-1"></i>` |
| **Cancelado** | `#FEE2E2` (Vermelho) | `#B91C1C` | `<i class="bi bi-x-circle-fill me-1"></i>` |

---

### 6. Mecanismo do Seletor de Tema (Theme Switcher)

#### 6.1. Onde Fica Posicionado

1. **Landing Page:**
   - No topo (Header / Navbar), ao lado dos botões de Login/Cadastro, como um dropdown ou pílula seletora visual com 4 círculos coloridos:
     `Azul (Sonangol) | Verde (PumanGás) | Laranja (Total) | Amarela (Regional)`.
2. **Dashboard / Painel do Utilizador:**
   - No cabeçalho superior do painel e na aba de **Configurações > Preferências de Exibição**.

#### 6.2. Fluxo Lógico e Armazenamento (JavaScript ES6 Modular)

Arquivo: `assets/js/utils/themeSwitcher.js`

```javascript
/**
 * Módulo de Gestão de Temas das Botijas (White-Label Dinâmico)
 * Compatível 100% com Vanilla JavaScript ES6
 */

export const THEMES = [
  { id: 'blue', name: 'Azul', hex: '#0B5ED7', brand: 'Padrão Sonangol' },
  { id: 'green', name: 'Verde', hex: '#0A6C38', brand: 'PumanGás' },
  { id: 'orange', name: 'Laranja', hex: '#E65100', brand: 'Total' },
  { id: 'yellow', name: 'Amarela', hex: '#D98200', brand: 'Regional' }
];

const THEME_STORAGE_KEY = 'gf_theme';

/**
 * Aplica o tema visual no atributo data-theme do elemento raiz <html>
 * e salva a preferência no localStorage
 * @param {string} themeId - 'blue' | 'green' | 'orange' | 'yellow'
 */
export function applyTheme(themeId) {
  const validThemes = THEMES.map(t => t.id);
  const selectedTheme = validThemes.includes(themeId) ? themeId : 'blue';

  document.documentElement.setAttribute('data-theme', selectedTheme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
  } catch (error) {
    console.warn('Não foi possível persistir o tema no localStorage:', error);
  }
}

/**
 * Inicializa o tema salvo ou aplica o azul por defeito
 */
export function initTheme() {
  let savedTheme = 'blue';
  try {
    savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'blue';
  } catch (error) {
    console.warn('Erro ao ler tema do localStorage:', error);
  }
  applyTheme(savedTheme);
}
````

---

### 7. Responsividade e Layout

  O projeto adota estritamente o sistema de grid e os breakpoints padrão do **Bootstrap 5.3+**:

- **Grid do Sistema:** 12 colunas flexíveis com classes nativas (`container`, `row`, `col-*`) e espaçamento proporcional do Bootstrap (`g-3`, `g-4`).
- **Breakpoints Oficiais (Bootstrap 5):**
  - `sm`: `576px` (Smartphones em modo paisagem)
  - `md`: `768px` (Tablets / Dispositivos médios)
  - `lg`: `992px` (Laptops / Telas grandes)
  - `xl`: `1200px` (Desktops padrão)
  - `xxl`: `1400px` (Telas ultra-largas / Widescreen)
- **Mobile First:** Todo formulário de pedido, consulta de botija e tracking é dimensionado prioritariamente para operação em smartphones com alvos de toque adequados (mínimo de `44px x 44px`).
