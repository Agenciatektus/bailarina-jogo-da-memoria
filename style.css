/* ... (Todo o CSS anterior continua igual até a regra .tabuleiro-memoria) ... */
* { padding: 0; margin: 0; box-sizing: border-box; }
body { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #fce4ec; font-family: sans-serif; color: #880e4f; padding: 20px; }
h1 { margin-bottom: 5px; text-align: center; }
h2#info-nivel { margin-bottom: 15px; font-size: 1.5em; color: #ad1457; }

/* CSS DO TABULEIRO ATUALIZADO */
.tabuleiro-memoria {
    width: 95%;
    max-width: 600px;
    display: grid;
    /* Usamos variáveis CSS que serão controladas pelo JavaScript */
    grid-template-columns: repeat(var(--colunas, 4), 1fr);
    grid-template-rows: repeat(var(--linhas, 2), 1fr);
    gap: 10px;
    perspective: 1000px;
}

/* ... (O resto do CSS continua exatamente como estava, apenas renomeie #modal-vitoria para #modal-mensagem) ... */

.carta-memoria { width: 100%; height: 100%; position: relative; cursor: pointer; transition: transform 0.6s; transform-style: preserve-3d; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
.frente-carta, .verso-carta { width: 100%; height: 100%; object-fit: cover; padding: 5px; position: absolute; border-radius: 10px; background: #ffffff; backface-visibility: hidden; }
.frente-carta { transform: rotateY(180deg); }
.carta-memoria.virar { transform: rotateY(180deg); }
.carta-memoria.par-encontrado { box-shadow: 0 0 10px 5px #69f0ae; border: 2px solid #00c853; }

/* MODAL RENOMEADO */
#modal-mensagem { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.75); display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden; transition: opacity 0.5s, visibility 0.5s; z-index: 1000; }
#modal-mensagem.visivel { opacity: 1; visibility: visible; }
.modal-conteudo { background-color: white; padding: 30px 50px; border-radius: 15px; text-align: center; box-shadow: 0 5px 20px rgba(0,0,0,0.4); transform: scale(0.7); transition: transform 0.4s ease-out; }
#modal-mensagem.visivel .modal-conteudo { transform: scale(1); }
.modal-conteudo h2 { font-size: 3em; color: #880e4f; margin-bottom: 10px; animation: animacao-texto 1s ease-in-out; }
@keyframes animacao-texto { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

/* Media Queries continuam iguais */
@media (max-width: 768px) { h1 { font-size: 1.8em; } .tabuleiro-memoria { gap: 10px; } }
@media (max-width: 500px) { h1 { font-size: 1.5em; } .tabuleiro-memoria { gap: 8px; } .modal-conteudo { padding: 20px 25px; } .modal-conteudo h2 { font-size: 2.2em; } }
