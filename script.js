// --- ELEMENTOS GLOBAIS ---
const telaInicial = document.querySelector('#tela-inicial');
const telaJogo = document.querySelector('#tela-jogo');
const telaRanking = document.querySelector('#tela-ranking');
const listaRanking = document.querySelector('#lista-ranking');
const tabuleiro = document.querySelector('.tabuleiro-memoria');
const infoNivel = document.querySelector('#info-nivel');
const tempoDisplay = document.querySelector('#tempo');
const errosDisplay = document.querySelector('#erros');
const modal = document.querySelector('#modal-mensagem');
const modalTitulo = document.querySelector('#modal-titulo');
const modalTexto = document.querySelector('#modal-texto');
const modalBotoes = document.querySelector('#modal-botoes');
const inputNome = document.querySelector('#input-nome');
const btnIniciar = document.querySelector('#btn-iniciar');
const btnVerRanking = document.querySelector('#btn-ver-ranking');
const btnVoltar = document.querySelector('#btn-voltar');

// --- CONFIGURAÇÃO ---
const todasImagens = ['bailarina', 'sapatilha', 'laco', 'coroa', 'elza-frozen', 'ana-frozen', 'olaf-2', 'moana', 'sonic-e-tales', 'stitch', 'tales', 'knokles', 'estrela', 'frozen-final_1', 'stitch-mordendo', 'shadow', 'vestido'];
const fases = [
    { nivel: 1, pares: 3, colunas: 3, linhas: 2 },
    { nivel: 2, pares: 6, colunas: 4, linhas: 3 },
    { nivel: 3, pares: 8, colunas: 4, linhas: 4 },
    { nivel: 4, pares: 10, colunas: 5, linhas: 4 },
    { nivel: 5, pares: 12, colunas: 6, linhas: 4 }
];

// --- ESTADO DO JOGO ---
let jogadorAtual = '', nivelAtual = 0, pontuacaoTotal = 0, estrelasTotal = 0;
let cartas = [], cartaFoiVirada = false, travarTabuleiro = false, primeiraCarta, segundaCarta, paresEncontrados = 0, tentativasErradas = 0, segundosPassados = 0, cronometroInterval = null;

// --- GESTÃO DE TELAS ---
function mostrarTela(nomeTela) {
    telaInicial.classList.add('escondido');
    telaJogo.classList.add('escondido');
    telaRanking.classList.add('escondido');
    document.querySelector(`#${nomeTela}`).classList.remove('escondido');
}

// --- GESTÃO DE JOGADOR E RANKING ---
function iniciarDesafio() {
    const nome = inputNome.value.trim();
    if (nome === '') { alert('Por favor, digite um nome para começar!'); return; }
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const nomeExiste = ranking.some(jogador => jogador.nome.toLowerCase() === nome.toLowerCase());
    if (nomeExiste) {
        alert('Este nome já está no ranking. Por favor, escolha outro.');
    } else {
        jogadorAtual = nome;
        nivelAtual = 0;
        pontuacaoTotal = 0;
        estrelasTotal = 0;
        mostrarTela('tela-jogo');
        construirTabuleiro();
    }
}

function salvarPontuacao() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const novaPontuacao = { nome: jogadorAtual, pontos: pontuacaoTotal, estrelas: estrelasTotal };
    ranking.push(novaPontuacao);
    localStorage.setItem('ranking', JSON.stringify(ranking));
}

function mostrarRanking() {
    listaRanking.innerHTML = '';
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.sort((a, b) => b.pontos - a.pontos);
    if (ranking.length === 0) {
        listaRanking.innerHTML = '<p class="sem-ranking">Ninguém jogou ainda. Seja o primeiro!</p>';
    } else {
        ranking.forEach((jogador, index) => {
            const item = document.createElement('div');
            item.classList.add('ranking-item');
            const estrelas = '⭐'.repeat(jogador.estrelas || 0);
            item.innerHTML = `<span>${index + 1}º</span><span>${jogador.nome}</span><span>${jogador.pontos} pts ${estrelas}</span>`;
            listaRanking.appendChild(item);
        });
    }
    mostrarTela('tela-ranking');
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

    // Construção das cartas com carregamento robusto de imagens
    cartasParaJogo.forEach(nomeImagem => {
        const carta = document.createElement('div');
        carta.classList.add('carta-memoria');
        carta.dataset.personagem = nomeImagem;

        // Criamos cada imagem com tratamento de erro
        const imgFrente = document.createElement('img');
        imgFrente.classList.add('frente-carta');
        imgFrente.src = `./imagens/${nomeImagem}.png`;
        imgFrente.alt = nomeImagem;
        imgFrente.onerror = function() {
            console.log(`Erro ao carregar imagem: ${nomeImagem}.png`);
            this.src = './imagens/verso.png'; // Fallback para verso
        };

        const imgVerso = document.createElement('img');
        imgVerso.classList.add('verso-carta');
        imgVerso.src = `./imagens/verso.png`;
        imgVerso.alt = 'Verso da Carta';
        imgVerso.onerror = function() {
            console.log('Erro ao carregar imagem do verso');
        };

        // Garantir que as imagens carreguem antes de adicionar eventos
        carta.appendChild(imgFrente);
        carta.appendChild(imgVerso);
        tabuleiro.appendChild(carta);
    });

    cartas = document.querySelectorAll('.carta-memoria');
    cartas.forEach(carta => carta.addEventListener('click', virarCarta));
    iniciarCronometro();
}

