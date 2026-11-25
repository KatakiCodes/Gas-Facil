# Documentação da Landing Page (Landing-page.md)

Este documento descreve a estrutura de conteúdo, estratégia de conversão, componentes e filosofia adotada na **Landing Page pública** do projeto **Gás-Fácil** (`src/index.html`).

---

## 1. Filosofia e Referência de Mercado

A concepção da Landing Page baseia-se na filosofia de conveniência e agilidade de plataformas como a **Gás no Cúbico** (`gasnocubico.com`), adaptada à cultura e ao linguajar acolhedor de Angola:
- **Foco no "Cúbico" (Casa/Lar):** Eliminar a necessidade de o cliente sair de casa com vasilhame pesado de 13kg ou 45kg nos braços.
- **Transparência Absoluta de Preços:** Apresentação nítida dos preços oficiais de recarga em Kwanzas (Kz) e taxa de entrega calculada por zona.
- **Segurança Comprovada:** Destaque para vasilhames certificados, teste de fugas com espuma realizado pelo estafeta na entrega e pesagem aferida.

---

## 2. Destaque Central: O Diferencial "Gás Bazou" (Kilape Consciente)

O grande diferencial do **Gás-Fácil** frente aos concorrentes é evidenciado logo após a dobra inicial da Landing Page:

### 2.1. O Problema Real
Na concorrência e nos canais tradicionais, o modelo é estritamente pré-pago. Se o gás acaba ("bazou") no meio do preparo de uma refeição e o cliente não possui saldo ou dinheiro em mãos naquele momento, ele fica sem cozinhar.

### 2.2. A Solução Gás-Fácil
1. **Programa de Fidelidade Automático:** Cada pedido entregue e pago dentro do prazo acumula pontos na conta do utilizador.
2. **Desbloqueio do Kilape Emergencial:** Ao acumular 200 pontos (Nível Prata), o cliente desbloqueia a opção **"Gás Bazou"**.
3. **Entrega sem Pagamento Imediato:** O botijão é entregue de imediato no cúbico, com prazo de pagamento de até **1 mês (30 dias)** e taxa de **5% do valor como juros de demora**.
4. **Simulador Interativo:** A Landing Page inclui um simulador onde o visitante pode digitar pontos para testar a elegibilidade do benefício.

---

## 3. Seções da Landing Page (`src/index.html`)

| Seção | Objetivo de Conversão | Elementos Principais |
| :--- | :--- | :--- |
| **Header / Navbar** | Navegação rápida e personalização de marca. | Logo com ícone `bi-fuel-pump-fill`, seletor cromático com as 4 botijas (Azul, Verde, Laranja, Amarela) e botões "Entrar" e "Pedir Gás". |
| **Hero Section** | Captura de atenção imediata e proposta de valor. | Título de impacto, chamada para recarga imediata, benefícios rápidos (30 min, troca universal, dinheiro/TPA) e card visual da botija tematizável. |
| **Destaque do "Gás Bazou"** | Apresentação do diferencial competitivo frente à concorrência. | Comparativo visual (Concorrência vs Gás-Fácil) e simulador interativo de pontuação de fidelidade. |
| **Preçário Oficial** | Apresentação clara de preços e opções de compra. | Alternador "Apenas Recarga" vs "Botijão Novo Completo", cards dinâmicos para 13kg e 45kg com características e selos de conformidade. |
| **Como Funciona** | Redução de atrito na compra em 3 etapas lógicas. | 1. Escolha a sua Botija; 2. Indique a sua Morada; 3. Receba e Pague (ou Kilape). |
| **Zonas Atendidas** | Confirmação de cobertura em Luanda. | Campo de busca por bairro e cards das zonas ativas (Talatona, Maianga, Kilamba, Belas, etc.) com tempo médio estimado. |
| **FAQ (Perguntas Frequentes)** | Quebra de objeções do consumidor. | Accordion nativo Bootstrap com respostas sobre troca entre marcas, segurança e regras do Kilape. |
| **CTA Final & Rodapé** | Último incentivo para conversão e informações institucionais. | Chamada de urgência amigável, canais de apoio ao cliente de Luanda e direitos reservados. |

---

## 4. Conformidade com as Convenções do Projeto

- **Vanilla Web:** 100% implementada com HTML5, CSS3 e JavaScript Vanilla ES6 (sem frameworks SPA).
- **Recursos Locais:** Bootstrap 5.3.3 e Bootstrap Icons 1.11.3 servidos a partir de `src/assets/`.
- **Anti-AI Clichés:** Sem bordas tracejadas aleatórias, sem setas rabiscadas ou fundos pontilhados de IA.
- **Bootstrap 5 Puro:** Componentes padronizados (`.card`, `.btn`, `.badge`, `.alert`, `.accordion`).
