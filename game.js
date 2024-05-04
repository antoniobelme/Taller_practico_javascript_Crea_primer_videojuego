const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
};

const giftPosition = {
    x: undefined,
    y: undefined,
};

let enemiesPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize); 

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }
    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = (canvasSize * 0.98) / 10;
    elementsSize = Number(elementsSize.toFixed(0));

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function startGame() {
    game.font = (elementsSize * 0.8) + 'px Verdana';
    game.textAlign = 'end';

    // 
    const map = maps[level];

    if (!map){
        gameWin();
        return;
    }

    if (!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }
    // fillas de maps, crear un distinto array cada que se encuentre con un salto de línea
    const mapRow = map.trim().split('\n');
    // columnas de maps, se crea un array dentro de un array, cada elemento del la fila es un nuevo array que es un elemento de la columna
    const mapRowCols = mapRow.map(row => row.trim().split(''));

    showLives();

    enemiesPositions = [];
    game.clearRect(0,0,canvasSize,canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if (col == 'O'){
                if (!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                }
            } else if (col == 'I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X') {
                enemiesPositions.push({
                    x: posX,
                    y: posY,
                });
            }

            game.fillText(emoji, posX, posY)
        });
    });
    movePlayer();
}  

function movePlayer() { 
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision){
        levelWin();
    };

    // El metodo .find() permite reconocer si hay algún elemento dentro del array que cumpla con los parametros establecidos. Si algún elemento dentro del arreglo o array cumple los parametros, el metodo devuelve dicho elemento. 
    const enemyCollision = enemiesPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision){
        levelFail();
    };

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    console.log('Subiste de nivel');
    level++;
    startGame();
}

function levelFail() {
    lives --;
    console.log('Chocaste contra una bomba');

    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin(){
    console.log('Terminaste el juego');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'Superaste el record.';
        } else {
            pResult.innerHTML = 'No superaste el record.';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'Buen tiempo para ser tu primera vez.';
    }
    console.log(recordTime, playerTime);
}

function showLives() {
    // Superprototipo
    // Se crea array con las posiciones que diga la variable lives.
    const heartArray = Array(lives).fill(emojis['HEART']);
    console.log(heartArray);
    spanLives.innerHTML = "";
    heartArray.forEach(heart => spanLives.append(heart));
}

function showTime() {
    // Date.now nos ayuda a tener la hora en formato ms.
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}
window.addEventListener('keydown', moveByKey);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKey(event) {
    // Si suprimo los '{}' de los condicionales el código se ejecutara de igual manera, la condicional ejecutará el código hasta el siguiente ';', esto hace el código mas corto.
    if (event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight();
    else if (event.key == 'ArrowDown') moveDown();

    // if (event.key == 'ArrowUp'){
    //     moveUp();
    // } else if (event.key == 'ArrowLeft'){
    //     moveLeft();
    // } else if (event.key == 'ArrowRight'){
    //     moveRight();
    // } else if (event.key == 'ArrowDown'){
    //     moveDown();
    // }
}

function moveUp() {
    console.log('Me quiero mover hacia arriba');
// esta sección de códifo, condicional, no permite que el jugador se salga del canvas.
    if ((playerPosition.y - elementsSize) < elementsSize){
        console.log('out');
    } else {
        playerPosition.y = playerPosition.y - elementsSize;
        startGame();
    }
}

function moveLeft() {
    console.log('Me quiero mover hacia la izquierda');

    if ((playerPosition.x.toFixed(2) - elementsSize.toFixed(2)) < elementsSize.toFixed(2)){
        console.log('out');
    } else {
        playerPosition.x = playerPosition.x - elementsSize;
        startGame();
    }
}

function moveRight() {
    console.log('Me quiero mover hacia la derecha');
    if ((playerPosition.x + elementsSize) > canvasSize){
        console.log('out');
    } else {
        playerPosition.x = playerPosition.x + elementsSize;
        startGame();
    }
}

function moveDown() {
    console.log('Me quiero mover hacia abajo');
    if ((playerPosition.y + elementsSize) > canvasSize){
        console.log('out');
    } else {
        playerPosition.y = playerPosition.y + elementsSize;
        startGame();
    }
    
}

// localStorage permite guardar información en el navegador, solo funciona en el frontend.
// localStorage.getItem permite leer alguna información dentro de localStorage.
// localStorage.setItem permite guardar la variable por primera vez. finciona como un metodo. 
// localStorage.removeItem permite decirle al navegador que la variable puede ser borrada o eliminada.


    // for (let row = 1; row <= 10; row++) {
    //     for (let col = 1; col <= 10; col ++) {
    //         game.fillText(emojis[mapRowCols[row - 1][col - 1]], elementsSize * col, elementsSize * row);
    //     }
    // }

// La función .trim() ayuda a limpiar los espacios en blanco que tengamos al inicio de un string.
// La función .split('\n') ayuda a reconocer los elementos de un array como un array partiendo del salto de línea.

    // En canvas el eje x no es el vertical sino el horizontal, y el eje y es el vertical.
    // game.fillRect(50,0,100,100);
    // game.clearRect(0,0,50,50);
    // game.clearRect(50,50,50,50);
    // game.clearRect()
    // game.font = '25px Verdana';
    // game.fillStyle = 'purple';
    // Con la propiedad "game.textAlign" se define la ubicación del elemento texto partiendo de las cordenadas dadas en "game.fillText('Platzi',x,x);"
    // game.textAlign = 'right'; 
    // game.fillText('Platzi',100,100);
