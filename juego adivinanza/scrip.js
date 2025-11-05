class MemoryGame {
    constructor() {
        // Array con las rutas de las imágenes (URLs de internet como ejemplo)
        this.cards = [
            'waves.jpg',
            'donpollo.jpg',
            'gogeta.jpg',
            'labestia.webp',
            'messi.jpg',
            'Panamiguel.webp',
            'stardew.png',
            'piccolo.webp'
        ];
        
        this.gameBoard = document.getElementById('gameBoard');
        this.movesElement = document.getElementById('moves');
        this.pairsElement = document.getElementById('pairs');
        this.timerElement = document.getElementById('timer');
        this.messageElement = document.getElementById('message');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.moves = 0;
        this.matchedPairs = 0;
        this.totalPairs = 8;
        this.timer = 0;
        this.timerInterval = null;
        this.gameStarted = false;
        
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
        this.canPlay = false;
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.createCards();
        this.updateDisplay();
    }
    
    createCards() {
        // Duplicar y mezclar las cartas
        const gameCards = [...this.cards, ...this.cards];
        this.shuffleArray(gameCards);
        
        // Crear elementos HTML para las cartas
        this.gameBoard.innerHTML = '';
        gameCards.forEach((imagePath, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.image = imagePath;
            card.dataset.index = index;
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">
                        <img src="${imagePath}" alt="Imagen del juego" class="card-image" loading="lazy">
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => this.flipCard(card));
            this.gameBoard.appendChild(card);
        });
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    startGame() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        this.canPlay = true;
        this.startBtn.disabled = true;
        this.resetBtn.classList.remove('hidden');
        this.startTimer();
        this.showMessage('¡El juego ha comenzado! Encuentra todas las parejas.', '#4ECDC4');
    }
    
    resetGame() {
        // Detener temporizador
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Reiniciar variables
        this.moves = 0;
        this.matchedPairs = 0;
        this.timer = 0;
        this.gameStarted = false;
        this.canPlay = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
        
        // Actualizar interfaz
        this.updateDisplay();
        this.startBtn.disabled = false;
        this.resetBtn.classList.add('hidden');
        this.messageElement.textContent = 'Presiona "Comenzar Juego" para empezar';
        this.messageElement.style.color = 'white';
        
        // Recrear cartas
        this.createCards();
    }
    
    startTimer() {
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.timer++;
            const minutes = Math.floor(this.timer / 60).toString().padStart(2, '0');
            const seconds = (this.timer % 60).toString().padStart(2, '0');
            this.updateTimerDisplay(`${minutes}:${seconds}`);
        }, 1000);
    }
    
    flipCard(card) {
        // Verificar condiciones para voltear
        if (!this.canPlay || this.lockBoard) {
            return;
        }
        
        if (card === this.firstCard || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        // Agregar clase flipped
        card.classList.add('flipped');
        
        // Si no hay primera carta, asignarla
        if (!this.firstCard) {
            this.firstCard = card;
            return;
        }
        
        // Asignar segunda carta y verificar match
        this.secondCard = card;
        this.lockBoard = true;
        
        this.checkForMatch();
    }
    
    checkForMatch() {
        // Incrementar movimientos
        this.moves++;
        this.updateMovesDisplay();
        
        // Comparar las rutas de las imágenes
        const isMatch = this.firstCard.dataset.image === this.secondCard.dataset.image;
        
        if (isMatch) {
            this.disableCards();
        } else {
            this.unflipCards();
        }
    }
    
    disableCards() {
        this.firstCard.classList.add('matched');
        this.secondCard.classList.add('matched');
        this.firstCard.classList.add('bounce');
        this.secondCard.classList.add('bounce');
        
        this.matchedPairs++;
        this.updatePairsDisplay();
        
        setTimeout(() => {
            this.firstCard.classList.remove('bounce');
            this.secondCard.classList.remove('bounce');
            this.resetBoard();
        }, 600);
        
        this.checkGameWin();
    }
    
    unflipCards() {
        setTimeout(() => {
            this.firstCard.classList.remove('flipped');
            this.secondCard.classList.remove('flipped');
            this.resetBoard();
        }, 1000);
    }
    
    resetBoard() {
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
    }
    
    checkGameWin() {
        if (this.matchedPairs === this.totalPairs) {
            this.canPlay = false;
            
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
            
            this.showMessage(`¡Felicidades! Completaste el juego en ${this.moves} movimientos y ${this.timer} segundos.`, '#4ECDC4');
            
            // Animación de celebración
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.classList.add('celebrate');
            });
            
            setTimeout(() => {
                cards.forEach(card => card.classList.remove('celebrate'));
            }, 2000);
        }
    }
    
    updateDisplay() {
        this.updateMovesDisplay();
        this.updatePairsDisplay();
        this.updateTimerDisplay('00:00');
    }
    
    updateMovesDisplay() {
        if (this.movesElement && this.movesElement.querySelector('span')) {
            this.movesElement.querySelector('span').textContent = this.moves;
        }
    }
    
    updatePairsDisplay() {
        if (this.pairsElement && this.pairsElement.querySelector('span')) {
            this.pairsElement.querySelector('span').textContent = `${this.matchedPairs}/${this.totalPairs}`;
        }
    }
    
    updateTimerDisplay(time) {
        if (this.timerElement && this.timerElement.querySelector('span')) {
            this.timerElement.querySelector('span').textContent = time;
        }
    }
    
    showMessage(text, color) {
        this.messageElement.textContent = text;
        this.messageElement.style.color = color;
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});