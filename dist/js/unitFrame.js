class UnitFrame {
    constructor(hex) {
        this.hex = hex;
        this.maxMoves = 2;
        this.availableMoves = this.maxMoves;
    }

    moveToHexAtPosition(position, hexBoardTranslator) {
        const hexToMoveTo = hexBoardTranslator.pixelToHex(position);
        this.moveToHex(hexToMoveTo);
    }

    moveToHex(hex) {
        const distance = Hex.hexDistance(this.hex, hex);
        if (distance <= this.maxMoves && distance <= this.availableMoves) {
            this.hex = hex;
            this.availableMoves -= distance;
        }
    }
}