/**
 * Created by amram on 8/1/2017.
 */

Board = function (game, gridSizeX, gridSizeY) {
    this.xTiles = gridSizeX;
    this.yTiles = gridSizeY;
    this.columns = [Math.ceil(this.yTiles/2), Math.floor(this.yTiles/2)];
    this.hexagonGroup = null;
    this.gamePiecesGroup = null;
    this.hexagonWidth = 80;
    this.hexagonHeight = 70;
    this.sectorWidth = this.hexagonWidth*3/4;
    this.sectorHeight = this.hexagonHeight;
    this.gradient = (this.hexagonWidth/4)/(this.hexagonHeight/2);

    this.hexagonGroup = createHexagonGroup(game, this.xTiles, this.yTiles, this.hexagonWidth, this.hexagonHeight);
    setHexagonGroupPosition(this.hexagonGroup, game.height, game.width, this.hexagonHeight, this.hexagonWidth, this.yTiles, this.xTiles);
    this.gamePiecesGroup = game.add.group();
    this.hexagonGroup.add(this.gamePiecesGroup);

    this.addSpriteToBoardOverlay = function(sprite) {
        this.hexagonGroup.add(sprite);
    };

    this.addSpriteToBoard = function(sprite) {
        this.gamePiecesGroup.add(sprite);
    };

    this.getBoardXPosition = function() {
        return this.hexagonGroup.x;
    };

    this.getBoardYPosition = function() {
        return this.hexagonGroup.y;
    };

    this.refreshGamePieces = function() {
        this.gamePiecesGroup.forEach((piece) => {
            piece.refreshActions();
        });
    };

    this.selectGamePiece = function(worldX, worldY) {
        console.log('try to select UNIT');
        console.log('input x: '+worldX);
        console.log('input y: '+worldY);

        const candidatePosition = this.translateWorldCoordinatesToBoardPosition(worldX, worldY);

        const boardCoordinates = translateBoardPostionToBoardCoordinates(
            candidatePosition.x, candidatePosition.y, this.hexagonWidth, this.hexagonHeight);

        const boardPos = translateBoardCoordinatesToBoardPosition(
            boardCoordinates.x, boardCoordinates.y, this.hexagonWidth, this.hexagonHeight);

        console.log('Board pos: '+candidatePosition.x+', '+candidatePosition.y);
        console.log('Board pos translated: '+boardPos.x+', '+boardPos.y);

        return getGamePiece(this.gamePiecesGroup, boardCoordinates.x, boardCoordinates.y);
    };

    this.tryToMoveGamePiece = function (unitSprite, worldX, worldY) {
        const boardPosition = this.translateWorldCoordinatesToBoardPosition(worldX, worldY);

        if (!outOfBounds(boardPosition.x, boardPosition.y, this.xTiles, this.columns)) {
            const unitPosition = translateBoardCoordinatesToBoardPosition(
                unitSprite.x, unitSprite.y, this.hexagonWidth, this.hexagonHeight
            );

            console.log('current position: '+unitPosition.x+', '+unitPosition.y);
            console.log('destination: '+boardPosition.x+', '+boardPosition.y);
            const actionDistance = this.distanceBetweenTwoHexes(unitPosition, boardPosition);
            console.log('action Distance = '+actionDistance);

            if (actionDistance > unitSprite.actions)
                console.log('the position is too far away!!!');
            else {
                const boardCoordinates = translateBoardPostionToBoardCoordinates(
                    boardPosition.x, boardPosition.y, this.hexagonWidth, this.hexagonHeight
                );
                const currentOccupant = getGamePiece(this.gamePiecesGroup, boardCoordinates.x, boardCoordinates.y);
                if (!currentOccupant) {
                    console.log('the position isnt occupied');
                    this.placeGamePieceOntoTile(unitSprite, boardPosition);
                    unitSprite.updateActions(actionDistance);
                }
                else {
                    console.log('the position is occupied!!! unit will try to attack');
                    handleGamePieceCollision(this.gamePiecesGroup, unitSprite, currentOccupant, actionDistance);
                }
            }
        }
    };

    this.placeGamePieceOntoTile = function(unitSprite, tilePosition) {
        const boardCoordinates = translateBoardPostionToBoardCoordinates(
            tilePosition.x, tilePosition.y, this.hexagonWidth, this.hexagonHeight
        );

        unitSprite.move(boardCoordinates.x, boardCoordinates.y);
    };

    this.distanceBetweenTwoHexes = function(origin, destination) {
        const x1 = origin.x;
        const x2 = destination.x;
        const transfromY = (x,y) => {
            return y+Math.floor((x-1)/2);
        };
        const y1 = transfromY(x1, origin.y);
        const y2 = transfromY(x2, destination.y);

        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        const possibleDistance1 = Math.max(Math.abs(deltaX), Math.abs(deltaY));
        const possibleDistance2 = Math.abs(deltaX) + Math.abs(deltaY);

        const valuesHaveTheSameSign = (val1, val2) => {
            return (val1 >= 0 && val2 >=0) || (val1 < 0 && val2 < 0);
        };
        return valuesHaveTheSameSign(deltaX, deltaY) ? possibleDistance1 : possibleDistance2;
    };

    this.updateSpriteToBoardPosition = function(sprite, worldX, worldY) {
        const boardPosition = this.translateWorldCoordinatesToBoardPosition(worldX, worldY);
        this.placeSpriteOnBoard(sprite, boardPosition.x, boardPosition.y);
    };

    this.translateWorldCoordinatesToBoardPosition = function(worldX, worldY) {
        const boardXPosition = this.getBoardXPosition();
        const boardYPosition = this.getBoardYPosition();
        let candidateX = Math.floor((worldX - boardXPosition)/this.sectorWidth);
        let candidateY = Math.floor((worldY - boardYPosition)/this.sectorHeight);

        const deltaX = (worldX - boardXPosition) % this.sectorWidth;
        const deltaY = (worldY - boardYPosition) % this.sectorHeight;

        if (candidateX%2 === 0) {
            if (deltaX < ((this.hexagonWidth/4) - deltaY*this.gradient)) {
                candidateX--;
                candidateY--;
            }
            if (deltaX < ((-this.hexagonWidth/4) + deltaY*this.gradient)) candidateX--;
        }
        else {
            if (deltaY >= this.hexagonHeight/2){
                if (deltaX < (this.hexagonWidth/2 - deltaY*this.gradient)) candidateX--;
            }
            else {
                if (deltaX < deltaY*this.gradient) candidateX--;
                else candidateY--;
            }
        }
        return {x:candidateX, y:candidateY};
    };

    this.placeSpriteOnBoard = function(sprite, boardPositionX, boardPositionY, verbose) {
        if (verbose) console.log('try to place UNIT on ('+boardPositionX+', '+boardPositionY+')');
        const boardCoordinates = translateBoardPostionToBoardCoordinates(
            boardPositionX, boardPositionY, this.hexagonWidth, this.hexagonHeight
        );

        if (outOfBounds(boardPositionX, boardPositionY, this.xTiles, this.columns)) {
            if (verbose) console.log('The UNIT is out of bounds, hide the unit');
            sprite.visible = false;
        }
        else {
            sprite.visible = true;
            sprite.x = boardCoordinates.x;
            sprite.y = boardCoordinates.y;
        }
    };
};

