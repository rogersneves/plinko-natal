# 🎄 Plinko de Natal 🎁

Um jogo Plinko interativo natalino desenvolvido com HTML5, CSS3 e JavaScript vanilla.

## 📋 Descrição

Plinko de Natal é um jogo em canvas que simula a queda de presentes (fichas) através de pinos, caindo em diferentes slots (chaminés) com valores variados. O objetivo é competir com seus colegas para obter a maior pontuação possível!

### Características

- 🎅 **Tema Natalino**: Fundo escuro com neve animada, chaminés e presentes
- 🎯 **5 Fichas por Rodada**: Começa com 5 presentes para soltar
- 💎 **Múltiplos Valores**: Cada slot tem um valor diferente (120, 60, 30, +1, 10, +1, 30, 60, 120)
- 🎁 **Bônus +1**: Slots especiais com valor "+1" que concedem uma jogada extra
- 📊 **Recorde Persistente**: Salva automaticamente a maior pontuação usando localStorage
- 👤 **Multiplayer**: Diferentes jogadores podem competir, com recorde global do navegador

## 🎮 Como Jogar

1. **Digite seu nome** no campo de entrada
2. **Clique em "Começar"** para iniciar o jogo
3. **Clique em "Soltar presente"** para lançar uma ficha
4. A ficha **quica nos pinos** e cai em um dos 7 slots
5. **Some os pontos** conforme os presentes caem
6. Quando as 5 fichas acabarem, seus pontos são contabilizados
7. Se bater o recorde, seu nome fica salvo!

## 🕹️ Mecânica do Jogo

### Slots (Chaminés) - da esquerda para direita
```
[120] [60] [30] [+1] [10] [+1] [30] [60] [120]
```

- **Valores numéricos**: Adiciona pontos ao seu total
- **Slots +1**: Ganha uma ficha extra para jogar novamente

### Física
- As fichas caem com gravidade realista
- Colidem com pinos e desviam aleatoriamente
- As bordas laterais causam reflexão
- Movimento suave e responsivo

## 🚀 Acesso Rápido

**[Jogue Agora! →](https://rogersneves.github.io/plinko-natal/)**

## 📦 Arquivos

- **index.html** - Estrutura HTML com canvas e interface
- **game.js** - Lógica completa do jogo (física, renderização, pontuação)
- **README.md** - Este arquivo

## 🛠️ Tecnologias

- **HTML5** - Canvas 2D para renderização
- **CSS3** - Estilos natalinos
- **JavaScript Vanilla** - Sem dependências externas
- **localStorage** - Persistência de recorde local

## 💡 Desenvolvimento

Desenvolvido para fins educacionais e de entretenimento corporativo. O código é totalmente standalone e pode ser deployado em qualquer servidor web estático.

## 📝 Notas

- O recorde é salvo **por navegador** (localStorage)
- Cada jogador pode usar um navegador diferente para manter recordes
- Sem necessidade de servidor backend
- Rápido e responsivo em todos os navegadores modernos

## 🎅 Feliz Natal!

Sinta-se livre para modificar, compartilhar e competir! Que tenha uma ótima experiência de jogo! 🎉✨
