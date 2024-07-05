const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const jumpBtn = document.getElementById('jump-btn');
const refreshBtn = document.getElementById('refresh-btn');

const jump = () => {
    mario.classList.add('jump');

    setTimeout(() => {
    mario.classList.remove('jump');   
    }, 500);
}

jumpBtn.addEventListener('click', jump);

const loop = setInterval(() => {


    
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    
    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {

        pipe.style.animation = "none";
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = "none";
        mario.style.bottom = `${marioPosition}px`;

        mario.src = './src/imagens/game-over.png'
        mario.style.width = '75px'
        mario.style.marginLeft = '50px'

        clearInterval(loop);

        refreshBtn.style.display = 'block';

    }                                                                     

}, 10);

refreshBtn.addEventListener('click', () => {

    location.reload();
    
});

document.addEventListener('keydown', jump);