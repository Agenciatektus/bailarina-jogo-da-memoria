// --- ELEMENTOS DA PÁGINA ---
const tabuleiro = document.querySelector('.tabuleiro-memoria');
const infoNivel = document.querySelector('#info-nivel');
const modal = document.querySelector('#modal-mensagem');
const modalTitulo = document.querySelector('#modal-titulo');
const modalTexto = document.querySelector('#modal-texto');

// --- CONFIGURAÇÃO DAS FASES ---
const todasImagens = ['bailarina', 'sapatilha', 'laco', 'estrela', 'coroa', 'vestido', 'espelho', 'perfume'];
const fases = [
    { nivel: 1, pares: 4, colunas: 4, linhas: 2 }, // 8 cartas
    { nivel: 2, pares: 6, colunas: 4, linhas: 3 }, // 12 cartas
    { nivel: 3, pares: 8, colunas: 4, linhas: 4 }  // 16 cartas
];

// --- VARIÁVEIS DE ESTADO DO JOGO ---
let nivelAtual = 0;
let cartas = []; // O array de cartas agora é dinâmico
let cartaFoiVirada = false;
let travarTabuleiro = false;
let primeiraCarta, segundaCarta;
let paresEncontrados = 0;

// --- FUNÇÕES DO JOGO ---

function mostrarMensagem(titulo, texto) {
    modalTitulo.textContent = titulo;
    modalTexto.textContent = texto;
    modal.classList.add('visivel');
}

function esconderMensagem() {
    modal.classList.remove('visivel');
}

function embaralhar(array) {
    array.sort(() => Math.random() - 0.5);
}

function construirTabuleiro() {
    // Limpa o tabuleiro anterior
    tabuleiro.innerHTML = '';
    
    // Pega a configuração da fase atual
    const configFase = fases[nivelAtual];
    paresEncontrados = 0;
    infoNivel.textContent = `Nível ${configFase.nivel}`;

    // Define o layout da grelha via variáveis CSS
    tabuleiro.style.setProperty('--colunas', configFase.colunas);
    tabuleiro.style.setProperty('--linhas', configFase.linhas);

    // Cria a lista de imagens para a fase atual
    const imagensDaFase = todasImagens.slice(0, configFase.pares);
    const cartasParaJogo = [...imagensDaFase, ...imagensDaFase]; // Duplica para formar os pares
    
    embaralhar(cartasParaJogo);

    // Cria os elementos de carta e os adiciona ao tabuleiro
    cartasParaJogo.forEach(nomeImagem => {
        const carta = document.createElement('div');
        carta.classList.add('carta-memoria');
        carta.dataset.personagem = nomeImagem;

        carta.innerHTML = `
            <img class="frente-carta" src="imagens/${nomeImagem}.png" alt="${nomeImagem}">
            <img class="verso-carta" src="imagens/verso.png" alt="Verso da Carta">
        `;
        tabuleiro.appendChild(carta);
    });

    // Adiciona os ouvintes de clique às novas cartas
    cartas = document.querySelectorAll('.carta-memoria');
    cartas.forEach(carta => carta.addEventListener('click', virarCarta));
}

function virarCarta() {
    if (travarTabuleiro || this.classList.contains('virar') || this === primeiraCarta) return;
    this.classList.add('virar');
    if (!cartaFoiVirada) {
        cartaFoiVirada = true;
        primeiraCarta = this;
    } else {
        segundaCarta = this;
        travarTabuleiro = true;
        verificarPar();
    }
}

function verificarPar() {
    let ehPar = primeiraCarta.dataset.personagem === segundaCarta.dataset.personagem;
    ehPar ? processarParCorreto() : desvirarCartas();
}

function processarParCorreto() {
    primeiraCarta.classList.add('par-encontrado');
    segundaCarta.classList.add('par-encontrado');
    paresEncontrados++;
    destravarEResetarJogada();

    // Verifica se a fase terminou
    if (paresEncontrados === fases[nivelAtual].pares) {
        setTimeout(() => {
            nivelAtual++;
            // Verifica se há uma próxima fase
            if (nivelAtual < fases.length) {
                mostrarMensagem(`Nível ${fases[nivelAtual-1].nivel} Completo!`, 'Prepare-se para o próximo desafio!');
                setTimeout(() => {
                    esconderMensagem();
                    construirTabuleiro();
                }, 2500);
            } else {
                // Se não houver mais fases, o jogo terminou!
                mostrarMensagem('Parabéns!', 'Você completou todos os níveis!');
            }
        }, 1000);
    }
}

function desvirarCartas() {
    setTimeout(() => {
        primeiraCarta.classList.remove('virar');
        segundaCarta.classList.remove('virar');
        destravarEResetarJogada();
    }, 1200);
}

function destravarEResetarJogada() {
    [cartaFoiVirada, travarTabuleiro] = [false, false];
    [primeiraCarta, segundaCarta] = [null, null];
}

// --- INICIA O JOGO ---
// Nota: Certifique-se de ter imagens para todos os personagens listados em 'todasImagens'.
// Adicione 'espelho.png' e 'perfume.png' à sua pasta 'imagens' para a fase 3.
construirTabuleiro();
