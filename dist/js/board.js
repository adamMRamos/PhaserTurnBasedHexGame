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

    this.selectGamePiece = function(worldX, worldY) {
        console.log('try to select UNIT');
        console.log('input x: '+worldX);
        console.log('input y: '+worldY);

        var candidatePosition = this.findBoardPosition(worldX, worldY);
        var boardCoordinates = translateBoardPostionToBoardCoordinates(
            candidatePosition.x, candidatePosition.y, this.hexagonWidth, this.hexagonHeight);

        return getGamePiece(this.gamePiecesGroup, boardCoordinates.x, boardCoordinates.y);
    };

    this.tryToMoveGamePiece = function (unitSprite, worldX, worldY) {
        var boardPosition = this.findBoardPosition(worldX, worldY);
        if (!outOfBounds(boardPosition.x, boardPosition.y, this.xTiles, this.columns))
            this.placeGamePieceOntoPosition(unitSprite, boardPosition.x, boardPosition.y);
    };

    this.placeGamePieceOntoPosition = function(unitSprite, boardPositionX, boardPositionY) {
        var boardCoordinates = translateBoardPostionToBoardCoordinates(
            boardPositionX, boardPositionY, this.hexagonWidth, this.hexagonHeight);
        var currentOccupant = getGamePiece(this.gamePiecesGroup, boardCoordinates.x, boardCoordinates.y);
        if (!currentOccupant) {
            console.log('the position isnt occupied');
            unitSprite.move(boardCoordinates.x, boardCoordinates.y);
        }
        else if (currentOccupant) {
            console.log('the position is occupied!!!');
            handleGamePieceCollision(this.gamePiecesGroup, unitSprite, currentOccupant);
        }
    };

    this.updateSpriteToBoardPosition = function(sprite, worldX, worldY) {
        var boardPosition = this.findBoardPosition(worldX, worldY);
        this.placeSpriteOnBoard(sprite, boardPosition.x, boardPosition.y);
    };

    this.findBoardPosition = function(worldX, worldY) {
        var boardXPosition = this.getBoardXPosition();
        var boardYPosition = this.getBoardYPosition();
        var candidateX = Math.floor((worldX - boardXPosition)/this.sectorWidth);
        var candidateY = Math.floor((worldY - boardYPosition)/this.sectorHeight);

        var deltaX = (worldX - boardXPosition) % this.sectorWidth;
        var deltaY = (worldY - boardYPosition) % this.sectorHeight;

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
        var boardCoordinates = translateBoardPostionToBoardCoordinates(
            boardPositionX, boardPositionY, this.hexagonWidth, this.hexagonHeight);

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
    var boardCoordinateX = hexagonWidth*(3/4)*boardPositionX + hexagonWidth/2;
    var boardCoordinateY = hexagonHeight*boardPositionY;

    if (boardPositionX%2 === 0) boardCoordinateY += hexagonHeight/2;
    else boardCoordinateY += hexagonHeight;

    return {x:boardCoordinateX, y:boardCoordinateY};
}

function outOfBounds(posX, posY, xTiles, columns) {
    return posX < 0 || posY < 0 || posX >= xTiles || posY > columns[posX%2] - 1;
}

function createHexagonGroup(phaserGame, gridSizeX, gridSizeY, hexagonWidth, hexagonHeight) {
    var hexagonGridGroup = phaserGame.add.group();

    for (var rowPos = 0; rowPos < gridSizeX/2; rowPos++) {

        for (var colPos = 0; colPos < gridSizeY; colPos++) {

            if (canPlaceHexagonTile(gridSizeX, rowPos, colPos)) {
                var hexagon = createHexagonTile(phaserGame, hexagonWidth, hexagonHeight, rowPos, colPos);
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
    var hexagonX = (hexagonWidth * rowPosition * 1.5) + (hexagonWidth/4*3) * (colPosition%2);
    var hexagonY = hexagonHeight * colPosition/2;
    var hexagon = phaserGame.add.sprite(hexagonX, hexagonY, 'hexagon');

    return hexagon;
}

function handleGamePieceCollision(gamePiecesGroup, attacker, defender) {
    if (attacker === defender) return;

    defender.updateHealth();
    if (defender.isDead()) {
        setTimeout(() => {
            gamePiecesGroup.remove(defender);
            defender.cleanUp();
        }, 250);
    }
}

function getGamePiece(gamePiecesGroup, boardCoordinateX, boardCoordinateY) {
    var gamePiece = null;
    gamePiecesGroup.forEach((piece) => {
        if (piece.x === boardCoordinateX && piece.y === boardCoordinateY) return gamePiece = piece;
    });
    return gamePiece;
}
