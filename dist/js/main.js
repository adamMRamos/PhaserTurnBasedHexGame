/**
 * Created by amram on 7/26/2017.
 */
var game = new Phaser.Game(1500, 725, Phaser.AUTO, 'GameContainer', { preload: preload, create: create, update: update, render:render });
var cursors;
var size = new Phaser.Rectangle();

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

    //board = new Board(game, gridSizeX, gridSizeY);

    hexagonGroup = createHexagonGroup(game, gridSizeX, gridSizeY, hexagonWidth, hexagonHeight);
    setHexagonGroupPosition(hexagonGroup, game.height, game.width, hexagonHeight, hexagonWidth, gridSizeY, gridSizeX);

    marker = createMarker(game);
    hexagonGroup.add(marker);

    unit = createUnit(game, validAssetNames.cube);
    hexagonGroup.add(unit);

    placeUnit(unit, 3, 4);

    game.input.onTap.add(() => {
        console.log('TAP');
        selectUnit();
    });

    moveIndex = game.input.addMoveCallback(checkHex, this);
    console.log('moveIndex: ' + moveIndex);
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
    return maximumTilesOnXAxis%2 === 0 || rowPosition+1 < maximumTilesOnXAxis/2 || colPosition%2 === 0
}

function createHexagonTile(phaserGame, hexagonWidth, hexagonHeight, rowPosition, colPosition) {
    var hexagonX = (hexagonWidth * rowPosition * 1.5) + (hexagonWidth/4*3) * (colPosition%2);
    var hexagonY = hexagonHeight * colPosition/2;
    var hexagon = phaserGame.add.sprite(hexagonX, hexagonY, 'hexagon');

    return hexagon;
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

function createMarker(phaserGame) {
    var marker = phaserGame.add.sprite(0,0,validAssetNames.hexMarker.tag);
    marker.anchor.setTo(0.5);
    marker.visible = false;

    return marker;
}

function createUnit(phaserGame) {
    var unit = phaserGame.add.sprite(100,50,validAssetNames.cube.tag);
    unit.anchor.setTo(0.5);

    return unit;
}

function checkHex() {
    var candidateX = Math.floor((game.input.worldX-hexagonGroup.x)/sectorWidth);
    var candidateY = Math.floor((game.input.worldY-hexagonGroup.y)/sectorHeight);

    var deltaX = (game.input.worldX-hexagonGroup.x)%sectorWidth;
    var deltaY = (game.input.worldY-hexagonGroup.y)%sectorHeight;

    if (candidateX%2 === 0) {
        if (deltaX < ((hexagonWidth/4) - deltaY*gradient)) {
            candidateX--;
            candidateY--;
        }
        if (deltaX < ((-hexagonWidth/4) + deltaY*gradient)) {
            candidateX--;
        }
    }
    else {
        if (deltaY >= hexagonHeight/2) {
            if (deltaX < (hexagonWidth/2 - deltaY*gradient)) {
                candidateX--;
            }
        }
        else {
            if (deltaX < deltaY*gradient) {
                candidateX--;
            }
            else {
                candidateY--;
            }
        }
    }

    placeMarker(candidateX, candidateY);
}

function placeMarker(posX, posY) {
    if(posX < 0 || posY < 0 || posX >= gridSizeX || posY > columns[posX%2]-1) {
        marker.visible=false;
    }
    else{
        marker.visible=true;
        marker.x = hexagonWidth/4*3*posX+hexagonWidth/2;
        marker.y = hexagonHeight*posY;
        if(posX%2 === 0){
            marker.y += hexagonHeight/2;
        }
        else{
            marker.y += hexagonHeight;
        }
    }
}

function selectUnit() {
    console.log('try to select UNIT');
    console.log('input x: '+game.input.worldX);
    console.log('input y: '+game.input.worldY);
    var candidateX = Math.floor((game.input.worldX-hexagonGroup.x)/sectorWidth);
    var candidateY = Math.floor((game.input.worldY-hexagonGroup.y)/sectorHeight);

    var deltaX = (game.input.worldX-hexagonGroup.x)%sectorWidth;
    var deltaY = (game.input.worldY-hexagonGroup.y)%sectorHeight;

    if (candidateX%2 === 0) {
        if (deltaX < ((hexagonWidth/4) - deltaY*gradient)) {
            candidateX--;
            candidateY--;
        }
        if (deltaX < ((-hexagonWidth/4) + deltaY*gradient)) candidateX--;
    }
    else {
        if (deltaY >= hexagonHeight/2){
            if (deltaX < (hexagonWidth/2 - deltaY*gradient)) candidateX--;
        }
        else {
            if (deltaX < deltaY*gradient) candidateX--;
            else candidateY--;
        }
    }

    placeUnit(unit, candidateX, candidateY);
}

function placeUnit(unit, posX, posY, verbose) {
    if (verbose) console.log('try to place UNIT on ('+posX+', '+posY+')');
    if (outofBounds(posX, posY)) {
        if (verbose) console.log('The UNIT is out of bounds, hide the unit');
        unit.visible = false;
    }
    else {
        unit.visible = true;
        unit.x = hexagonWidth*(3/4)*posX + hexagonWidth/2;
        unit.y = hexagonHeight*posY;

        if (posX%2 === 0) unit.y += hexagonHeight/2;
        else unit.y += hexagonHeight;
    }
}

function outofBounds(posX, posY) {
    return posX < 0 || posY < 0 || posX >= gridSizeX || posY > columns[posX%2] - 1;
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