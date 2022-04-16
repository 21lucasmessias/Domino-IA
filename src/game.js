const generateRandomNumbers = (randNumbersArray) => {
    randNumbersArray[0] = Math.floor(Math.random() * 12);
    randNumbersArray[1] = Math.floor(Math.random() * 12);
    randNumbersArray[2] = Math.floor(Math.random() * 12);
    randNumbersArray[3] = Math.floor(Math.random() * 12);

    return randNumbersArray;
};

const piecesInitiazation = () => {
    var firstPlayerPieces = [];
    var secondPlayerPieces = [];
    var basePieceArray = [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 50, 100, 200];

    var randNumbersArray = [0, 0, 0, 0];
    for (var i = 0; i < 12; i++) {
        randNumbersArray = generateRandomNumbers(randNumbersArray);

        var firstPlayerPieceObject = {
            left: basePieceArray[randNumbersArray[0]],
            right: basePieceArray[randNumbersArray[1]],
        };
        firstPlayerPieces[i] = firstPlayerPieceObject;
        var secondPlayerPieceObject = {
            left: basePieceArray[randNumbersArray[2]],
            right: basePieceArray[randNumbersArray[3]],
        };
        secondPlayerPieces[i] = secondPlayerPieceObject;
    }
    playersPiecesObject = {
        firstPlayerPieces: firstPlayerPieces,
        secondPlayerPieces: secondPlayerPieces,
    };
    return playersPiecesObject;
};

const getHighestPiece = (playerPieces) => {
    var playerHighestPiece = null;
    var playerHighestValuePiece = 0;
    playerPieces.forEach((piece) => {
        if (piece.left === piece.right) {
            // se é uma peça espelhada
            var currentPieceValue = piece.left + piece.right;
            if (!playerHighestPiece)
                playerHighestPiece = { ...playerHighestPiece, piece };
            //se nao existia peça espelhada antes
            else {
                //se existia peca espelhada antes
                prevHighestPieceValue =
                    playerHighestPiece.left + playerHighestPiece.right;
                if (currentPieceValue > prevHighestPieceValue)
                    //se o valor da peca espelhada atual é maior que a anterior
                    playerHighestPiece = piece;
            }
            //	playerHighestPiece = { ...playerHighestPiece, piece };
        } else {
            //se nao é uma peça espelhada
            var currentPieceValue = piece.left + piece.right;
            if (currentPieceValue > playerHighestValuePiece)
                //se a peca atual é maior que a anterior
                playerHighestValuePiece = currentPieceValue;
        }
    });
    return { playerHighestPiece, playerHighestValuePiece };
};

const getStartingPlayer = (playersPieces) => {
    const firstPlayerHighestPieces = getHighestPiece(
        playersPieces.firstPlayerPieces
    );

    const secondPlayerHighestPieces = getHighestPiece(
        playersPieces.secondPlayerPieces
    );
    console.log(playersPieces.firstPlayerPieces, firstPlayerHighestPieces);
    console.log('===================');
    console.log(playersPieces.secondPlayerPieces, secondPlayerHighestPieces);

    if (
        !firstPlayerHighestPieces.playerHighestPiece &&
        !secondPlayerHighestPieces.playerHighestPiece
    ) {
        //se nenhum tem carta espelhada
        if (
            firstPlayerHighestPieces.playerHighestValuePiece >
            secondPlayerHighestPieces.playerHighestValuePiece
        )
            //se o player 1 tem a peça maior no geral
            return 1;
        return 2;
    }
};

const main = () => {
    const playersPieces = piecesInitiazation();
    const startingPlayer = getStartingPlayer(playersPieces);
};

main();
