// Base de datos de palabras por categoría
const wordsDatabase = {
    "Animales": ["ELEFANTE", "JIRAFA", "CANGURO", "LEOPARDO", "HIPOPÓTAMO", "COCODRILO", "PINGÜINO", "DELFÍN", "ARDILLA", "MARIPOSA"],
    "Países": ["ESPAÑA", "MÉXICO", "ARGENTINA", "COLOMBIA", "BRASIL", "FRANCIA", "ITALIA", "ALEMANIA", "JAPÓN", "CANADÁ"],
    "Profesiones": ["CARPINTERO", "MÉDICO", "INGENIERO", "PROFESOR", "BOMBERO", "POLICÍA", "ARQUITECTO", "PROGRAMADOR", "ARTISTA", "MÚSICO"],
    "Frutas": ["MANZANA", "PLÁTANO", "FRESA", "NARANJA", "SANDÍA", "MELÓN", "KIWI", "PAPAYA", "MANGO", "CEREZA"],
    "Deportes": ["FÚTBOL", "BALONCESTO", "NATACIÓN", "TENIS", "ATLETISMO", "CICLISMO", "VOLEIBOL", "GOLF", "BOXEO", "JUDO"],
    "Objetos": ["COMPUTADORA", "TELEFONO", "LIBRETA", "ESCRITORIO", "VENTANA", "PANTALLA", "TECLADO", "SILLA", "MESA", "LÁMPARA"]
};

// Variables del juego
let currentWord = "";
let currentCategory = "";
let timerInterval;
let timeLeft = 60;
let gameActive = false;

// Elementos del DOM
const startBtn = document.getElementById('start-btn');
const hintBtn = document.getElementById('hint-btn');
const nextBtn = document.getElementById('next-btn');
const timerDisplay = document.getElementById('timer');
const categoryDisplay = document.getElementById('category');
const wordLengthDisplay = document.getElementById('word-length');
const originalWordDisplay = document.getElementById('original-word');
const gameBoard = document.getElementById('game-board');

// Inicializar el juego
function initGame() {
    resetTimer();
    hintBtn.disabled = true;
    nextBtn.disabled = true;
    originalWordDisplay.classList.remove('show');
    gameBoard.innerHTML = '';
    categoryDisplay.textContent = "Categoría: -";
    wordLengthDisplay.textContent = "0";
}

// Obtener una palabra aleatoria
function getRandomWord() {
    // Seleccionar una categoría aleatoria
    const categories = Object.keys(wordsDatabase);
    currentCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Seleccionar una palabra aleatoria de esa categoría
    const words = wordsDatabase[currentCategory];
    currentWord = words[Math.floor(Math.random() * words.length)];
    
    return currentWord;
}

// Iniciar nueva palabra
function startNewWord() {
    // Obtener palabra aleatoria
    getRandomWord();
    
    // Actualizar displays
    categoryDisplay.textContent = `Categoría: ${currentCategory}`;
    wordLengthDisplay.textContent = currentWord.length;
    
    // Crear letras desordenadas en pantalla
    createScatteredLetters();
    
    // Configurar botones
    hintBtn.disabled = false;
    nextBtn.disabled = true;
    
    // Reiniciar y empezar temporizador
    resetTimer();
    startTimer();
    
    // Ocultar palabra original
    originalWordDisplay.classList.remove('show');
    
    gameActive = true;
}

// Crear letras desordenadas en el tablero
function createScatteredLetters() {
    // Limpiar tablero
    gameBoard.innerHTML = '';
    
    // Separar letras de la palabra
    const letters = currentWord.split('');
    
    // Desordenar las letras
    const shuffledLetters = [...letters].sort(() => Math.random() - 0.5);
    
    // Posicionar cada letra en un lugar aleatorio del tablero
    shuffledLetters.forEach((letter, index) => {
        const letterElement = document.createElement('div');
        letterElement.className = 'scattered-letter';
        letterElement.textContent = letter;
        letterElement.dataset.letter = letter;
        letterElement.dataset.index = index;
        
        // Posición aleatoria dentro del tablero
        const boardWidth = gameBoard.clientWidth - 70;
        const boardHeight = gameBoard.clientHeight - 70;
        
        const randomX = Math.floor(Math.random() * boardWidth);
        const randomY = Math.floor(Math.random() * boardHeight);
        
        letterElement.style.left = `${randomX}px`;
        letterElement.style.top = `${randomY}px`;
        
        // Rotación aleatoria para hacerlo más interesante
        const rotation = Math.floor(Math.random() * 60) - 30;
        letterElement.style.transform = `rotate(${rotation}deg)`;
        
        // Color aleatorio para cada letra
        const hue = Math.floor(Math.random() * 360);
        letterElement.style.color = `hsl(${hue}, 80%, 70%)`;
        
        gameBoard.appendChild(letterElement);
    });
}

// Mostrar la palabra ordenada
function showOriginalWord() {
    // Limpiar display
    originalWordDisplay.innerHTML = '';
    
    // Crear cajas para cada letra
    const letters = currentWord.split('');
    letters.forEach(letter => {
        const letterBox = document.createElement('div');
        letterBox.className = 'letter-box';
        letterBox.textContent = letter;
        originalWordDisplay.appendChild(letterBox);
    });
    
    // Mostrar la palabra
    originalWordDisplay.classList.add('show');
    
    // Activar botón siguiente
    if (gameActive) {
        nextBtn.disabled = false;
        gameActive = false;
    }
}

// Temporizador
function startTimer() {
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Cuando se acaba el tiempo, mostrar la palabra automáticamente
            if (gameActive) {
                showOriginalWord();
            }
        }
    }, 1000);
}

function resetTimer() {
    timeLeft = 60;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Cambiar color cuando queden 10 segundos
    if (timeLeft <= 10) {
        timerDisplay.style.color = '#ff0000';
    } else {
        timerDisplay.style.color = '#ff9e00';
    }
}

// Siguiente palabra
function nextWord() {
    startNewWord();
}

// Event listeners
startBtn.addEventListener('click', startNewWord);
hintBtn.addEventListener('click', showOriginalWord);
nextBtn.addEventListener('click', nextWord);

// Inicializar el juego al cargar la página
window.addEventListener('DOMContentLoaded', initGame);

// Redimensionar letras cuando cambie el tamaño de la ventana
window.addEventListener('resize', function() {
    if (currentWord && gameBoard.children.length > 0) {
        // Volver a posicionar las letras
        const letters = document.querySelectorAll('.scattered-letter');
        letters.forEach(letter => {
            const boardWidth = gameBoard.clientWidth - 70;
            const boardHeight = gameBoard.clientHeight - 70;
            
            const randomX = Math.floor(Math.random() * boardWidth);
            const randomY = Math.floor(Math.random() * boardHeight);
            
            letter.style.left = `${randomX}px`;
            letter.style.top = `${randomY}px`;
        });
    }
});