let game = new Phaser.Game(1500, 725, Phaser.AUTO, 'GameContainer', { preload: preload, create: create, update: update, render:render });
let cursors;
let size = new Phaser.Rectangle();

let assetLoader =  new AssetLoader();
let hex = new Hex(0,0);
let hex1 = new Hex(1,0);
let hex2 = new Hex(0,1);

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
}

function update() { }

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
}