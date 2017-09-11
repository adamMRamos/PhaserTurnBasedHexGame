/**
 * Created by amram on 9/5/2017.
 */
Unit = function(game, x, y, unitImageTag) {

    Phaser.Sprite.call(this, game, x, y, unitImageTag);

    this.anchor.setTo(0.5, 0.5);

    this.maxHealth = 2;
    this.health = 2;
    this.maxActions = 5;
    this.actions = 5;
    this.range = 1;
    this.attack = 0.3;
    this.defense = 0.5;

    var barConfig = {
        width: 5*this.maxHealth,
        height: 8,
        x: x,
        y: y,
        bg: {color: '#651828'},
        bar: {color: '#FEFF03'},
        animationDuration: 200,
        flipped: false
    };
    this.healthBar = new HealthBar(game, barConfig);
    updateHealthBar(this);
};

Unit.prototype = Object.create(Phaser.Sprite.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.move = function(x, y) {
    this.visible = true;
    this.x = x;
    this.y = y;
    this.healthBar.setPosition(this.x+140, this.y-30);
};

Unit.prototype.refreshActions = function() {
    this.actions = this.maxActions;
};

Unit.prototype.updateActions = function(actionPointsUsed) {
    this.actions -= actionPointsUsed;
};

Unit.prototype.useAttack = function() {
    this.actions = 0;
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
