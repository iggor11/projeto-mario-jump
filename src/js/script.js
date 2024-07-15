const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const jumpBtn = document.getElementById('jump-btn');
const startBtn = document.getElementById('start-btn');
const refreshBtn = document.getElementById('refresh-btn');
const playerNameInput = document.getElementById('player-name');
const playerRecordDisplay = document.getElementById('player-record');

let playerName = '';
let playerRecord = 0;
let gameLoopInterval = null;
let gameStarted = false;
let score = 0;
let canJump = true; // Flag para controlar se o Mario pode pular

const jump = () => {
    if (canJump && !mario.classList.contains('jump')) {
        mario.classList.add('jump');

        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);

        canJump = false; // Impede que o Mario pule novamente imediatamente
    }
}

const updateRecord = () => {
    const currentRecord = parseInt(localStorage.getItem('playerRecord')) || 0;
    
    if (score > currentRecord) {
        localStorage.setItem('playerRecord', score.toString());
        playerRecordDisplay.textContent = score.toString();
    }
}

const gameLoop = () => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    
    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        // Quando há colisão com o cano
        pipe.style.animation = "none";
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = "none";
        mario.style.bottom = `${marioPosition}px`;

        mario.src = './src/imagens/game-over.png'
        mario.style.width = '75px'
        mario.style.marginLeft = '50px'

        clearInterval(gameLoopInterval);

        refreshBtn.style.display = 'block';

        updateRecord();
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

const startGame = () => {
    playerName = playerNameInput.value;
    if (playerName.trim() === '') {
        alert('Por favor, insira seu nome para iniciar o jogo.');
        return;
    }

    startBtn.style.display = 'none';
    jumpBtn.style.display = 'block';

    // Iniciar animações apenas se não estiver iniciado
    if (!gameStarted) {
        clouds.style.animationPlayState = 'running'; // Inicia animação das nuvens
        mario.style.animationPlayState = 'running'; // Inicia animação do Mario
        pipe.style.animationPlayState = 'running';  // Inicia animação do cano

        gameLoopInterval = setInterval(gameLoop, 10);
        gameStarted = true;
    }
}

startBtn.addEventListener('click', startGame);

jumpBtn.addEventListener('click', jump);

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

window.addEventListener('DOMContentLoaded', () => {
    const currentRecord = parseInt(localStorage.getItem('playerRecord')) || 0;
    playerRecord = currentRecord;
    playerRecordDisplay.textContent = playerRecord.toString();

    // Pausar animações ao carregar a página
    clouds.style.animationPlayState = 'paused';
    mario.style.animationPlayState = 'paused';
    pipe.style.animationPlayState = 'paused';
});
