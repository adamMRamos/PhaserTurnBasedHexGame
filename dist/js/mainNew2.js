let game = new Phaser.Game(1500, 725, Phaser.AUTO, 'GameContainer', { preload: preload, create: create, update: update, render:render });

let cursors;
let assetLoader =  new AssetLoader();
let hexSize = new Point(40,40);
let origin = new Point(100,100);
let layout = new Layout(Layout.FLAT, hexSize, origin);
let hexBoard;
let marker;
let hexBoardTranslator;

function preload() {
    assetLoader.loadAssets(game);
}

function create() {
    // A simple background for our game
    game.add.sprite(0, 0, 'background');

    game.stage.backgroundColor = '#374d5c';

    game.world.setBounds(-500, -500, 3000, 3000);

    cursors = game.input.keyboard.createCursorKeys();

    hexBoardTranslator = new HexBoardTranslator(layout);
    hexBoard = new HexBoard(createHexMapAndHexGroup(12, 7), origin);

    marker = initializeHexMarker(game);
    hexBoard.addObjectAtHex(marker, new Hex(0,0));
    moveIndex = game.input.addMoveCallback(updateHexMarker, this);
    console.log('moveIndex: ' + moveIndex);

    const player1SpawnHexes = Hex.radiusOfHexes(new Hex(10,0), 1);
    const player2SpawnHexes = Hex.radiusOfHexes(new Hex(2,0), 1);

    const spawnUnitOntoHex = (hex, unitAssetTag, team) => {
        const unit = new Unit(hexBoardTranslator, game, 0, 0, unitAssetTag, team);
        hexBoard.addUnit(unit);
        unit.setHex(hex, hexBoardTranslator);
    };
    player1SpawnHexes.forEach(hex => {
        spawnUnitOntoHex(hex, assetLoader.validAssetNames.cube.tag, '1');
    });
    player2SpawnHexes.forEach(hex => {
        spawnUnitOntoHex(hex, assetLoader.validAssetNames.redCube.tag, '2');
    });

    let selectedUnit = null;
    game.input.onTap.add(() => {
        const hexBoardPosition = hexBoard.currentPosition();
        console.log('TAP');
        console.log((game.input.x-hexBoardPosition.x)+','+(game.input.y-hexBoardPosition.y));
        if (!selectedUnit) {
            selectedUnit = hexBoard.findTopUnitAtPosition(
                hexBoard.toBoardPosition(game.input.x, game.input.y)
            );
        }
        else {
            hexBoard.tryToMoveUnitToHex(selectedUnit, hexBoard.toBoardHex(game.input.x, game.input.y));
            selectedUnit = null;
        }
    });
}

function update() {
    if (cursors.up.isDown) hexBoard.addXY(0, +8);
    else if (cursors.down.isDown) hexBoard.addXY(0, -8);
    if (cursors.left.isDown) hexBoard.addXY(+8, 0);
    else if (cursors.right.isDown) hexBoard.addXY(-8, 0);
}

function render() {
    const hexBoardPosition = hexBoard.currentPosition();
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.text(game.input.x + ' x ' + game.input.y, 32, 20);

    const selectedHexPoint = new Point(game.input.x-hexBoardPosition.x, game.input.y-hexBoardPosition.y);
    const selectedHex = Hex.roundHex(translator.pixelToHex(layout, selectedHexPoint));
    game.debug.text('Hex '+selectedHex.x+', '+selectedHex.y, 200, 20);

    const selectedOffsetHex = OffsetCoordinate.hexToQOffset(OffsetCoordinate.ODD, selectedHex);
    game.debug.text('OffsetHex '+selectedOffsetHex.x+', '+selectedOffsetHex.y, 200, 40);

    game.debug.text('HG Mouse pos: '+(game.input.x-hexBoardPosition.x)+', '+(game.input.y-hexBoardPosition.y), 32, 120);
    game.debug.text('Board pos: '+(hexBoardPosition.x)+', '+(hexBoardPosition.y), 32, 140);
    game.debug.text('MarkerLoc: '+(marker.x)+', '+(marker.y), 32, 160);
}

function createHexMapAndHexGroup(xTiles, yTiles) {
    const hexMapGroup = game.add.group();
    //const hexMap = HexMap.customHexagon(new Hex(10,0),1);
    const hexMap = HexMap.rectangleMap(xTiles, yTiles);
    hexMap.forEach(hex => {
        let centerOfHex = translator.hexToPixel(layout, hex);
        const addHex = addHexToScreen(game, centerOfHex);
        hexMapGroup.add(addHex);
    });
    const unitsLayer = game.add.group();
    hexMapGroup.add(unitsLayer);
    return {group: hexMapGroup, unitsGroup: unitsLayer, map: hexMap};
}

function addHexToScreen(game, centerOfHex) {
    let hexSprite = game.add.sprite(
        centerOfHex.x, centerOfHex.y, assetLoader.validAssetNames.hexagon.tag);
    hexSprite.anchor.set(0.5);
    return hexSprite;
}

function initializeHexMarker(game) {
    const marker = game.add.sprite(0,0, assetLoader.validAssetNames.hexMarker.tag);
    marker.anchor.setTo(0.5);
    marker.visible = false;

    return marker;
}

function updateHexMarker() {
    marker.visible = true;
    const centerOfHexAsPixel =
        translator.hexToPixel(layout, hexBoard.toBoardHex(game.input.worldX, game.input.worldY));
    marker.x = centerOfHexAsPixel.x;
    marker.y = centerOfHexAsPixel.y;
}