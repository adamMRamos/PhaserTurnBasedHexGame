let game = new Phaser.Game(1500, 725, Phaser.AUTO, 'GameContainer', { preload: preload, create: create, update: update, render:render });

let cursors;
let currentPlayerIsPlayer1 = false;
let assetLoader =  new AssetLoader();
let hexSize = new Point(40,40);
let origin = new Point(100,100);
let layout = new Layout(Layout.FLAT, hexSize, origin);
let hexBoard;
let marker;
let hexBoardTranslator;
let slickUI;

function preload() {
    assetLoader.loadAssets(game);
    // You can use your own methods of making the plugin publicly available. Setting it as a global variable is the easiest solution.
    slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
    slickUI.load('assets/kenney.json'); // Use the path to your kenney.json. This is the file that defines your theme.
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

    const createTagTypeObject = (tag, type) => ({ tag:tag, type:type });
    const determineUnitTag = (type, team) => {
        let tagSuffix = '';
        switch (type) {
            case Unit.SQUARE: tagSuffix = 'cube'; break;
            case Unit.CIRCLE: tagSuffix = 'sphere'; break;
            case Unit.TRIANGLE: tagSuffix = 'triangle'; break;
        }
        return (team === 2 ? 'red_' : '') + tagSuffix
    };
    const determineUnitType = typeNum => {
        switch (typeNum) {
            case 0: return Unit.SQUARE;
            case 1: return Unit.CIRCLE;
            case 2: return Unit.TRIANGLE;
        }
    };
    const determineUnitTagAndType = (tagNum, team) => {
        const type = determineUnitType(tagNum);
        const tagString = determineUnitTag(type, team);
        console.log(tagString);
        return createTagTypeObject(assetLoader.validAssetNames[tagString].tag, type);
    };
    const spawnUnitOntoHex = (hex, unitAssetTag, unitType, team) => {
        const unit = new Unit(hexBoardTranslator, game, 0, 0, unitAssetTag, unitType, team);
        hexBoard.addUnit(unit);
        unit.setHex(hex, hexBoardTranslator);
    };
    let unitCounter = 0;
    player1SpawnHexes.forEach(hex => {
        const unitTagAndType = determineUnitTagAndType(unitCounter, 1);
        spawnUnitOntoHex(hex, unitTagAndType.tag, unitTagAndType.type, '1');
        unitCounter = (unitCounter+1)%3;
    });
    unitCounter = 0;
    player2SpawnHexes.forEach(hex => {
        const unitTagAndType = determineUnitTagAndType(unitCounter, 2);
        spawnUnitOntoHex(hex, unitTagAndType.tag, unitTagAndType.type, '2');
        unitCounter = (unitCounter+1)%3;
    });

    const panel = new SlickUI.Element.Panel(450, 8, 400, 75);

    slickUI.add(panel);
    const updateCurrentPlayer = () => currentPlayerIsPlayer1 = !currentPlayerIsPlayer1;
    const updateCurrentPlayerString = () => updateCurrentPlayer() ? '1' : '2';
    const playerString = 'Player: ';
    const getPlayerString = () => playerString+updateCurrentPlayerString();
    const playerTrack = new SlickUI.Element.Text(10, 0, getPlayerString());
    panel.add(playerTrack);

    let turnCounter = 0;
    const incrementTurn = () => ++turnCounter;
    const turnString = 'Turn: ';
    const updateCurrentTurnString = () => turnString+incrementTurn();
    const turnTrack = new SlickUI.Element.Text(10, 30, updateCurrentTurnString());
    panel.add(turnTrack);

    const endTurnAction = () => {
        console.log('End Turn');
        console.log('Next player: '+(currentPlayerIsPlayer1 ? '2' : '1'));
        hexBoard.refreshUnits(currentPlayerIsPlayer1 ? '2' : '1');

        playerTrack.value = getPlayerString();
        turnTrack.value = updateCurrentTurnString();
    };

    const endTurnButton = new SlickUI.Element.Button(130,5,140,50);
    panel.add(endTurnButton);
    endTurnButton.events.onInputUp.add(endTurnAction);
    endTurnButton.add(new SlickUI.Element.Text(0,0, 'End Turn')).center();

    const enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(endTurnAction, this);

    let selectedUnit = null;
    game.input.onTap.add(() => {
        const hexBoardPosition = hexBoard.currentPosition();
        console.log('TAP');
        console.log((game.input.x-hexBoardPosition.x)+','+(game.input.y-hexBoardPosition.y));
        if (!selectedUnit)
            selectedUnit = hexBoard.findTopUnitAtPosition(hexBoard.toBoardPosition(game.input.x, game.input.y));
        else {
            if (selectedUnit.team === (currentPlayerIsPlayer1 ? '1' : '2'))
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

    if (game.input.activePointer.withinGame) {
        game.input.enabled = true;
        game.stage.backgroundColor = '#374d5c';
    }
    else {
        game.input.enabled = false;
        game.stage.backgroundColor = '#731111';
    }
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