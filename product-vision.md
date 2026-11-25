# Documento de Visão de Produto (Product Vision)

## Gás-Fácil — Plataforma Web de Venda e Entrega de Gás Butano ao Domicílio

---

### 1. Declaração de Visão (Product Vision Statement)

> **Para** clientes residenciais e comerciais que necessitam de gás butano com rapidez e comodidade,  
> **que** enfrentam a frustração de canais manuais, falta de previsão na entrega e dificuldade no acompanhamento,  
> **o Gás-Fácil é** uma aplicação web moderna de compra e entrega de gás ao domicílio,  
> **que** oferece consulta simplificada via landing page, criação rápida de conta, agendamento de pedidos intuitivo e rastreamento em tempo real do estado da entrega.  
> **Diferentemente de** compras tradicionais por telefone, distribuidores informais ou aplicações concorrentes estritamente transacionais e pré-pagas,  
> **o nosso produto** centraliza toda a experiência com rastreamento digital transparente e traz como grande diferencial um **Programa de Fidelidade com a funcionalidade "Gás Bazou"**, que viabiliza o "Kilape" (crédito emergencial com data limite de pagamento) para clientes fiéis quando o gás acaba em momentos imprevistos.

---

### 2. Propósito e Proposta de Valor

O **Gás-Fácil** nasce para transformar a compra de botijões de gás num processo simples, confiável e digital. O cliente não precisa mais de fazer chamadas telefónicas demoradas ou aguardar sem saber quando o entregador chegará.

#### Pilares de Valor:
- **Praticidade e Agilidade:** Solicitação de gás em poucos cliques a partir de qualquer dispositivo (computador ou smartphone).
- **Transparência e Previsibilidade:** Visualização em tempo real de cada etapa do pedido (Recebido, Em preparação, Em rota, Entregue).
- **Controle e Organização:** Histórico de consumo centralizado com fácil reordenação de pedidos recorrentes.

#### Diferencial Competitivo em Relação aos Concorrentes:
Enquanto os canais tradicionais e aplicações concorrentes limitam-se a transações pontuais e estritamente pré-pagas (exigindo dinheiro ou TPA no ato da entrega), o **Gás-Fácil** compreende a realidade e os imprevistos do quotidiano doméstico e comercial:

- **Programa de Fidelidade Integrado:** Cada compra concluída e paga em dia acumula pontos de reputação e fidelidade na conta do cliente.
- **Funcionalidade "Gás Bazou" (O "Kilape" Emergencial):**
  - Em situações críticas em que o gás acaba de surpresa ("bazou") e o cliente não dispõe de liquidez imediata no momento, clientes fiéis com pontuação acumulada podem acionar a opção **"Gás Bazou"**.
  - Esta funcionalidade permite pedir o botijão a crédito (**Kilape**), recebendo o gás imediatamente em casa com uma **data limite estipulada para pagamento**.
  - O pagamento pontual do Kilape eleva a pontuação do cliente e amplia os seus benefícios futuros, criando um vínculo de confiança mútuo e retenção de longo prazo inigualável no mercado.

---

### 3. Público-Alvo e Segmentação

1. **Clientes Residenciais (B2C):**
   - Pessoas que gerenciam o lar e buscam conveniência, segurança e entrega rápida ao acabar o gás.
2. **Pequenos Negócios (B2B Leve):**
   - Restaurantes, lanchonetes e padarias com consumo frequente de gás butano que necessitam de previsibilidade e registo de compras.
3. **Visitantes Casuais:**
   - Utilizadores que acessam a landing page à procura de preços, tamanhos de botijões disponíveis (ex.: 13kg, 45kg) e áreas de cobertura antes de criarem uma conta.

---

### 4. Principais Funcionalidades e Módulos do Sistema

#### 4.1. Landing Page Pública (Área Aberta)
- Apresentação clara da proposta de valor, benefícios e promoções.
- Catálogo informativo de produtos (tipos de botijão de gás butano e acessórios).
- Consulta de área de atendimento / cobertura por CEP/região.
- Seção de Perguntas Frequentes (FAQ) e canais de suporte/contacto.
- Chamadas para ação (CTAs) estratégicas para cadastro e login.

#### 4.2. Gestão de Contas e Autenticação
- Cadastro rápido com validação de dados básicos (Nome, Email, Telefone, Senha).
- Autenticação segura (Login / Logout / Recuperação de Senha).
- Gestão de perfil com múltiplos endereços de entrega salvos (Casa, Trabalho, etc.).

#### 4.3. Realização de Pedidos (Checkout Simplificado)
- Seleção de botijão (com opção de recarga/troca de vasilhame ou compra de novo vasilhame).
- Seleção do endereço de entrega e indicação de instruções de entrega.
- Opções de entrega (imediata ou agendamento de horário).
- Escolha da forma de pagamento:
  - Pagamento na entrega: Dinheiro ou TPA / Cartão.
  - Pagamento digital / online.
  - **"Gás Bazou" (Kilape):** Disponível para clientes com pontuação de fidelidade suficiente, permitindo concluir o pedido sem pagamento imediato, gerando prazo com data limite de liquidação.
- Resumo claro antes da confirmação do pedido com cálculo de taxa de entrega e eventual prazo de vencimento do Kilape.

#### 4.4. Acompanhamento e Rastreamento de Pedidos (Order Tracking)
- Visualização do estado atual do pedido em linha do tempo (timeline):
  1. `Recebido / Confirmado`
  2. `Em Preparação`
  3. `A Caminho (Em Rota de Entrega)`
  4. `Entregue`
  5. `Cancelado`