function translateBoardPostionToBoardCoordinates(boardPositionX, boardPositionY, hexagonWidth, hexagonHeight) {
    let boardCoordinateX = hexagonWidth*(3/4)*boardPositionX + hexagonWidth/2;
    let boardCoordinateY = hexagonHeight*boardPositionY;

    if (boardPositionX%2 === 0) boardCoordinateY += hexagonHeight/2;
    else boardCoordinateY += hexagonHeight;

    return {x:boardCoordinateX, y:boardCoordinateY};
}

function outOfBounds(posX, posY, xTiles, columns) {
    return posX < 0 || posY < 0 || posX >= xTiles || posY > columns[posX%2] - 1;
}

function translateBoardCoordinatesToBoardPosition(boardCoordinateX, boardCoordinateY, hexWidth, hexHeight) {
    const boardPositionX = (boardCoordinateX - (hexWidth/2)) / (hexWidth*(3/4));
    const boardPositionY = Math.ceil((boardCoordinateY/hexHeight)-1);

    return {x:boardPositionX, y:boardPositionY};
}

function createHexagonGroup(phaserGame, gridSizeX, gridSizeY, hexagonWidth, hexagonHeight) {
    const hexagonGridGroup = phaserGame.add.group();

    for (let rowPos = 0; rowPos < gridSizeX/2; rowPos++) {

        for (let colPos = 0; colPos < gridSizeY; colPos++) {

            if (canPlaceHexagonTile(gridSizeX, rowPos, colPos)) {
                const hexagon = createHexagonTile(phaserGame, hexagonWidth, hexagonHeight, rowPos, colPos);
                hexagonGridGroup.add(hexagon);
            }
        }
    }

    return hexagonGridGroup;
}

