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

    moveToHex(hex) {
        const distance = Hex.hexDistance(this.hex, hex);
        if (distance <= this.maxMoves && distance <= this.availableMoves) {
            this.setHex(hex);
            this.availableMoves -= distance;
        }
    }

    canCollideWith(unitFrame) {
        return this.availableMoves > 0 && Hex.hexDistance(this.hex, unitFrame.hex);
    }
}