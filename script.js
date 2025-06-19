// --- ELEMENTOS GLOBAIS ---
const telaInicial = document.querySelector('#tela-inicial');
const telaJogo = document.querySelector('#tela-jogo');
const telaRanking = document.querySelector('#tela-ranking');
const tabuleiro = document.querySelector('.tabuleiro-memoria');
const infoNivel = document.querySelector('#info-nivel');
const modal = document.querySelector('#modal-mensagem');
const modalTitulo = document.querySelector('#modal-titulo');
const modalTexto = document.querySelector('#modal-texto');
const inputNome = document.querySelector('#input-nome');
const btnIniciar = document.querySelector('#btn-iniciar');
const btnVerRanking = document.querySelector('#btn-ver-ranking');
const btnVoltar = document.querySelector('#btn-voltar');

// --- CONFIGURAÇÃO DAS FASES ---
const todasImagens = ['bailarina', 'sapatilha', 'laco', 'estrela', 'coroa', 'vestido', 'espelho', 'perfume'];
const fases = [
    { nivel: 1, pares: 4, colunas: 4, linhas: 2 },
    { nivel: 2, pares: 6, colunas: 4, linhas: 3 },
    { nivel: 3, pares: 8, colunas: 4, linhas: 4 }
];

// --- VARIÁVEIS DE ESTADO DO JOGO ---
let jogadorAtual = '';
let nivelAtual = 0;
let cartas = [];
let cartaFoiVirada = false;
let travarTabuleiro = false;
let primeiraCarta, segundaCarta;
let paresEncontrados = 0;

// --- FUNÇÕES DE GESTÃO DE TELAS ---
function mostrarTela(nomeTela) {
    // Esconde todas as telas
    telaInicial.classList.add('escondido');
    telaJogo.classList.add('escondido');
    telaRanking.classList.add('escondido');
    // Mostra a tela desejada
    document.querySelector(`#${nomeTela}`).classList.remove('escondido');
}

// --- FUNÇÕES DE GESTÃO DE JOGADOR E RANKING ---
function iniciarDesafio() {
    const nome = inputNome.value.trim();
    if (nome === '') {
        alert('Por favor, digite um nome para começar!');
        return;
    }

    // `localStorage` é uma "memória" do navegador que guarda dados mesmo depois de fechar a página.
    // Usamos `JSON.parse` para transformar o texto guardado de volta num array.
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];

    // Verificamos se o nome já existe no ranking
    const nomeExiste = ranking.some(jogador => jogador.nome.toLowerCase() === nome.toLowerCase());

    if (nomeExiste) {
        alert('Este nome já está no ranking. Por favor, escolha outro.');
    } else {
        jogadorAtual = nome;
        nivelAtual = 0;
        mostrarTela('tela-jogo');
        construirTabuleiro();
    }
}

// --- LÓGICA DO JOGO (a maior parte continua igual) ---
function construirTabuleiro() {
    tabuleiro.innerHTML = '';
    const configFase = fases[nivelAtual];
    paresEncontrados = 0;
    infoNivel.textContent = `Nível ${configFase.nivel}`;
    tabuleiro.style.setProperty('--colunas', configFase.colunas);
    tabuleiro.style.setProperty('--linhas', configFase.linhas);
    const imagensDaFase = todasImagens.slice(0, configFase.pares);
    const cartasParaJogo = [...imagensDaFase, ...imagensDaFase];
    cartasParaJogo.sort(() => Math.random() - 0.5);
    cartasParaJogo.forEach(nomeImagem => {
        const carta = document.createElement('div');
        carta.classList.add('carta-memoria');
        carta.dataset.personagem = nomeImagem;
        carta.innerHTML = `...`; // O conteúdo da carta continua igual
        carta.innerHTML = `
            <img class="frente-carta" src="imagens/${nomeImagem}.png" alt="${nomeImagem}">
            <img class="verso-carta" src="imagens/verso.png" alt="Verso da Carta">
        `;
        tabuleiro.appendChild(carta);
    });
    cartas = document.querySelectorAll('.carta-memoria');
    cartas.forEach(carta => carta.addEventListener('click', virarCarta));
}

// O resto das funções do jogo (virarCarta, verificarPar, etc.) continuam aqui...
// ... (COLE AQUI O RESTO DAS FUNÇÕES DO SCRIPT ANTERIOR, SEM MUDANÇAS) ...
function virarCarta() { if (travarTabuleiro || this.classList.contains('virar') || this === primeiraCarta) return; this.classList.add('virar'); if (!cartaFoiVirada) { cartaFoiVirada = true; primeiraCarta = this; } else { segundaCarta = this; travarTabuleiro = true; verificarPar(); } }
function verificarPar() { let ehPar = primeiraCarta.dataset.personagem === segundaCarta.dataset.personagem; ehPar ? processarParCorreto() : desvirarCartas(); }
function processarParCorreto() { primeiraCarta.classList.add('par-encontrado'); segundaCarta.classList.add('par-encontrado'); paresEncontrados++; destravarEResetarJogada(); if (paresEncontrados === fases[nivelAtual].pares) { setTimeout(() => { nivelAtual++; if (nivelAtual < fases.length) { mostrarMensagem(`Nível ${fases[nivelAtual-1].nivel} Completo!`, 'Prepare-se para o próximo desafio!'); setTimeout(() => { esconderMensagem(); construirTabuleiro(); }, 2500); } else { mostrarMensagem(`Parabéns, ${jogadorAtual}!`, 'Você completou todos os níveis!'); /* Adicionaremos o botão de reiniciar aqui na Fase 4 */ } }, 1000); } }
function desvirarCartas() { setTimeout(() => { primeiraCarta.classList.remove('virar'); segundaCarta.classList.remove('virar'); destravarEResetarJogada(); }, 1200); }
function destravarEResetarJogada() { [cartaFoiVirada, travarTabuleiro] = [false, false]; [primeiraCarta, segundaCarta] = [null, null]; }
function mostrarMensagem(titulo, texto) { modalTitulo.textContent = titulo; modalTexto.textContent = texto; modal.classList.add('visivel'); }
function esconderMensagem() { modal.classList.remove('visivel'); }


// --- EVENTOS DOS BOTÕES ---
btnIniciar.addEventListener('click', iniciarDesafio);
btnVerRanking.addEventListener('click', () => mostrarTela('tela-ranking'));
btnVoltar.addEventListener('click', () => mostrarTela('tela-inicial'));
