/**
 * Created by amram on 7/26/2017.
 */
var game = new Phaser.Game(1000, 650, Phaser.AUTO, 'GameContainer', { preload: preload, create: create, update: update });

//horizontal tile shaped level
var levelData=
    [
        [-1,-1,-1, 0, 0, 0, 0, 0, 0, 0,-1,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1],
        [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1],
        [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
        [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
        [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1,-1],
        [-1,-1,-1, 0, 0, 0, 0, 0, 0, 0,-1,-1,-1]
    ];

var hexTileHeight=52;
var hexTileWidth=61;

var hexGrid;
var infoText;

function preload() {
    game.load.image('background', 'assets/phaser.png');

}

function create() {
    // A simple background for our game
    game.add.sprite(0, 0, 'background');

    game.stage.backgroundColor = '#374d5c';
    levelData = transpose(levelData); // transpose for having the right shape
    createLevel();

    infoText = game.add.text(10, 30, 'hi');
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
}

function createLevel() {
    hexGrid = game.add.group();

    var verticalOffset = hexTileHeight;
    var horizontalOffset = hexTileWidth * 3/4;

    var startX;
    var startY;
    var startXInit = hexTileWidth/2;
    var startYInit = hexTileHeight/2;

    var hexTile;
    for (var i = 0; i < levelData.length; i++) {
        startX = startXInit;
        startY = 2 * startYInit + (i * verticalOffset);

        for (var j = 0; j < levelData[0].length; j++) {
            if(j % 2 !== 0) {
                startY = startY+startYInit;
            }
            else {
                startY = startY - startYInit;
            }

            if(levelData[i][j] !== -1) {
                hexTile= new HexTile(game, startX, startY, 'hex', true, i, j, levelData[i][j]);
                hexGrid.add(hexTile);

                if(levelData[i][j] !== 10) {
                    blankTiles++;
                }
            }

            startX += horizontalOffset;
        }

    }
    hexGrid.x=50;
    hexGrid.y=0;
}

function update() {

}

function transpose(array) {
    return Object.keys(array[0]).map(
        function (c) {
            return array.map(
                function (r) {
                    return r[c];
                }
            );
        }
    );
}