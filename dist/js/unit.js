
class Unit extends Phaser.Sprite {
    constructor(hexBoardTranslator, game, x, y, unitImageTag) {
        super(game, x, y, unitImageTag);

        this.anchor.setTo(0.5, 0.5);
        this.unitFrame = new UnitFrame(hexBoardTranslator.pixelToHex(new Point(x, y)), 5);
    }

    setHex(hex, hexBoardTranslator) {
        this.unitFrame.setHex(hex);
        reorientUnitToUnitFrameHex(this, this.unitFrame.hex, hexBoardTranslator);
    }

    moveToHex(hex, hexBoardTranslator) {
        this.unitFrame.moveToHex(hex);
        reorientUnitToUnitFrameHex(this, this.unitFrame.hex, hexBoardTranslator);
    }
}

function reorientUnitToUnitFrameHex(unit, unitFrameHex, hexBoardTranslator) {
    const newPosition = hexBoardTranslator.hexToPixel(unitFrameHex);
    unit.x = newPosition.x;
    unit.y = newPosition.y;
}
