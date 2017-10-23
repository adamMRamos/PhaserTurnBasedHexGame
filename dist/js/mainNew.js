let game = new Phaser.Game(1500, 725, Phaser.AUTO, 'GameContainer', { preload: preload, create: create, update: update, render:render });
let cursors;
let gameSize = new Phaser.Rectangle();

let graphics;

let assetLoader =  new AssetLoader();
let size = new Point(40,40);
let origin = new Point(300,300);
let layout = new Layout(Layout.FLAT, size, origin);
let hex = new Hex(0,0);
let hex1 = new Hex(1,0);
let hex2 = new Hex(0,1);

let polygon;

function preload() {
    assetLoader.loadAssets(game);

    console.log('hex1 = ' + hex1.getInfo());
    console.log('hex2 = ' + hex2.getInfo());
    console.log(hex1.equals(hex2));

    let addedHex = Hex.addHexes(hex1, hex2);
    console.log('hex1 + hex2 = ' + addedHex.getInfo());

    let subedHex = Hex.subtractHexes(hex1, hex2);
    console.log('hex1 - hex2 = ' + subedHex.getInfo());

    let multipliedHex = Hex.multiplyHexes(hex1, 3);
    console.log('hex1 * 3 = ' + multipliedHex.getInfo());

    console.log('hex0 hex_length = ' + Hex.hexLength(hex));
    console.log('hex1 hex_length = ' + Hex.hexLength(hex1));
    console.log('hex1 + hex2 hex_length = ' + Hex.hexLength(addedHex));
    console.log('hex1 * 3 hex_length = ' + Hex.hexLength(multipliedHex));

    console.log('Distance from hex1 -> hex1 = ' + Hex.hexDistance(hex1, hex1));
    console.log('Distance from hex0 -> hex1 = ' + Hex.hexDistance(hex, hex1));
    console.log('Distance from hex0 -> hex3 = ' + Hex.hexDistance(hex, multipliedHex));

    let northHex = Hex.getHexDirection('north');
    let northHex2 = Hex.getHexDirection(0);
    console.log('North Hex: ' + northHex.getInfo());
    console.log('North Hex again: ' + northHex2.getInfo());

    let southNeighborOfMultipliedHex = Hex.hexNeighbor(multipliedHex, 'south');
    let southNeighborOfMultipliedHexAgain = Hex.hexNeighbor(multipliedHex, 3);
    console.log('South neighbor of (hex1 * 3): ' + southNeighborOfMultipliedHex.getInfo());
    console.log('South neighbor again of (hex1 * 3): ' + southNeighborOfMultipliedHexAgain.getInfo());
}

function create() {
    // A simple background for our game
    game.add.sprite(0, 0, 'background');

    game.stage.backgroundColor = '#374d5c';

    let centerOfHex = translator.hexToPixel(layout, new Hex(0,0));
    console.log(centerOfHex);
    addHexToScreen(game, centerOfHex, 40);

    centerOfHex = translator.hexToPixel(layout, Hex.getHexDirection('north'));
    console.log(centerOfHex);
    addHexToScreen(game, centerOfHex, 40);

    centerOfHex = translator.hexToPixel(layout, Hex.getHexDirection('south'));
    console.log(centerOfHex);
    addHexToScreen(game, centerOfHex, 40);

    centerOfHex = translator.hexToPixel(layout, Hex.getHexDirection('northEast'));
    console.log(centerOfHex);
    addHexToScreen(game, centerOfHex, 40);

    centerOfHex = translator.hexToPixel(layout, Hex.getHexDirection('southEast'));
    console.log(centerOfHex);
    addHexToScreen(game, centerOfHex, 40);

    let centerPolygon = createPhaserPolygon(new Hex(0,0), layout);
    polygon = createPhaserPolygon(new Hex(3,0), layout);
    let polygon2 = createPhaserPolygon(new Hex(2,0), layout);
    let polygon3 = createPhaserPolygon(new Hex(4,-1), layout);
    let polygon4 = createPhaserPolygon(new Hex(0,-4), layout);

    graphics = game.add.graphics(0,0);
    drawPolygon(graphics, polygon, 0xFF33ff);
    drawPolygon(graphics, polygon2, 0xFF3311);
    drawPolygon(graphics, centerPolygon, 0xAA4411);
    drawPolygon(graphics, polygon3, 0x9966CC);
    drawPolygon(graphics, polygon4, 0x3FAE9F);

    centerOfHex = translator.hexToPixel(layout, new Hex(0,0));
    console.log(centerOfHex);
    game.add.sprite(centerOfHex.x-40, centerOfHex.y-(Math.sqrt(3)/2 * 40), 'hexMarker');

    let hexFraction = new Hex(1.1785, 3.56);
    let roundedHex = Hex.roundHex(hexFraction);
    console.log(hexFraction.getInfo());
    console.log(roundedHex.getInfo());

    const lineOfHexes = translator.hexLineDraw(new Hex(4,-1), new Hex(1,-2));
    lineOfHexes.forEach((hex) => {
        drawPolygon(graphics, createPhaserPolygon(hex, layout), 0xAA4411);
    });
}

function update() { }

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.text(game.input.x + ' x ' + game.input.y, 32, 20);
    const selectedHex = Hex.roundHex(translator.pixelToHex(layout, new Point(game.input.x, game.input.y)));
    game.debug.text('Hex '+selectedHex.x+', '+selectedHex.y, 200, 20);
}

function createPhaserPolygon(hex, layout) {
    let hexCorners = translator.hexCorners(layout, hex);
    let hexPoints = [];
    hexCorners.forEach((corner) => {
        hexPoints.push(new Phaser.Point(corner.x, corner.y));
    });

    return new Phaser.Polygon(hexPoints);
}

function drawPolygon(graphics, polygon, color) {
    graphics.beginFill(color);
    graphics.drawPolygon(polygon.points);
    graphics.endFill();
}

function addHexToScreen(game, centerOfHex, hexSize) {
    game.add.sprite(centerOfHex.x-hexSize, centerOfHex.y-(Math.sqrt(3)/2 * hexSize), 'hexagon');
}