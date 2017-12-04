
class Unit extends Phaser.Sprite {
    static get SQUARE() { return 'square' }
    static get CIRCLE() { return 'circle' }
    static get TRIANGLE() { return 'triangle' }

    constructor(hexBoardTranslator, game, x, y, unitImageTag, type, team) {
        super(game, x, y, unitImageTag);

        this.anchor.setTo(0.5, 0.5);
        this.unitFrame = new UnitFrame(hexBoardTranslator.pixelToHex(new Point(x, y)), 3, 1);
        this.type = type;
        this.team = team;
    }

    hex() {
        return this.unitFrame.hex;
    }
    
    movesLeft() {
        return this.unitFrame.availableMoves;
    }

    restoreMovesAndActions() {
        this.unitFrame.resetMoves();
        this.unitFrame.resetActions();
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
        console.log('I collided with a unit, I am the '+(attacker ? 'attacker' : 'defender')
            + ' and I am on team '+this.team);
        console.log('I am: '+this.type+' and my opponent is: '+unit.type);
        if (!attacker || !unit.isWeakAgainst(this.type)) this.kill();
        if (attacker) this.unitFrame.availableActions--;
    }

    depleteAvailableActions() {
        this.unitFrame.availableMoves = 0;
    }

    isWeakAgainst(type) {
        return (this.type === Unit.SQUARE && type === Unit.CIRCLE) ||
            (this.type === Unit.CIRCLE && type === Unit.TRIANGLE) ||
            (this.type === Unit.TRIANGLE && type === Unit.SQUARE);
    }
}

function reorientUnitToUnitFrameHex(unit, unitFrameHex, hexBoardTranslator) {
    const newPosition = hexBoardTranslator.hexToPixel(unitFrameHex);
    unit.x = newPosition.x;
    unit.y = newPosition.y;
}
