let game = new Phaser.Game(1500, 725, Phaser.AUTO, 'GameContainer', { preload: preload, create: create, update: update, render:render });

let cursors;
let assetLoader =  new AssetLoader();
let hexSize = new Point(40,40);
let origin = new Point(100,100);
let layout = new Layout(Layout.FLAT, hexSize, origin);
let hexMapGroup;
let hexMap;
let marker;

function preload() {
    assetLoader.loadAssets(game);
}

function create() {
    // A simple background for our game
    game.add.sprite(0, 0, 'background');

    game.stage.backgroundColor = '#374d5c';

    game.world.setBounds(-500, -500, 3000, 3000);

    cursors = game.input.keyboard.createCursorKeys();

    hexMapGroup = game.add.group();
    hexMap = HexMap.rectangleMap(12,7);
    hexMap.forEach(hex => {
        let centerOfHex = translator.hexToPixel(layout, hex);
        const addHex = addHexToScreen(game, centerOfHex);
        hexMapGroup.add(addHex);
    });
    hexMapGroup.x = origin.x;
    hexMapGroup.y = origin.y;

    marker = initializeHexMarker(game);
    hexMapGroup.add(marker);
    moveIndex = game.input.addMoveCallback(updateHexMarker, this);
    console.log('moveIndex: ' + moveIndex);

    const coordinateToPlaceUnit = translator.hexToPixel(layout, new Hex(10, 0));
    const unit = new Unit(
        game, coordinateToPlaceUnit.x, coordinateToPlaceUnit.y, assetLoader.validAssetNames.cube.tag);
    hexMapGroup.add(unit);

    game.input.onTap.add(() => {
        console.log('TAP');
        console.log((game.input.x-hexMapGroup.x)+','+(game.input.y-hexMapGroup.y));
        const tappedPoint = new Point(game.input.x-hexMapGroup.x, game.input.y-hexMapGroup.y);
        const tappedHex = Hex.roundHex(translator.pixelToHex(layout, tappedPoint));
        const newPoint = translator.hexToPixel(layout,tappedHex);
        unit.x = newPoint.x;
        unit.y = newPoint.y;
    });
}

function update() {
    if (cursors.up.isDown) hexMapGroup.y += 8;
    else if (cursors.down.isDown) hexMapGroup.y -= 8;
    if (cursors.left.isDown) hexMapGroup.x += 8;
    else if (cursors.right.isDown) hexMapGroup.x -= 8;
}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.text(game.input.x + ' x ' + game.input.y, 32, 20);

    const selectedHexPoint = new Point(game.input.x-hexMapGroup.x, game.input.y-hexMapGroup.y);
    const selectedHex = Hex.roundHex(translator.pixelToHex(layout, selectedHexPoint));
    game.debug.text('Hex '+selectedHex.x+', '+selectedHex.y, 200, 20);

    const selectedOffsetHex = OffsetCoordinate.hexToQOffset(OffsetCoordinate.ODD, selectedHex);
    game.debug.text('OffsetHex '+selectedOffsetHex.x+', '+selectedOffsetHex.y, 200, 40);

    game.debug.text('HG Mouse pos: '+(game.input.x-hexMapGroup.x)+', '+(game.input.y-hexMapGroup.y), 32, 120);
    game.debug.text('HexGridLoc: '+(hexMapGroup.x)+', '+(hexMapGroup.y), 32, 140);
    game.debug.text('MarkerLoc: '+(marker.x)+', '+(marker.y), 32, 160);
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
    const mousePosition = new Point(game.input.worldX-hexMapGroup.x, game.input.worldY-hexMapGroup.y);
    const hexPosition = translator.pixelToHex(layout, mousePosition);
    const centerOfHexAsPixel = translator.hexToPixel(layout, Hex.roundHex(hexPosition));
    marker.x = centerOfHexAsPixel.x;
    marker.y = centerOfHexAsPixel.y;
}