function virarCarta() { if (travarTabuleiro || this.classList.contains('virar') || this === primeiraCarta) return; this.classList.add('virar'); if (!cartaFoiVirada) { cartaFoiVirada = true; primeiraCarta = this; } else { segundaCarta = this; travarTabuleiro = true; verificarPar(); } }
function verificarPar() { let ehPar = primeiraCarta.dataset.personagem === segundaCarta.dataset.personagem; ehPar ? processarParCorreto() : desvirarCartas(); }

function calcularEstrelas(pontuacaoNivel, tentativasErradas, segundosPassados) {
    if (tentativasErradas <= 2 && segundosPassados <= 30) return 3; // 3 estrelas
    if (tentativasErradas <= 5 && segundosPassados <= 60) return 2; // 2 estrelas
    return 1; // 1 estrela
}

function processarParCorreto() {
    primeiraCarta.classList.add('par-encontrado');
    segundaCarta.classList.add('par-encontrado');
    paresEncontrados++;
    destravarEResetarJogada();
    if (paresEncontrados === fases[nivelAtual].pares) {
        clearInterval(cronometroInterval);
        const PONTOS_BASE_NIVEL = 1000; const PENALIDADE_ERRO = 30; const PENALIDADE_TEMPO = 5;
        let pontuacaoNivel = PONTOS_BASE_NIVEL - (tentativasErradas * PENALIDADE_ERRO) - (segundosPassados * PENALIDADE_TEMPO);
        if (pontuacaoNivel < 100) pontuacaoNivel = 100;
        pontuacaoTotal += pontuacaoNivel;

        const estrelasNivel = calcularEstrelas(pontuacaoNivel, tentativasErradas, segundosPassados);
        estrelasTotal += estrelasNivel;
        setTimeout(() => {
            nivelAtual++;
            if (nivelAtual < fases.length) {
                const estrelasMensagem = '⭐'.repeat(estrelasNivel);
                mostrarMensagem(`Nível ${fases[nivelAtual-1].nivel} Completo! ${estrelasMensagem}`, `Você fez ${pontuacaoNivel} pontos e ganhou ${estrelasNivel} estrela${estrelasNivel > 1 ? 's' : ''}!`);
                setTimeout(() => { esconderMensagem(); construirTabuleiro(); }, 3000);
            } else {
                salvarPontuacao();
                const estrelasFinal = '⭐'.repeat(estrelasTotal);
                mostrarMensagem(`Parabéns, ${jogadorAtual}! ${estrelasFinal}`, `Desafio concluído! Pontuação: ${pontuacaoTotal} pontos e ${estrelasTotal} estrelas!`);
                modalBotoes.innerHTML = `<button id="btn-jogar-novamente">Jogar Novamente</button><button id="btn-ver-ranking-final">Ver Ranking</button>`;
                document.querySelector('#btn-jogar-novamente').addEventListener('click', () => { esconderMensagem(); iniciarDesafio(); });
                document.querySelector('#btn-ver-ranking-final').addEventListener('click', () => { esconderMensagem(); mostrarRanking(); });
            }
        }, 1000);
    }
}

function desvirarCartas() { tentativasErradas++; errosDisplay.textContent = tentativasErradas; setTimeout(() => { primeiraCarta.classList.remove('virar'); segundaCarta.classList.remove('virar'); destravarEResetarJogada(); }, 1200); }
function destravarEResetarJogada() { [cartaFoiVirada, travarTabuleiro] = [false, false]; [primeiraCarta, segundaCarta] = [null, null]; }
function mostrarMensagem(titulo, texto) { modalTitulo.textContent = titulo; modalTexto.textContent = texto; modalBotoes.innerHTML = ''; modal.classList.add('visivel'); }
function esconderMensagem() { modal.classList.remove('visivel'); }

// --- EVENTOS DOS BOTÕES ---
btnIniciar.addEventListener('click', iniciarDesafio);
btnVerRanking.addEventListener('click', mostrarRanking);
btnVoltar.addEventListener('click', () => { 
    inputNome.value = ''; 
    document.body.className = ''; // Resetar para tema neutro
    document.querySelector('input[name="genero"][value="menina"]').checked = true; // Resetar seleção
    mostrarTela('tela-inicial'); 
});