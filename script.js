// --- ELEMENTOS GLOBAIS ---
const telaInicial = document.querySelector('#tela-inicial');
const telaJogo = document.querySelector('#tela-jogo');
const telaRanking = document.querySelector('#tela-ranking');
const tabuleiro = document.querySelector('.tabuleiro-memoria');
const infoNivel = document.querySelector('#info-nivel');
const tempoDisplay = document.querySelector('#tempo');
const errosDisplay = document.querySelector('#erros');
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
let tentativasErradas = 0;
let segundosPassados = 0;
let pontuacaoTotal = 0;
let cronometroInterval = null;

// --- FUNÇÕES DE GESTÃO DE TELAS ---
function mostrarTela(nomeTela) {
    telaInicial.classList.add('escondido');
    telaJogo.classList.add('escondido');
    telaRanking.classList.add('escondido');
    document.querySelector(`#${nomeTela}`).classList.remove('escondido');
}

// --- FUNÇÕES DE GESTÃO DE JOGADOR E RANKING ---
function iniciarDesafio() {
    const nome = inputNome.value.trim();
    if (nome === '') {
        alert('Por favor, digite um nome para começar!');
        return;
    }
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const nomeExiste = ranking.some(jogador => jogador.nome.toLowerCase() === nome.toLowerCase());
    if (nomeExiste) {
        alert('Este nome já está no ranking. Por favor, escolha outro.');
    } else {
        jogadorAtual = nome;
        nivelAtual = 0;
        pontuacaoTotal = 0;
        mostrarTela('tela-jogo');
        construirTabuleiro();
    }
}

// --- LÓGICA DO CRONÓMETRO ---
function iniciarCronometro() {
    segundosPassados = 0;
    tempoDisplay.textContent = '0s';
    clearInterval(cronometroInterval);
    cronometroInterval = setInterval(() => {
        segundosPassados++;
        tempoDisplay.textContent = `${segundosPassados}s`;
    }, 1000);
}

// --- LÓGICA DO JOGO ---
function construirTabuleiro() {
    tabuleiro.innerHTML = '';
    const configFase = fases[nivelAtual];
    paresEncontrados = 0;
    tentativasErradas = 0;
    errosDisplay.textContent = 0;
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
        carta.innerHTML = `<img class="frente-carta" src="imagens/${nomeImagem}.png" alt="${nomeImagem}"><img class="verso-carta" src="imagens/verso.png" alt="Verso da Carta">`;
        tabuleiro.appendChild(carta);
    });
    cartas = document.querySelectorAll('.carta-memoria');
    cartas.forEach(carta => carta.addEventListener('click', virarCarta));
    iniciarCronometro();
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
    if (paresEncontrados === fases[nivelAtual].pares) {
        clearInterval(cronometroInterval);
        const PONTOS_BASE_NIVEL = 1000;
        const PENALIDADE_ERRO = 30;
        const PENALIDADE_TEMPO = 5;
        let pontuacaoNivel = PONTOS_BASE_NIVEL - (tentativasErradas * PENALIDADE_ERRO) - (segundosPassados * PENALIDADE_TEMPO);
        if (pontuacaoNivel < 100) pontuacaoNivel = 100;
        pontuacaoTotal += pontuacaoNivel;
        setTimeout(() => {
            nivelAtual++;
            if (nivelAtual < fases.length) {
                mostrarMensagem(`Nível ${fases[nivelAtual-1].nivel} Completo!`, `Você fez ${pontuacaoNivel} pontos.`);
                setTimeout(() => {
                    esconderMensagem();
                    construirTabuleiro();
                }, 2500);
            } else {
                mostrarMensagem(`Parabéns, ${jogadorAtual}!`, `Desafio concluído! Sua pontuação final foi: ${pontuacaoTotal} pontos.`);
            }
        }, 1000);
    }
}

function desvirarCartas() {
    tentativasErradas++;
    errosDisplay.textContent = tentativasErradas;
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

function mostrarMensagem(titulo, texto) {
    modalTitulo.textContent = titulo;
    modalTexto.textContent = texto;
    modal.classList.add('visivel');
}

function esconderMensagem() {
    modal.classList.remove('visivel');
}

// --- EVENTOS DOS BOTÕES ---
btnIniciar.addEventListener('click', iniciarDesafio);
btnVerRanking.addEventListener('click', () => mostrarTela('tela-ranking'));
btnVoltar.addEventListener('click', () => mostrarTela('tela-inicial'));
