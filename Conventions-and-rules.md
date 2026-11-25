# Convenções e Regras de Implementação e Estilo de UI (Conventions-and-rules.md)

Este documento reúne os padrões obrigatórios de design de interface (UI) e convenções de código que **todo agente de IA ou desenvolvedor** deve seguir rigorosamente no projeto **Gás-Fácil**.

---

## 1. Regras Mandatórias de Interface (UI) e Design System

Para garantir um visual sóbrio, profissional, crível e aderente à realidade do mercado, são estabelecidas as seguintes diretrizes inegociáveis:

### 1.1. Proibição de "Estética de IA" (Anti-AI Clichés)

Interfaces geradas por inteligência artificial frequentemente sofrem de vícios visuais genéricos que comprometem o profissionalismo da aplicação. Fica expressamente proibido:

1. **Nunca usar bordas tracejadas ou linhas pontilhadas decorativas:**
   - **Proibido:** `border-style: dashed;` ou `border-style: dotted;` em cards, divisórias, contêineres ou seções de fundo.
   - **Proibido:** Fundos geométricos compostos por malhas de pontos (*dot grids*) ou cruzes pontilhadas (*plus grids*).
   - **Padrão Obrigatório:** Use bordas sólidas sutis e nativas do Bootstrap (`border`, `border-secondary`, `border-opacity-25`) ou divisores limpos (`<hr class="my-4">`).

2. **Nunca usar setas decorativas, conectores de fluxo artificiais ou rabiscos:**
   - **Proibido:** Setas flutuantes curvas desenhadas, conectores pontilhados entre seções, ilustrações rabiscadas (*doodles*) ou elementos gráficos de "passo a passo" estilizados como fluxogramas de IA.
   - **Padrão Obrigatório:** Alinhamento horizontal ou vertical limpo utilizando o sistema de grid do Bootstrap (`row`, `col-*`) ou componentes estruturados nativos (como uma lista de etapas ou timeline com badges e bordas padrão).

3. **Não usar estilos de cards e efeitos exagerados típicos de geradores de IA:**
   - **Proibido Glassmorphism excessivo:** Evite cartões semi-transparentes sobrepostos com `backdrop-filter: blur(...)` espalhafatosos.
   - **Proibido Neomorfismo ou Glow Neon:** Não aplique sombras coloridas (`box-shadow: 0 0 20px rgba(0, 150, 255, 0.6)`), bordas iluminadas gradientes ou botões com reflexo plástico.
   - **Proibido Badges com bolinhas piscantes artificiais:** Evite o clichê de IA de colocar pequenas esferas verdes/azuis pulsantes em cada título ou botão.
   - **Padrão Obrigatório:** O visual dos cards deve ser o padrão clássico e elegante do Bootstrap 5: fundo branco ou neutro (`bg-white` ou `bg-body`), borda discreta (`border`), cantos arredondados equilibrados (`rounded-2` ou `rounded-3`) e sombras sutis pré-definidas (`shadow-sm` ou `shadow`).

---

### 1.2. Aderência Fiel ao Bootstrap 5

O projeto deve ser construído respeitando as fundações e a identidade nativa do **Bootstrap 5.3+**:

1. **Componentes Nativos em Primeiro Lugar:**
   - Toda estrutura de interface deve usar primariamente as classes oficiais do Bootstrap:
     - **Cards:** `.card`, `.card-body`, `.card-header`, `.card-footer`, `.card-title`, `.card-text`.
     - **Botões:** `.btn`, `.btn-primary`, `.btn-outline-primary`, `.btn-success`, `.btn-danger`, `.btn-sm`, `.btn-lg`.
     - **Badges:** `.badge bg-primary`, `.badge bg-success-subtle text-success-emphasis`.
     - **Alertas e Modais:** `.alert`, `.alert-info`, `.modal`, `.modal-dialog`, `.modal-content`.
     - **Tabelas e Listas:** `.table`, `.table-hover`, `.list-group`, `.list-group-item`.
     - **Formulários:** `.form-label`, `.form-control`, `.form-select`, `.form-check-input`.

2. **Grid & Responsividade Estrita:**
   - Sempre estruture o layout com `.container` (ou `.container-fluid`), `.row` e `.col-{breakpoint}-{tamanho}`.
   - Não use tamanhos fixos em pixels (`width: 450px`) para contêineres principais; utilize utilitários de largura e flexbox (`w-100`, `d-flex`, `flex-column`, `justify-content-between`, `align-items-center`).

3. **Cores e Identidade:**
   - Respeite as classes de tema do Bootstrap. Personalizações no CSS devem sobrescrever as variáveis CSS do Bootstrap (como `--bs-primary`, `--bs-primary-rgb`) e não desconstruir o funcionamento das classes utilitárias.

---

### 1.3. Regra de Ícones: Apenas Bootstrap Icons

1. **Biblioteca Exclusiva:**
   - **Apenas Bootstrap Icons (`bi bi-*`)** são permitidos na aplicação.
   - **Proibido:** FontAwesome, Lucide, Heroicons, Material Design Icons, Feather Icons ou pacotes externos misturados.
   - **Proibido:** Utilizar emojis soltos (como 🔥, 🚚, 📦, ⛽) como ícones oficiais de botões, cabeçalhos ou menus. Emojis transmitem aparência amadora.

