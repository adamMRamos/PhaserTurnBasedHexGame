
class HexBoardTranslator {
    constructor(layout) {
        this.layout = layout;
    }

    pixelToHex(point) {
        return Hex.roundHex(translator.pixelToHex(this.layout, point));
    }

    hexToPixel(hex) {
        return translator.hexToPixel(this.layout, hex);
    }
}