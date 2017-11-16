let game = new Phaser.Game(1500, 725, Phaser.AUTO, 'GameContainer', { preload: preload, create: create, update: update, render:render });

let assetLoader =  new AssetLoader();
let hexSize = new Point(40,40);
let origin = new Point(100,100);
let layout = new Layout(Layout.FLAT, hexSize, origin);
let hexMap;
let marker;

function preload() {
    assetLoader.loadAssets(game);
}

function create() {
    // A simple background for our game
    game.add.sprite(0, 0, 'background');

    game.stage.backgroundColor = '#374d5c';

    hexMap = HexMap.rectangleMap(12,7);
    hexMap.forEach(hex => {
        let centerOfHex = translator.hexToPixel(layout, hex);
        addHexToScreen(game, centerOfHex);
    });

    marker = initializeHexMarker(game);
    moveIndex = game.input.addMoveCallback(updateHexMarker, this);
    console.log('moveIndex: ' + moveIndex);
}

function update() { }

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.text(game.input.x + ' x ' + game.input.y, 32, 20);

    const selectedHex = Hex.roundHex(translator.pixelToHex(layout, new Point(game.input.x, game.input.y)));
    game.debug.text('Hex '+selectedHex.x+', '+selectedHex.y, 200, 20);

    const selectedOffsetHex = OffsetCoordinate.hexToQOffset(OffsetCoordinate.ODD, selectedHex);
    game.debug.text('OffsetHex '+selectedOffsetHex.x+', '+selectedOffsetHex.y, 200, 40);
}

function addHexToScreen(game, centerOfHex) {
    let hexSprite = game.add.sprite(
        centerOfHex.x, centerOfHex.y, assetLoader.validAssetNames.hexagon.tag);
    hexSprite.anchor.set(0.5);
}

function initializeHexMarker(game) {
    const marker = game.add.sprite(0,0, assetLoader.validAssetNames.hexMarker.tag);
    marker.anchor.setTo(0.5);
    marker.visible = false;

    return marker;
}

function updateHexMarker() {
    marker.visible = true;
    const mousePosition = new Point(game.input.worldX, game.input.worldY);
    const hexPosition = translator.pixelToHex(layout, mousePosition);
    const centerOfHexAsPixel = translator.hexToPixel(layout, Hex.roundHex(hexPosition));
    marker.x = centerOfHexAsPixel.x;
    marker.y = centerOfHexAsPixel.y;
}