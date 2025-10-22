class WordGame {
    constructor() {
        this.words = {
            animales: ['ELEFANTE', 'JIRAFA', 'DELFIN', 'TIGRE', 'LEON', 'CANGURO'],
            frutas: ['MANZANA', 'NARANJA', 'PLATANO', 'FRESA', 'SANDIA', 'UVA'],
            paises: ['ESPAÑA', 'FRANCIA', 'ITALIA', 'MEXICO', 'BRASIL', 'CHILE'],
            profesiones: ['DOCTOR', 'MAESTRO', 'INGENIERO', 'BOMBERO', 'POLICIA', 'CHEF']
        };
        
        this.categories = Object.keys(this.words);
        this.currentCategory = '';
        this.secretWord = '';
        this.guessedWord = [];
        this.usedLetters = new Set();
        this.attemptsLeft = 6;
        this.gameOver = false;
        
        this.initializeElements();
        this.startNewGame();
    }
    
    initializeElements() {
        this.wordDisplay = document.getElementById('wordDisplay');
        this.letterInput = document.getElementById('letterInput');
        this.guessBtn = document.getElementById('guessBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.message = document.getElementById('message');
        this.attemptsCount = document.getElementById('attemptsCount');
        this.categoryText = document.getElementById('categoryText');
        this.usedLettersDisplay = document.getElementById('usedLetters');
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.guessBtn.addEventListener('click', () => this.guessLetter());
        this.resetBtn.addEventListener('click', () => this.startNewGame());
        this.hintBtn.addEventListener('click', () => this.giveHint());
        
        this.letterInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.guessLetter();
            }
        });
        
        this.letterInput.addEventListener('input', (e) => {
            // Solo permitir letras
            e.target.value = e.target.value.replace(/[^a-zA-ZñÑ]/g, '').toUpperCase();
        });
    }
    
    startNewGame() {
        // Seleccionar categoría aleatoria
        this.currentCategory = this.categories[Math.floor(Math.random() * this.categories.length)];
        
        // Seleccionar palabra aleatoria de la categoría
        const categoryWords = this.words[this.currentCategory];
        this.secretWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
        
        // Reiniciar variables del juego
        this.guessedWord = Array(this.secretWord.length).fill('_');
        this.usedLetters.clear();
        this.attemptsLeft = 6;
        this.gameOver = false;
        
        // Actualizar interfaz
        this.updateDisplay();
        this.message.textContent = '¡Adivina la palabra! Empieza con una letra.';
        this.message.style.color = '#4ECDC4';
        this.letterInput.disabled = false;
        this.guessBtn.disabled = false;
        this.hintBtn.disabled = false;
        this.resetBtn.classList.add('hidden');
        
        this.letterInput.focus();
    }
    
    guessLetter() {
        if (this.gameOver) return;
        
        const letter = this.letterInput.value.trim().toUpperCase();
        
        if (!letter) {
            this.showMessage('Por favor, ingresa una letra', 'orange');
            this.letterInput.classList.add('shake');
            setTimeout(() => this.letterInput.classList.remove('shake'), 300);
            return;
        }
        
        if (this.usedLetters.has(letter)) {
            this.showMessage('Ya usaste esta letra', 'orange');
            this.letterInput.classList.add('shake');
            setTimeout(() => this.letterInput.classList.remove('shake'), 300);
            this.letterInput.value = '';
            return;
        }
        
        this.usedLetters.add(letter);
        
        if (this.secretWord.includes(letter)) {
            // Letra correcta
            this.updateGuessedWord(letter);
            this.showMessage('¡Correcto! La letra está en la palabra', '#4ECDC4');
            this.wordDisplay.classList.add('bounce');
            setTimeout(() => this.wordDisplay.classList.remove('bounce'), 500);
        } else {
            // Letra incorrecta
            this.attemptsLeft--;
            this.showMessage('Letra incorrecta', '#FF6B6B');
        }
        
        this.updateDisplay();
        this.checkGameStatus();
        this.letterInput.value = '';
        this.letterInput.focus();
    }
    
    updateGuessedWord(letter) {
        for (let i = 0; i < this.secretWord.length; i++) {
            if (this.secretWord[i] === letter) {
                this.guessedWord[i] = letter;
            }
        }
    }
    
    updateDisplay() {
        // Actualizar palabra mostrada
        this.wordDisplay.innerHTML = this.guessedWord.map(letter => 
            `<span class="letter">${letter}</span>`
        ).join('');
        
        // Actualizar intentos
        this.attemptsCount.textContent = this.attemptsLeft;
        this.attemptsCount.style.color = this.attemptsLeft <= 2 ? '#FF6B6B' : 'white';
        
        // Actualizar categoría
        this.categoryText.textContent = this.currentCategory.charAt(0).toUpperCase() + this.currentCategory.slice(1);
        
        // Actualizar letras usadas
        this.usedLettersDisplay.textContent = Array.from(this.usedLetters).join(', ');
    }
    
    checkGameStatus() {
        if (this.guessedWord.join('') === this.secretWord) {
            // Victoria
            this.gameOver = true;
            this.showMessage(`¡Felicidades! Adivinaste la palabra: ${this.secretWord}`, '#4ECDC4');
            this.endGame();
        } else if (this.attemptsLeft <= 0) {
            // Derrota
            this.gameOver = true;
            this.showMessage(`¡Game Over! La palabra era: ${this.secretWord}`, '#FF6B6B');
            this.endGame();
        }
    }
    
    endGame() {
        this.letterInput.disabled = true;
        this.guessBtn.disabled = true;
        this.hintBtn.disabled = true;
        this.resetBtn.classList.remove('hidden');
    }
    
    giveHint() {
        if (this.gameOver || this.usedLetters.size === 0) return;
        
        // Encontrar una letra que no se haya adivinado
        const unguessedLetters = this.secretWord.split('').filter((letter, index) => 
            this.guessedWord[index] === '_' && !this.usedLetters.has(letter)
        );
        
        if (unguessedLetters.length > 0) {
            const hintLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
            this.showMessage(`Pista: Prueba con la letra "${hintLetter}"`, '#FFD166');
        } else {
            this.showMessage('¡Ya casi lo tienes! Sigue intentando', '#FFD166');
        }
    }
    
    showMessage(text, color) {
        this.message.textContent = text;
        this.message.style.color = color;
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new WordGame();
});