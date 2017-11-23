class UnitFrame {
    constructor(hex, maxMoves) {
        this.hex = hex;
        this.maxMoves = maxMoves;
        this.availableMoves = this.maxMoves;
    }

    setHex(hex) {
        this.hex = hex;
    }

    moveToHexAtPosition(position, hexBoardTranslator) {
        const hexToMoveTo = hexBoardTranslator.pixelToHex(position);
        this.moveToHex(hexToMoveTo);
    }

    moveToHex(hex, distance) {
        //const distance = Hex.hexDistance(this.hex, hex);
        if (distance && distance <= this.maxMoves && distance <= this.availableMoves) {
            this.setHex(hex);
            this.availableMoves -= distance;
        }
    }

    hasActionsLeft() {
        return this.availableMoves > 0;
    }
}