- Notificações ou alertas visuais sobre atualizações de status.
- Para pedidos via "Gás Bazou", exibição em destaque da data de vencimento e opção de quitação do Kilape.

#### 4.5. Histórico e Gestão de Pedidos Anteriores
- Listagem detalhada de todos os pedidos já realizados com filtros por data e status.
- Acesso aos detalhes de cada compra (data, itens, valor, endereço, forma de pagamento, status de liquidação de Kilape).
- Botão de **"Pedir Novamente"** para recompra com 1 clique.

#### 4.6. Programa de Fidelidade e Módulo "Gás Bazou" (Kilape)
- **Motor de Pontuação (Score de Fidelidade):**
  - Atribuição de pontos a cada pedido concluído com sucesso e pago dentro do prazo.
  - Classificação por níveis de fidelidade (ex.: Bronze, Prata, Ouro).
- **Regras do "Gás Bazou" (Crédito Emergencial):**
  - Desbloqueio condicionado a pontuação mínima ou histórico positivo de compras anteriores.
  - Limite de 1 pedido ativo em Kilape por cliente (não é possível fazer novo Kilape com pendência em aberto).
  - Cálculo e fixação da data limite de pagamento (ex.: 7, 15 ou até 30 dias).
  - Notificações preventivas de aproximação da data limite de liquidação.
  - Recompensa de pontos bônus após pagamento pontual do Kilape, incentivando a adimplência.

---

### 5. Jornada do Utilizador (User Journey)

```
[Descoberta]           [Entrada]              [Compra]                 [Acompanhamento]         [Conclusão/Pós-venda]
Landing Page  ───►  Criar Conta / Login  ───►  Escolher Gás e Endereço ───►  Visualizar Status ───►  Receber Botijão
(Consulta Preços)    (Dados & Endereço)        (Confirmar Pedido)           (Linha do Tempo)          (Histórico Salvo)
```

1. **Descoberta:** O utilizador acessa o site, valida a cobertura e consulta os preços dos botijões.
2. **Entrada:** Realiza o registo ou login para iniciar a compra.
3. **Compra:** Seleciona o tipo de gás, endereço salvo e forma de pagamento (Dinheiro, TPA ou a opção emergencial **"Gás Bazou" - Kilape** se tiver pontuação de fidelidade elegível).
4. **Acompanhamento:** Acompanha em tempo real o avanço do status do pedido até a entrega.
5. **Pós-Venda:** Consulta o histórico, emite recibo/comprovativo, acumula pontos de fidelidade (ou efetua a quitação do Kilape até à data limite) e tem facilidade de recompra quando o gás voltar a acabar.

---

### 6. Requisitos Não-Funcionais e Diretrizes Técnicas

- **Design Responsivo (Mobile-First):** Mais de 70% dos acessos a serviços de delivery ocorrem via telemóvel/smartphone.
- **Performance e Carregamento Rápido:** Landing page otimizada com baixo tempo de carregamento para conversão rápida.
- **Segurança da Informação:** Proteção de dados pessoais, senhas criptografadas e conformidade com boas práticas de privacidade.
- **Disponibilidade e Resiliência:** Arquitetura estável para suportar horários de pico (finais de tarde e fins de semana).

---

### 7. Critérios de Sucesso e KPIs (Key Performance Indicators)

| Indicador | Objetivo |
| :--- | :--- |
| **Taxa de Conversão da Landing Page** | Transformar visitantes em contas criadas e pedidos concluídos. |
| **Tempo Médio de Atendimento/Entrega** | Reduzir o tempo entre confirmação e entrega final. |
| **Taxa de Recompra e Retenção (Loyalty)** | Clientes que voltam a pedir gás na plataforma após 30 a 60 dias estimulados pelos pontos. |
| **Adesão e Adimplência do "Gás Bazou"** | Clientes fiéis utilizando o Kilape consciente com liquidação de pagamento 100% dentro do prazo estipulado. |
| **Índice de Satisfação (CSAT / NPS)** | Avaliação positiva da facilidade de navegação, pontualidade da entrega e apoio em momentos de emergência. |

---

### 8. Roadmap de Evolução do Produto

- **Fase 1 (MVP - Escopo Atual):**
  - Landing Page informativa com catálogo de preços e áreas atendidas.
  - Autenticação de clientes (registo, login e gestão de endereços).
  - Fluxo de novo pedido com pagamento na entrega e modalidade **"Gás Bazou" (Kilape simulado no localStorage com data limite)** para clientes com score positivo.
  - Motor básico de pontuação de fidelidade (acumulação de pontos por pedido concluído).
  - Painel do cliente com histórico, saldo de pontos de fidelidade e rastreador de status do pedido.
  - Painel administrativo básico para gestão de pedidos, atualização de status e controle de liquidação de Kilapes.

- **Fase 2 (Próximos Passos):**
  - Integração de pagamentos online automatizados (Gateway / Cartão / Multicaixa Express / PIX) com quitação direta do Kilape no painel.
  - Notificações automáticas via SMS / WhatsApp ao atualizar o status do pedido e lembretes amigáveis da data limite do "Gás Bazou".
  - Aplicação dedicada ou interface web otimizada para os motoristas/entregadores.

- **Fase 3 (Expansão):**
  - Programa avançado de níveis de fidelidade (resgate de recargas gratuitas, descontos e brindes).
  - Assinatura programada de gás (previsão de reposição inteligente baseada na média de consumo).
