let game = new Phaser.Game(1500, 725, Phaser.AUTO, 'GameContainer', { preload: preload, create: create, update: update, render:render });
let cursors;
let size = new Phaser.Rectangle();

let graphics;

let assetLoader =  new AssetLoader();
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

    let size = new Point(40,40);
    let origin = new Point(300,300);
    let layout = new Layout(Layout.FLAT, size, origin);
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

    let centerHexCorners = translator.hexCorners(layout, new Hex(0,0));
    let hexPoints = [];
    centerHexCorners.forEach((corner) => {
        hexPoints.push(new Phaser.Point(corner.x, corner.y));
    });
    let centerPolygon = new Phaser.Polygon(hexPoints);

    let hexCorners = translator.hexCorners(layout, new Hex(3,0));
    hexPoints = [];
    hexCorners.forEach((corner) => {
        hexPoints.push(new Phaser.Point(corner.x, corner.y));
    });
    polygon = new Phaser.Polygon(hexPoints);

    let hexCorners2 = translator.hexCorners(layout, new Hex(2,0));
    hexPoints = [];
    hexCorners2.forEach((corner) => {
        hexPoints.push(new Phaser.Point(corner.x, corner.y));
    });
    let polygon2 = new Phaser.Polygon(hexPoints);

    graphics = game.add.graphics(0,0);
    graphics.beginFill(0xFF33ff);
    graphics.drawPolygon(polygon.points);
    graphics.endFill();

    graphics.beginFill(0xFF3311);
    graphics.drawPolygon(polygon2.points);
    graphics.endFill();

    graphics.beginFill(0xAA4411);
    graphics.drawPolygon(centerPolygon.points);
    graphics.endFill();

    centerOfHex = translator.hexToPixel(layout, new Hex(0,0));
    console.log(centerOfHex);
    game.add.sprite(centerOfHex.x-40, centerOfHex.y-(Math.sqrt(3)/2 * 40), 'hexMarker');

    let hexFraction = new Hex(1.1785, 3.56);
    let roundedHex = Hex.roundHex(hexFraction);
    console.log(hexFraction.getInfo());
    console.log(roundedHex.getInfo());
}

function update() { }

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.text(game.input.x + ' x ' + game.input.y, 32, 20);
}

function addHexToScreen(game, centerOfHex, hexSize) {
    game.add.sprite(centerOfHex.x-hexSize, centerOfHex.y-(Math.sqrt(3)/2 * hexSize), 'hexagon');
}