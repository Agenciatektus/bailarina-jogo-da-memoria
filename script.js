// Seleciona os elementos do jogo
const cartas = document.querySelectorAll('.carta-memoria');
const modalVitoria = document.querySelector('#modal-vitoria');
const resetButton = document.querySelector('#reset-btn');

// Variáveis de estado do jogo
let cartaFoiVirada = false;
let travarTabuleiro = false;
let primeiraCarta, segundaCarta;
let paresEncontrados = 0;
const totalPares = cartas.length / 2;

function embaralhar() {
    cartas.forEach(carta => {
        let posicaoAleatoria = Math.floor(Math.random() * cartas.length);
        carta.style.order = posicaoAleatoria;
    });
}

function virarCarta() {
    if (travarTabuleiro || this === primeiraCarta) return;
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
    primeiraCarta.removeEventListener('click', virarCarta);
    segundaCarta.removeEventListener('click', virarCarta);
    
    paresEncontrados++;
    destravarEResetarJogada();

    if (paresEncontrados === totalPares) {
        setTimeout(() => {
            modalVitoria.classList.add('visivel');
            // Após 5 segundos, chama a função para reiniciar (que agora vai atualizar a página)
            setTimeout(reiniciarJogo, 5000);
        }, 800);
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

// =========================================================
// FUNÇÃO DE REINÍCIO ATUALIZADA E SIMPLIFICADA
// =========================================================
function reiniciarJogo() {
    // Este comando simplesmente atualiza a página. 
    // É a forma mais robusta e simples de reiniciar o jogo do zero.
    location.reload();
}

// --- CONFIGURAÇÃO INICIAL ---

// Adiciona o evento de clique ao botão de reset
resetButton.addEventListener('click', reiniciarJogo);

// Inicia o jogo pela primeira vez
embaralhar();
cartas.forEach(carta => carta.addEventListener('click', virarCarta));