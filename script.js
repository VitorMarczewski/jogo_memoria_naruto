// Objeto que armazena os sons usados no jogo
const audios = {
    1: new Audio('sounds/flipSound.mp3'),    // Som para virar cartas
    2: new Audio('sounds/foundPairs.mp3'),   // Som ao encontrar pares
    3: new Audio('sounds/error.mp3'),        // Som de erro ao não combinar pares
    4: new Audio('sounds/musicaFundo.mp3'),  // Música de fundo
    5: new Audio('sounds/resultado.mp3'),    // Som do resultado final
    6: new Audio('sounds/começo.mp3')        // Som inicial do jogo
};

// Ajusta o volume de cada áudio
audios[1].volume = 0.5; // Volume do som de virar cartas
audios[2].volume = 1.0; // Volume máximo para som de pares encontrados
audios[3].volume = 0.1; // Volume do som de erro
audios[4].volume = 0.3; // Volume da música de fundo

function trocarTela(){
    setTimeout(()=>{
        body.classList.remove('paginaInicial')
        cronometro.style.display='flex'
        body.querySelector('h1').style.display='none'
        jogo.style.display='flex'
        btn_play.style.display='none'
    },1000)
    
    
}

// Função para tocar o áudio baseado no número passado
function playAudio(num) {
    if (audios[num]) {
        audios[num].play(); // Toca o áudio correspondente
    }
}

// Função para embaralhar os números das cartas
function embaralhar(array) {
    // Algoritmo de Fisher-Yates para embaralhar
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Troca os elementos
    }
    return array;
}