function setHexagonGroupPosition(hexagonGroup, gameHeight, gameWidth, hexagonHeight, hexagonWidth, gridSizeY, gridSizeX) {
    hexagonGroup.y = (gameHeight - hexagonHeight * Math.ceil(gridSizeY/2))/2;
    if (gridSizeY%2 === 0) {
        hexagonGroup.y -= hexagonHeight/4;
    }

    hexagonGroup.x = (gameWidth-Math.ceil(gridSizeX/2)*hexagonWidth-Math.floor(gridSizeX/2)*hexagonWidth/2)/2;
    if (gridSizeX%2 === 0) {
        hexagonGroup.x -= hexagonWidth/8;
    }
}

/**
 * if the amount of tiles across (the x axis) is even OR
 * the row position + 1 is still less than half the ammount of tiles across (the x axis) OR
 * the y position is even THEN...
 * we can create a tile OTHERWISE...
 * we can't create a tile.
 *
 * @param maximumTilesOnXAxis
 * @param rowPosition
 * @param colPosition
 * @returns {boolean}
 */
function canPlaceHexagonTile(maximumTilesOnXAxis, rowPosition, colPosition) {
    return maximumTilesOnXAxis%2 === 0 || rowPosition+1 < maximumTilesOnXAxis/2 || colPosition%2 === 0;
}

function createHexagonTile(phaserGame, hexagonWidth, hexagonHeight, rowPosition, colPosition) {
    const hexagonX = (hexagonWidth * rowPosition * 1.5) + (hexagonWidth/4*3) * (colPosition%2);
    const hexagonY = hexagonHeight * colPosition/2;

    return phaserGame.add.sprite(hexagonX, hexagonY, 'hexagon');
}

function handleGamePieceCollision(gamePiecesGroup, attacker, defender, distance) {
    if (attacker === defender || attacker.range < distance) return;

    attacker.useAttack();
    if (Math.random() <= attacker.attack)
        defender.updateHealth();
    if (defender.range >= distance && Math.random() <= defender.defense)
        attacker.updateHealth();

    if (defender.isDead()) removeUnit(gamePiecesGroup, defender);
    if (attacker.isDead()) removeUnit(gamePiecesGroup, attacker);
}

function removeUnit(gamePiecesGroup, unit) {
    setTimeout(() => {
        gamePiecesGroup.remove(unit);
        unit.cleanUp();
    }, 250);
}

function getGamePiece(gamePiecesGroup, boardCoordinateX, boardCoordinateY) {
    let gamePiece = null;
    gamePiecesGroup.forEach((piece) => {
        if (piece.x === boardCoordinateX && piece.y === boardCoordinateY) return gamePiece = piece;
    });
    return gamePiece;
}
