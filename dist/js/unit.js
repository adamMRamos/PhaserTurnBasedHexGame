/**
 * Created by amram on 9/5/2017.
 */
Unit = function(game, x, y, unitImageTag) {

    Phaser.Sprite.call(this, game, x, y, unitImageTag);

    this.anchor.setTo(0.5, 0.5);

    this.maxHealth = 2;
    this.health = 2;
    this.actions = 1;

    var barConfig = {
        width: 32,
        height: 10,
        x: x,
        y: y,
        bg: {
            color: '#651828'
        },
        bar: {
            color: '#FEFF03'
        },
        animationDuration: 200,
        flipped: false
    };
    this.healthBar = new HealthBar(game, barConfig);
};

Unit.prototype = Object.create(Phaser.Sprite.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.move = function(x, y) {
    this.visible = true;
    this.x = x;
    this.y = y;
    this.healthBar.setPosition(this.x+140, this.y-30);
};

Unit.prototype.updateHealth = function() {
    this.health--;
    updateHealthBar(this);
};

Unit.prototype.isDead = function() {
    return this.health <= 0;
};

Unit.prototype.cleanUp = function() {
    this.healthBar.kill();
};

function updateHealthBar(unit) {
    var healthPercentage = (unit.health/unit.maxHealth)*100;
    unit.healthBar.setPercent(healthPercentage);
}
