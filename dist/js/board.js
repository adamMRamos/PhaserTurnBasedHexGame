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

    this.addSpriteToBoard = function(sprite) {
        this.gamePiecesGroup.add(sprite);
    };

    this.selectGamePiece = function(worldX, worldY) {
        console.log('try to select UNIT');
        console.log('input x: '+worldX);
        console.log('input y: '+worldY);
        var candidateX = Math.floor((worldX - this.hexagonGroup.x)/this.sectorWidth);
        var candidateY = Math.floor((worldY - this.hexagonGroup.y)/this.sectorHeight);

        var deltaX = (game.input.worldX - this.hexagonGroup.x)%this.sectorWidth;
        var deltaY = (game.input.worldY - this.hexagonGroup.y)%this.sectorHeight;

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

        return getGamePiece(this.gamePiecesGroup, candidateX, candidateY);
    };

    this.placeSprite = function(sprite, posX, posY, verbose) {
        if (verbose) console.log('try to place UNIT on ('+posX+', '+posY+')');

        if (outOfBounds(posX, posY, this.xTiles, this.columns)) {
            if (verbose) console.log('The UNIT is out of bounds, hide the unit');
            sprite.visible = false;
        }
        else {
            sprite.visible = true;
            sprite.x = this.hexagonWidth*(3/4)*posX + this.hexagonWidth/2;
            sprite.y = this.hexagonHeight*posY;

            if (posX%2 === 0) sprite.y += this.hexagonHeight/2;
            else sprite.y += this.hexagonHeight;
        }
    };
};

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

function getGamePiece(gamePiecesGroup, xPos, yPos) {
    gamePiecesGroup.forEach((piece) => {
        if (piece.x === xPos && piece.y === yPos) return piece;
    });
}
