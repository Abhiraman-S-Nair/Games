// Initialize game variables
let currentPlayer = 'X';
let gameOver = false;

// Game board representation
let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

// Function to handle cell click
function cellClicked(row, col) {
    if (!gameOver && board[row][col] === '') {
        board[row][col] = currentPlayer;
        renderBoard();
        if (checkWin(currentPlayer)) {
            gameOver = true;
            document.getElementById('status').innerText = currentPlayer + ' wins!';
        } else if (checkDraw()) {
            gameOver = true;
            document.getElementById('status').innerText = 'It\'s a draw!';
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('status').innerText = currentPlayer + '\'s turn';
            if (currentPlayer === 'O') {
                makeAIMove();
            }
        }
    }
}

// Function to make AI move using Minimax algorithm
function makeAIMove() {
    let bestMove = minimax(board, currentPlayer);
    board[bestMove.row][bestMove.col] = 'O';
    renderBoard();
    if (checkWin('O')) {
        gameOver = true;
        document.getElementById('status').innerText = 'AI wins!';
    } else if (checkDraw()) {
        gameOver = true;
        document.getElementById('status').innerText = 'It\'s a draw!';
    } else {
        currentPlayer = 'X';
        document.getElementById('status').innerText = 'Your turn!';
    }
}

// Minimax algorithm function
function minimax(board, player) {
    // Base cases: check for terminal states (win, loss, draw)
    if (checkWin('X')) {
        return { score: -10 };
    } else if (checkWin('O')) {
        return { score: 10 };
    } else if (checkDraw()) {
        return { score: 0 };
    }

    // Initialize best move
    let bestMove = { row: -1, col: -1, score: player === 'X' ? Infinity : -Infinity };

    // Loop through all empty cells
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                // Make a move
                board[i][j] = player;
                // Recursively call minimax to simulate the game
                let score = minimax(board, player === 'X' ? 'O' : 'X').score;
                // Undo the move
                board[i][j] = '';
                // Update best move if necessary
                if ((player === 'X' && score < bestMove.score) || (player === 'O' && score > bestMove.score)) {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestMove.score = score;
                }
            }
        }
    }

    // Return the best move
    return bestMove;
}

// Function to check if there's a winner
function checkWin(player) {
    // Check rows, columns, and diagonals for a win
    for (let i = 0; i < 3; i++) {
        if (
            (board[i][0] === player && board[i][1] === player && board[i][2] === player) ||
            (board[0][i] === player && board[1][i] === player && board[2][i] === player)
        ) {
            return true;
        }
    }
    if (
        (board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
        (board[0][2] === player && board[1][1] === player && board[2][0] === player)
    ) {
        return true;
    }
    return false;
}

// Function to check for a draw
function checkDraw() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                return false;
            }
        }
    }
    return true;
}

// Function to reset the game
function reset() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    currentPlayer = 'X';
    gameOver = false;
    renderBoard();
    document.getElementById('status').innerText = 'Your turn!';
}

// Function to render the game board
function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.textContent = cell;
            cellElement.addEventListener('click', () => cellClicked(rowIndex, colIndex));
            boardElement.appendChild(cellElement);
        });
    });
}

// Initial render
renderBoard();
