/**
 * Created by amram on 7/26/2017.
 */
let game = new Phaser.Game(1500, 725, Phaser.AUTO, 'GameContainer', { preload: preload, create: create, update: update, render:render });
let cursors;
let size = new Phaser.Rectangle();

let gridSizeX = 20;
let gridSizeY = 20;
let xHexes = gridSizeX;
let yHexes = Math.ceil(gridSizeY/2);
let columns = [Math.ceil(gridSizeY/2),Math.floor(gridSizeY/2)];

console.log('columns: '+JSON.stringify(columns));

let moveIndex;
let marker;
let unit;
let circle;
let triangle;
let hexagonGroup;

let zooming = false;
let zoomAmount = 0.005;

let validAssetNames         =   {};
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
    unit = new UnitOld(game, 100, 50, validAssetNames.cube.tag);
    board.addSpriteToBoard(unit);
    board.placeGamePieceOntoTile(unit, {x:0, y:0});

    //var enemyUnit = createUnit(game, validAssetNames.redCube.tag);
    let enemyUnit = new UnitOld(game, 100, 50, validAssetNames.redCube.tag);
    board.addSpriteToBoard(enemyUnit);
    board.placeGamePieceOntoTile(enemyUnit, {x:1, y:1});

    let currentSelectedUnit = null;
    game.input.onTap.add(() => {
        currentSelectedUnit = tryToSelectOrMoveAUnit(currentSelectedUnit);
    });

    marker = createMarker(game);
    board.addSpriteToBoardOverlay(marker);
    moveIndex = game.input.addMoveCallback(updateMarkerToNewHexPosition, this);
    console.log('moveIndex: ' + moveIndex);
}

function createMarker(phaserGame) {
    const marker = phaserGame.add.sprite(0,0,validAssetNames.hexMarker.tag);
    marker.anchor.setTo(0.5);
    marker.visible = false;

    return marker;
}

function tryToSelectOrMoveAUnit(currentSelectedUnit) {
    const worldX = game.input.worldX;
    const worldY = game.input.worldY;
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
    refreshBoard();
    tryToZoom();

    if (cursors.up.isDown) game.camera.y -= 8;
    else if (cursors.down.isDown) game.camera.y += 8;
    if (cursors.left.isDown) game.camera.x -= 8;
    else if (cursors.right.isDown) game.camera.x += 8;
}

function refreshBoard() {
    if (game.input.keyboard.isDown(Phaser.KeyCode.ENTER)) {
        console.log('PRESSING ENTER');
        board.refreshGamePieces();
    }
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
let levelData =
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