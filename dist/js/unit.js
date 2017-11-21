
class Unit extends Phaser.Sprite {
    constructor(game, x, y, unitImageTag) {
        super(game, x, y, unitImageTag);

        this.anchor.setTo(0.5, 0.5);
        this.maxMoves = 2;
    }
}
