// Variáveis globais
let playerName = ''; // Variável global para armazenar o nome do jogador
let playerRecord = 0;
let gameLoopInterval = null;
let gameStarted = false;
let score = 0;
let canJump = true; // Flag para controlar se o Mario pode pular

// Seleção de elementos do DOM
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const jumpBtn = document.getElementById('jump-btn');
const startBtn = document.getElementById('start-btn');
const refreshBtn = document.getElementById('refresh-btn');
const playerNameInput = document.getElementById('player-name');
const playerRecordDisplay = document.getElementById('player-record');
const sidePanel = document.querySelector('.side-panel');

// Função para iniciar o jogo
const startGame = () => {
    playerName = playerNameInput.value;
    if (playerName.trim() === '') {
        alert('Por favor, insira seu nome para iniciar o jogo.');
        return;
    }

    startBtn.style.display = 'none';
    jumpBtn.style.display = 'block';

    // Remover a classe 'paused' para iniciar a animação do Mario
    mario.classList.remove('paused');

    // Iniciar animações apenas se não estiver iniciado
    if (!gameStarted) {
        clouds.style.animationPlayState = 'running'; // Inicia animação das nuvens
        pipe.style.animationPlayState = 'running';   // Inicia animação do cano

        gameLoopInterval = setInterval(gameLoop, 30); // Ajuste o intervalo conforme necessário
        gameStarted = true;
    }
}

// Função para atualizar o recorde
const updateRecord = () => {
    const currentRecord = parseInt(localStorage.getItem('playerRecord')) || 0;
    
    if (score > currentRecord) {
        localStorage.setItem('playerRecord', score.toString());
        localStorage.setItem('playerName', playerName); // Armazena o nome do jogador
        playerRecordDisplay.textContent = score.toString();
    }
}

// Função para mostrar a lista de recordes
const showTopRecords = () => {
    const topRecords = [
        { name: localStorage.getItem('playerName'), score: parseInt(localStorage.getItem('playerRecord')) || 0 }
        // Aqui você pode adicionar mais registros se desejar
    ];

    // Limpa o conteúdo atual do painel de recordes
    sidePanel.innerHTML = '<h2>Melhor Pontuação 👑</h2>';
    const recordsList = document.createElement('ul');

    topRecords.forEach(record => {
        const item = document.createElement('li');
        item.textContent = `${record.name}: ${record.score}`;
        recordsList.appendChild(item);
    });

    sidePanel.appendChild(recordsList);
}

// Função para o pulo do Mario
const jump = () => {
    if (canJump && !mario.classList.contains('jump')) {
        mario.classList.add('jump');

        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);

        canJump = false; // Impede que o Mario pule novamente imediatamente
    }
}

// Função principal do loop do jogo
const gameLoop = () => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    
    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        // Quando há colisão com o cano
        pipe.style.animation = "none";
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = "none";
        mario.style.bottom = `${marioPosition}px`;

        mario.src = './src/imagens/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        clearInterval(gameLoopInterval);

        refreshBtn.style.display = 'block';

        updateRecord();

        showTopRecords(); // Mostra a lista de recordes
    } else if (pipePosition <= 0 && marioPosition > 80 && marioPosition < 200) {
        // Quando o jogador pula sobre o cano com sucesso
        if (canJump) {
            score++;
            playerRecordDisplay.textContent = score.toString();
            canJump = false; // Impede que o Mario pontue várias vezes ao pular
        }
    } else {
        canJump = true; // Permite que o Mario pule novamente
    }
}

// Event listeners
startBtn.addEventListener('click', startGame);

jumpBtn.addEventListener('click', () => {
    jump();
});

refreshBtn.addEventListener('click', () => {
    location.reload();
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

playerNameInput.addEventListener('input', () => {
    playerName = playerNameInput.value;
});

// Evento ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const currentRecord = parseInt(localStorage.getItem('playerRecord')) || 0;
    playerRecord = currentRecord;
    playerRecordDisplay.textContent = playerRecord.toString();

    // Pausar animações ao carregar a página
    clouds.style.animationPlayState = 'paused';
    pipe.style.animationPlayState = 'paused';
    mario.classList.add('paused');

    // Mostrar a lista de recordes ao carregar a página
    showTopRecords();
});