2. **Sintaxe e Inclusão:**
   - Use a sintaxe clássica com tags `<i>` ou `<span>`:
     ```html
     <!-- Exemplo de entrega -->
     <i class="bi bi-truck me-2" aria-hidden="true"></i> A caminho
     
     <!-- Exemplo de segurança/pagamento -->
     <i class="bi bi-shield-check me-1" aria-hidden="true"></i> Pagamento Seguro
     
     <!-- Exemplo de botijão / gás -->
     <i class="bi bi-fuel-pump me-2" aria-hidden="true"></i> Recarga 13kg
     
     <!-- Exemplo da função Gás Bazou -->
     <i class="bi bi-clock-history me-1" aria-hidden="true"></i> Pagar até 15 dias
     ```
   - Utilize as fontes/SVGs do Bootstrap Icons baixados **localmente**, sem depender de CDNs online.

---

## 2. Convenções de Código e Implementação

### 2.1. Organização e Nomenclatura

| Elemento | Convenção | Exemplos |
| :--- | :--- | :--- |
| **Arquivos HTML** | `kebab-case.html` | `index.html`, `login.html`, `tracking.html` |
| **Arquivos CSS/JS** | `camelCase.js` ou `kebab-case.css` | `orderService.js`, `authService.js`, `styles.css` |
| **Classes CSS** | `kebab-case` | `gf-navbar`, `gf-timeline-step`, `gf-card-product` |
| **IDs de Elementos** | `camelCase` ou `kebab-case` semântico | `btnCheckout`, `orderStatusContainer`, `inputEmail` |
| **Variáveis e Funções JS** | `camelCase` | `getUserProfile()`, `calculateTotal()`, `currentSession` |
| **Constantes / Enums** | `UPPER_SNAKE_CASE` | `STORAGE_KEYS`, `ORDER_STATUS_RECEIVED`, `MAX_POINTS` |
| **Chaves no `localStorage`** | Prefixo `gf_` + `snake_case` | `gf_users`, `gf_orders`, `gf_session`, `gf_products` |

### 2.2. Padrões de HTML5 e Formulários
- Toda página deve possuir a declaração `<!DOCTYPE html>`, `<html lang="pt">` e as meta tags `<meta charset="UTF-8">` e `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
- Formulários devem utilizar o padrão de validação nativo do Bootstrap:
  ```html
  <form id="formCheckout" class="needs-validation" novalidate>
    <div class="mb-3">
      <label for="customerPhone" class="form-label">Telefone de Contacto</label>
      <input type="tel" class="form-control" id="customerPhone" required>
      <div class="invalid-feedback">
        Por favor informe um contacto telefónico válido.
      </div>
    </div>
    <button type="submit" class="btn btn-primary w-100">Confirmar Pedido</button>
  </form>
  ```

### 2.3. Padrões de JavaScript (Vanilla ES6+)
- **Isolamento de Escopo:** Não crie variáveis soltas no escopo global (`window`). Use módulos (`<script type="module">`) ou envolva o código em funções inicializadoras associadas ao evento `DOMContentLoaded`:
  ```javascript
  document.addEventListener('DOMContentLoaded', () => {
    // Inicialização da página
  });
  ```
- **Segurança contra XSS:**
  - Nunca insira strings vindas do utilizador diretamente no `innerHTML` sem sanitização prévia.
  - Prefira `element.textContent`, criação com `document.createElement()` ou utilitário de sanitização/escape:
  ```javascript
  // Seguro
  userNameSpan.textContent = user.name;
  ```
- **Modularização de Serviços:**
  - Cada entidade de negócio deve ter seu próprio serviço (ex.: `authService.js`, `orderService.js`, `loyaltyService.js`).
  - Funções de serviços devem retornar Promises para simular comportamento assíncrono e isolar completamente o acesso ao `localStorage`.

---

## 3. Resumo de Diretrizes para o Agente de IA (Checklist Rápido)

Antes de gerar qualquer tela ou componente, confirme:

- [ ] **Sem Tracejados/Pontilhados:** Não utilize bordas tracejadas ou fundos quadriculados/pontilhados de IA.
- [ ] **Sem Efeitos Neon/Glow:** Não utilize gradientes berrantes ou sombras luminosas.
- [ ] **Bootstrap Autêntico:** Utilizou classes `.card`, `.btn`, `.badge`, `.container`, `.row`, `.col-*` nativas?
- [ ] **Apenas Bootstrap Icons:** Todos os ícones são da classe `bi bi-*`? (Nenhum Lucide, FontAwesome ou emoji avulso).
- [ ] **Local e Sem CDN:** Os arquivos dependem apenas de recursos existentes na pasta local `assets/`?
- [ ] **Mobile-First:** O layout se adapta perfeitamente a ecrãs de smartphones e computadores?
- [ ] **Consistência de Negócio:** Atende aos requisitos do [product-vision.md](file:///c:/Users/master/Documents/DEVELOPMENT/ASOFTMEDIA%20-%20PROJECTS/GAS-FACIL/Gas-Facil/product-vision.md) e diretrizes do [Stacks.md](file:///c:/Users/master/Documents/DEVELOPMENT/ASOFTMEDIA%20-%20PROJECTS/GAS-FACIL/Gas-Facil/Stacks.md)?
