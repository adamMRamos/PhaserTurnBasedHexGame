class UnitFrame {
    constructor(hex, maxMoves, maxActions) {
        this.hex = hex;
        this.maxMoves = maxMoves;
        this.maxActions = maxActions;
        this.availableMoves = this.maxMoves;
        this.availableActions = maxActions;
    }

    setHex(hex) {
        this.hex = hex;
    }

    moveToHexAtPosition(position, hexBoardTranslator) {
        const hexToMoveTo = hexBoardTranslator.pixelToHex(position);
        this.moveToHex(hexToMoveTo);
    }

    moveToHex(hex, distance) {
        if (distance && distance <= this.maxMoves && distance <= this.availableMoves) {
            this.setHex(hex);
            this.availableMoves -= distance;
        }
    }

    hasActionsLeft() {
        return this.availableMoves > 0 && this.availableActions > 0;
    }

    resetMoves() {
        this.availableMoves = this.maxMoves;
    }

    resetActions() {
        this.availableActions = this.maxActions;
    }
}