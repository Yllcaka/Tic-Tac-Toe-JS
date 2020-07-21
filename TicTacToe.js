const player = function (name, sign) {
    let score = 0;
    const showScore = () => score;
    const addScore = () => score++;
    const showName = () => name;
    const playerSign = () => sign;
    var printPlayer = () => console.log(`${name} with the sign: ${sign}`);
    return { playerSign, showName, showScore, addScore, printPlayer };
};


const players = Object();


const cacheDOM = (() => {
    let gameContainer = document.querySelector('#game-container');
    let boxesDOM = document.querySelectorAll('.box');
    let signsDOM = Array.from(boxesDOM).map(box => box.querySelector('.sign'));
    let formDOM = document.querySelector('form');
    let playDOM = document.querySelector('#play');
    let overDOM = document.querySelector('#over');
    let winnerDOM = document.querySelector('#winner');
    let playerScoreDOM = document.querySelector('.player-score');
    let player1DOM = document.querySelector('#player1');
    let player2DOM = document.querySelector('#player2');
    let replayDOM = document.createElement('button');
    let playerScoreSpanDOM;

    replayDOM.textContent = "Replay";
    const playerInput = (first = true) => {
        let setPlayerNameDOM = document.querySelector('.set-player-name');
        let div = document.createElement('div');
        let playerInput = document.createElement('input');
        let playerAddButton = document.createElement('button');
        let playerInputLabel = document.createElement('label');
        let playButton = document.createElement('button');
        let playerText = 'Player';

        let nr = first ? 1 : 2;
        div.setAttribute('class', "set-player-name")
        playerInput.setAttribute('name', playerText);
        playButton.setAttribute('id', 'play');
        playButton.textContent = "Play";
        playButton.addEventListener('click', () => {
            GameBoard.inputValue();
            overDOM.remove();
            playerScoreDOM.classList.add('visible');

            player1DOM.textContent = `${players.Player1.showName()} : `;
            let playerScoreSpan = document.createElement('span');
            playerScoreSpan.classList.add('player-score-span');
            player1DOM.textContent = `${players.Player1.showName()} : `;
            playerScoreSpan.textContent = players.Player1.showScore();
            player1DOM.appendChild(playerScoreSpan);
            // console.log("AAAAAA");

            player2DOM.textContent = `${players.Player2.showName()} : `;
            playerScoreSpan = document.createElement('span');
            playerScoreSpan.classList.add('player-score-span');
            player2DOM.textContent = `${players.Player2.showName()} : `;
            playerScoreSpan.textContent = players.Player2.showScore();
            player2DOM.appendChild(playerScoreSpan);
            playerScoreSpanDOM = document.querySelectorAll('.player-score-span');
            console.log(playerScoreSpanDOM);
        })
        playerInputLabel.htmlFor = playerText;
        playerInputLabel.textContent = `${playerText} ${nr}: `;
        playerAddButton.textContent = `Add ${playerText} ${nr}`;


        playerAddButton.addEventListener('click', () => {
            // playerInput(false);
            let sign = first ? "X" : "O";
            players[playerText + nr] = player(playerInput.value, sign);
            Object.entries(players).forEach(element => {
                [key, value] = element;
                value.printPlayer();
            })
            div.remove();
            setPlayerNameDOM = document.querySelector('.set-player-name');
            if (setPlayerNameDOM == null) {
                overDOM.appendChild(playButton);

            }

        });

        div.appendChild(playerInputLabel);
        div.appendChild(playerInput);
        div.appendChild(playerAddButton);

        overDOM.appendChild(div);

    }
    const updateScore = () => {
        playerScoreSpanDOM.forEach((item, i) => {
            item.textContent = players[`Player${i + 1}`].showScore();
        });
    }




    return {
        boxesDOM, signsDOM, playDOM, formDOM,
        winnerDOM, replayDOM, playerInput, updateScore
    };
})();


const GameBoard = (function () {
    let currentPlayer;
    let boardValues = Array(9).fill("");
    const playerWon = (draw = false) => {

        let winnerDOM = cacheDOM.winnerDOM;
        winnerDOM.classList.add('visible');
        if (draw) {
            winnerDOM.textContent = "IT'S A DRAW";
        }
        else {
            currentPlayer.addScore();
            winnerDOM.textContent = currentPlayer.showName() + " WON!";
            cacheDOM.updateScore();
        }
        winnerDOM.appendChild(cacheDOM.replayDOM);
        cacheDOM.replayDOM.addEventListener('click', () => {
            boardValues = Array(9).fill("");
            GameBoard.render();
            winnerDOM.classList.remove('visible');
        })


    }
    const drawBoard = (item, index) => {

        item.textContent = boardValues[index];
    }
    const setPlayer = () => {
        if ((currentPlayer == players.Player2) || !currentPlayer) currentPlayer = players.Player1;
        else currentPlayer = players.Player2;
    }
    const inputValue = () => {
        cacheDOM.boxesDOM.forEach((box, index) => {
            box.addEventListener('click', () => {

                if (boardValues[index] == "") {
                    setPlayer();
                    boardValues[index] = currentPlayer.playerSign();
                    checkWinner();
                }

                GameBoard.render();
            })
        })
        return "X";
    };
    const checkWinner = () => {

        const checkFields = (array) => {
            return array.every(field => (field == array[0]) && array[0] != "");
        }


        let ticTacToeMatrix = [
            boardValues.slice(0, 3),
            boardValues.slice(3, 6),
            boardValues.slice(6, 9)
        ]

        let transposed = ticTacToeMatrix[0].map((_, colIndex) => {
            return ticTacToeMatrix.map(row => row[colIndex])
        });
        let diagonal = (matrix) => [
            [matrix[0][0], matrix[1][1], matrix[2][2]],
            [matrix[2][0], matrix[1][1], matrix[0][2]]
        ];

        ticTacToeMatrix.forEach(row => {
            if (checkFields(row)) {
                playerWon();
                gameOver = true;
            }
        });
        transposed.forEach(row => {
            if (checkFields(row)) {
                playerWon();
                gameOver = true;
            }
        });
        diagonal(ticTacToeMatrix).forEach(row => {
            if (checkFields(row)) {
                playerWon();
                gameOver = true;
            }
        });
        if (boardValues.every(field => field != "")) {
            playerWon(draw = true);
        };


    }


    const render = () => {
        cacheDOM.signsDOM.forEach(drawBoard);
    }
    return { render, inputValue };

})();

const GamePrepare = (function () {
    const init = () => {

        GameBoard.render();

        cacheDOM.playerInput();
        cacheDOM.playerInput(false);

    }

    return { init }

})();




GamePrepare.init();