// Função para iniciar o cronômetro
function iniciarCronometro() {
    let tempoRestante = 92; // Tempo inicial de 95 segundos
    

    // Intervalo que atualiza o cronômetro a cada segundo
     let intervalo = setInterval(() => {
        const minutos = Math.floor(tempoRestante / 60);  // Calcula minutos restantes
        const segundos = tempoRestante % 60;  // Calcula segundos restantes

        // Atualiza o elemento de cronômetro no HTML
        document.getElementById('cronometro').innerText = `TEMPO RESTANTE \n ${minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
        tempoRestante--;  // Decrementa o tempo
        
        // Quando o tempo acabar, travar tabuleiro, mostrar resultado e parar cronômetro
        if (tempoRestante < 0) {
            travarTabuleiro();
            mostrarResultado();
            clearInterval(intervalo); 
            
        }
    }, 1000);  // Intervalo de 1 segundo
}

// Função para mostrar o resultado final (vitória ou derrota)
function mostrarResultado() {
    setTimeout(() => {
        cronometro.classList.add('fade-out');
    jogo.classList.add('fade-out')
    }, 1000);
    
    
    
    audios[4].pause();  // Pausa a música de fundo
    playAudio(5);  // Toca som do resultado



    const resultado = document.querySelector('#resultado');
    setTimeout(() => {
        resultado.style.display='flex'
        cronometro.style.display='none'
        jogo.style.display='none'
        body.style.backdropFilter='blur(3px)'
        
        if(pares === 12){
            resultado.querySelector('h2').innerHTML='VOCE VENCEU'
            
        } else {
            resultado.querySelector('h2').innerHTML='VOCE PERDEU'
            
        }
        setTimeout(() => {
            resultado.querySelector('button').style.opacity=10;
        }, 1500);
        
        
        
        
    }, 5500);
}

// Função para travar o tabuleiro temporariamente
function travarTabuleiro() {
    cartas.forEach(el => {
        el.classList.add('desativarCarta');  // Desativa todas as cartas
    });
    setTimeout(() => {
        cartas.forEach(el => {
            el.classList.remove('desativarCarta');  // Reativa todas as cartas
        });
    }, 1000);  // Reativa após 1 segundo
}

// Função para limpar as cartas selecionadas
function esvaziarCartas() {
    carta1 = null;
    carta2 = null;
}

// Função para gerar as cartas
function gerarCartas() {
    embaralhar(numeros);  // Embaralha os números das cartas

    for (let i = 0; i < 24; i++) {
        let novaCarta = document.createElement('div');  // Cria um novo elemento de carta
        novaCarta.classList.add('container');

        let conteudoCarta = document.createElement('div');
        conteudoCarta.classList.add('flip');

        // Cria a frente da carta
        let frente = document.createElement('div');
        frente.classList.add('frente');
        conteudoCarta.appendChild(frente);

        // Cria a parte de trás da carta
        let tras = document.createElement('div');
        tras.classList.add('tras');
        tras.id = `p${numeros[i]}`;  // Define o ID baseado no número
        conteudoCarta.appendChild(tras);

        novaCarta.appendChild(conteudoCarta);  // Adiciona conteúdo à nova carta
        cartas.push(novaCarta);  // Armazena a carta no array

        // Adiciona evento de clique à carta
        novaCarta.addEventListener('click', () => {
            playAudio(1);  // Toca som de virar carta
            conteudoCarta.classList.add('flipped');  // Gira a carta

            // Verifica se é a primeira ou segunda carta selecionada
            if (carta1 === novaCarta || (carta1 !== null && carta1.classList.contains('desativarCarta')) || (carta2 !== null && carta2.classList.contains('desativarCarta'))) {
                return;  // Se já estiverem selecionadas, não faz nada
            }

            if (carta1 === null) {
                carta1 = novaCarta;  // Define a primeira carta
            } else {
                carta2 = novaCarta;  // Define a segunda carta
                let carta1Id = carta1.querySelector('.tras').id;
                let carta2Id = carta2.querySelector('.tras').id;

                travarTabuleiro();  // Desativa o tabuleiro temporariamente

                // Se as cartas combinam
                if (carta1Id === carta2Id) {
                    carta1.classList.add('pulse');
                    carta2.classList.add('pulse');
                    playAudio(2);  // Toca som de par encontrado
                    pares++;
                    
                    carta1.classList.add('parEncontrado');
                    carta2.classList.add('parEncontrado');
                    esvaziarCartas();

                    // Verifica se todos os pares foram encontrados
                    if (pares === 12) {
                        setTimeout(() => {
                            mostrarResultado();
                            clearInterval(intervalo);  // Para o cronômetro
                        }, 1000);
                    }
                } else {
                    // Se as cartas não combinam
                    setTimeout(() => {
                        playAudio(3);  // Toca som de erro
                        carta1.querySelector('.flip').classList.remove('flipped');
                        carta2.querySelector('.flip').classList.remove('flipped');
                        esvaziarCartas();
                    }, 1000);
                }
            }
        });

        jogo.appendChild(novaCarta);  // Adiciona a nova carta ao tabuleiro
    }
}

// Array contendo os números para as cartas, com pares repetidos
let numeros = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12];

// Variáveis de controle
let carta1 = null; 
let carta2 = null;  
let pares =0;  
let cartas = [];  // Array para armazenar as cartas geradas

// Seleciona o elemento 'jogo' e o botão 'play' do HTML
const body=document.querySelector('body')
const jogo = document.querySelector('#jogo');
const btn_play = document.querySelector('.btn_play');
const cronometro = document.querySelector('#cronometro')
const btnJogarNovamente = document.querySelector('#resultado button');

// Evento para iniciar o jogo ao clicar no botão 'play'
btn_play.addEventListener('click', () => {
    trocarTela()
    playAudio(6);  // Toca som de começo
    playAudio(4);  // Toca música de fundo
    btn_play.classList.add('clicado'); // Adiciona uma classe ao botão
    setTimeout(() => {
        btn_play.style.visibility = 'hidden';  // Oculta o botão após 800ms
    }, 800);
    iniciarCronometro();  // Inicia o cronômetro
});
btnJogarNovamente.addEventListener('click', () => {
    location.reload();  // Recarrega a página
});
// Gera as cartas no início do jogo
gerarCartas();
