
# Jogo de Plataforma com JavaScript

Um jogo de plataforma 2D simples desenvolvido com JavaScript e HTML Canvas, onde o jogador deve atravessar um cenário em constante rolagem, pulando sobre plataformas e evitando cair em "buracos da morte", com o objetivo de alcançar o final do nível. O jogo apresenta mecânicas de movimento, física básica (gravidade), rolagem de paralaxe para o cenário e detecção de colisão.

---

## Versão 1.0 - Lançamento Inicial

Esta versão estabelece a base do jogo, introduzindo as mecânicas essenciais e os elementos visuais básicos para uma experiência jogável.

### Funcionalidades Implementadas:

- [x] **1. Configuração do Projeto:** Estrutura inicial do HTML e JavaScript.
- [x] **2. Criação do Jogador:** Implementação da entidade principal do jogo.
- [x] **3. Gravidade:** Física básica aplicada ao jogador para simular queda.
- [x] **4. Movimento do Jogador:** Controles de movimento horizontal do jogador.
- [x] **5. Plataformas:** Criação de superfícies para o jogador interagir.
- [x] **6. Rolagem do Cenário ("Scroll"):** Movimento horizontal do ambiente.
- [x] **7. Cenário de Vitória:** Condição para o jogador completar o nível.
- [x] **8. Plataformas com Imagens:** Utilização de sprites para as plataformas.
- [x] **9. Rolagem de Paralaxe:** Efeito visual de profundidade com diferentes velocidades de rolagem para o fundo.
- [x] **10. "Buracos da Morte":** Condição de derrota ao cair de uma plataforma.
- [x] **11. Criação de Níveis:** Definição manual do layout das plataformas.
- [x] **12. Ajustes Finos ("Fine-tuning"):** Otimizações e balanceamento da jogabilidade.
- [x] **13. Criação de Sprites:** Implementação de animações para o jogador.

---

## Versão 2.0 - Aprimoramentos e Geração Dinâmica

Esta versão foca na correção de bugs, melhorias na usabilidade e a introdução de geração procedural para aumentar a rejogabilidade e a complexidade do jogo.

### Metas para a Próxima Versão:

- [x] **1. Correção do Bug de Início:** Garantir que o jogo inicie corretamente, com todos os recursos (imagens, posições) carregados e renderizados antes do início da animação.
- [ ] **2. Correção do Bug do Pulo:** Implementar uma lógica para que o jogador só possa pular quando estiver em contato com uma plataforma, evitando pulos "no ar" indefinidos.
- [x] **3. Incremento da Navegação com Setas:** Adicionar suporte às setas direcionais do teclado (cima, baixo, esquerda, direita) como alternativa à navegação WASD.
- [ ] **4. Geração Procedural de Plataformas:** Desenvolver um sistema que crie plataformas dinamicamente em tempo de execução, em vez de pré-definidas, permitindo uma variedade infinita de níveis.
    - [ ] **Variação de Posição:** Randomização da distância e altura entre as plataformas.
    - [ ] **Tipos de Plataforma:** Introdução de diferentes larguras ou tipos de plataforma geradas aleatoriamente.
    - [ ] **Adaptação do Cenário:** Ajuste da rolagem do cenário para se adequar à geração dinâmica de plataformas.
- [ ] **5. Otimização de Desempenho (Plataformas):** Implementar um sistema para remover plataformas que já saíram da tela, gerenciando a memória e o desempenho do jogo.
- [ ] **6. Expansão de Objetos Genéricos:** Explorar a possibilidade de gerar outros elementos de cenário (montanhas, nuvens, etc.) de forma procedural, enriquecendo o ambiente visual.
