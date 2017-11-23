
class Unit extends Phaser.Sprite {
    constructor(hexBoardTranslator, game, x, y, unitImageTag, team) {
        super(game, x, y, unitImageTag);

        this.anchor.setTo(0.5, 0.5);
        this.unitFrame = new UnitFrame(hexBoardTranslator.pixelToHex(new Point(x, y)), 5);
        this.team = team;
    }

    hex() {
        return this.unitFrame.hex;
    }
    
    movesLeft() {
        return this.unitFrame.availableMoves;
    }
    
    setHex(hex, hexBoardTranslator) {
        this.unitFrame.setHex(hex);
        reorientUnitToUnitFrameHex(this, this.unitFrame.hex, hexBoardTranslator);
    }

    moveToHex(hex, trueDistance, hexBoardTranslator) {
        console.log('Im going to move to: '+hex.getInfo());
        this.unitFrame.moveToHex(hex, trueDistance);
        reorientUnitToUnitFrameHex(this, this.unitFrame.hex, hexBoardTranslator);
    }

    canCollideWith(unit) {
        return this.team !== unit.team && this.unitFrame.hasActionsLeft();
    }

    collideWith(unit, attacker) {
        console.log('I collided with a unit, I am the '+(attacker ? 'attacker' : 'defender'));
        this.depleteAvailableActions();
        this.kill();
    }

    depleteAvailableActions() {
        this.unitFrame.availableMoves = 0;
    }
}

function reorientUnitToUnitFrameHex(unit, unitFrameHex, hexBoardTranslator) {
    const newPosition = hexBoardTranslator.hexToPixel(unitFrameHex);
    unit.x = newPosition.x;
    unit.y = newPosition.y;
}
