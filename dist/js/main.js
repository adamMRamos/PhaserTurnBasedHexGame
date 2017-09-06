/**
 * Created by amram on 7/26/2017.
 */
var game = new Phaser.Game(1500, 725, Phaser.AUTO, 'GameContainer', { preload: preload, create: create, update: update, render:render });
var cursors;
var size = new Phaser.Rectangle();

var hexagonWidth = 80;
var hexagonHeight = 70;
var sectorWidth = hexagonWidth*3/4;
var sectorHeight = hexagonHeight;
var gradient = (hexagonWidth/4)/(hexagonHeight/2);

var gridSizeX = 20;
var gridSizeY = 20;
var columns = [Math.ceil(gridSizeY/2),Math.floor(gridSizeY/2)];

console.log('columns: '+JSON.stringify(columns));

var moveIndex;
var marker;
var unit;
var circle;
var triangle;
var hexagonGroup;

var zooming = false;
var zoomAmount = 0.005;

var validAssetNames         =   {};
validAssetNames.background  =   {tag:'background', path:'phaser'};
validAssetNames.hexagon     =   {tag:'hexagon', path:'dirt2'};
validAssetNames.marker      =   {tag:'marker', path:'marker'};
validAssetNames.hexMarker   =   {tag:'hexMarker', path:'hexMarker'};
validAssetNames.cube        =   {tag:'cube', path:'cube'};
validAssetNames.redCube     =   {tag:'redCube', path:'redCube'};
validAssetNames.diamond     =   {tag:'diamond', path:'diamond'};
validAssetNames.sphere      =   {tag:'sphere', path:'sphere'};
validAssetNames.triangle    =   {tag:'triangle', path:'triangle'};

function preload() {
    Object.keys(validAssetNames).forEach((key) => {
        console.log('key: '+JSON.stringify(key));
        var asset = validAssetNames[key];
        game.load.image(asset.tag, 'assets/'+asset.path+'.png');
    });
}

function create() {
    // A simple background for our game
    game.add.sprite(0, 0, 'background');

    game.stage.backgroundColor = '#374d5c';

    game.world.setBounds(-500, -500, 3000, 3000);

    size.setTo(-500, -500, 3000, 3000);

    cursors = game.input.keyboard.createCursorKeys();

    board = new Board(game, gridSizeX, gridSizeY);

    //unit = createUnit(game, validAssetNames.cube.tag);
    unit = new Unit(game, 100, 50, validAssetNames.cube.tag);
    board.addSpriteToBoard(unit);
    board.placeGamePieceOntoPosition(unit, 0, 0);

    //var enemyUnit = createUnit(game, validAssetNames.redCube.tag);
    var enemyUnit = new Unit(game, 100, 50, validAssetNames.redCube.tag);
    board.addSpriteToBoard(enemyUnit);
    board.placeGamePieceOntoPosition(enemyUnit, 1, 1);

    var currentSelectedUnit = null;
    game.input.onTap.add(() => {
        currentSelectedUnit = tryToSelectOrMoveAUnit(currentSelectedUnit);
    });

    marker = createMarker(game);
    board.addSpriteToBoardOverlay(marker);
    moveIndex = game.input.addMoveCallback(updateMarkerToNewHexPosition, this);
    console.log('moveIndex: ' + moveIndex);
}

function createMarker(phaserGame) {
    var marker = phaserGame.add.sprite(0,0,validAssetNames.hexMarker.tag);
    marker.anchor.setTo(0.5);
    marker.visible = false;

    return marker;
}

function tryToSelectOrMoveAUnit(currentSelectedUnit) {
    var worldX = game.input.worldX;
    var worldY = game.input.worldY;
    console.log('TAP');
    if (!currentSelectedUnit) {
        console.log('current piece is null, try to select one from the game');
        return board.selectGamePiece(worldX, worldY);
    }
    else {
        console.log('we have a piece, try to place the piece onto the board');
        board.tryToMoveGamePiece(currentSelectedUnit, worldX, worldY);
        return null;
    }
}

function updateMarkerToNewHexPosition() {
    board.updateSpriteToBoardPosition(marker, game.input.worldX, game.input.worldY);
}

function update() {
    tryToZoom();

    if (cursors.up.isDown) game.camera.y -= 8;
    else if (cursors.down.isDown) game.camera.y += 8;
    if (cursors.left.isDown) game.camera.x -= 8;
    else if (cursors.right.isDown) game.camera.x += 8;
}

function tryToZoom() {
    if (game.input.keyboard.isDown(Phaser.KeyCode.Z)) {
        console.log('Z is pressed');
        zooming = true;
        zoomAmount = -0.005;
    }
    else if (game.input.keyboard.isDown(Phaser.KeyCode.X)) {
        console.log('X is pressed');
        zooming = true;
        zoomAmount = 0.005;
    }
    else zooming = false;

    if (zooming) {
        game.camera.scale.x += zoomAmount;
        game.camera.scale.y += zoomAmount;

        game.camera.bounds.x = size.x * game.camera.scale.x;
        game.camera.bounds.y = size.y * game.camera.scale.y;
        game.camera.bounds.width = size.width * game.camera.scale.x;
        game.camera.bounds.height = size.height * game.camera.scale.y;
    }
}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
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


//horizontal tile shaped level
var levelData =
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