/**
 * Created by amram on 9/5/2017.
 */
class UnitOld extends Phaser.Sprite {

    constructor(game, x, y, unitImageTag) {
        super(game, x, y, unitImageTag);

        this.anchor.setTo(0.5, 0.5);
        this.maxHealth = 2;
        this.health = 2;
        this.maxActions = 5;
        this.actions = 5;
        this.range = 1;
        this.attack = 0.3;
        this.defense = 0.5;

        const barConfig = {
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
    }

    move(x, y) {
        this.visible = true;
        this.x = x;
        this.y = y;
        this.healthBar.setPosition(this.x, this.y);
    }

    refreshActions() {
        this.actions = this.maxActions;
    }

    updateActions(actionPointsUsed) {
        this.actions -= actionPointsUsed;
    }

    useAttack() {
        this.actions = 0;
    }

    updateHealth() {
        this.health--;
        updateHealthBar(this);
    }

    isDead() {
        return this.health <= 0;
    }

    cleanUp() {
        this.healthBar.kill();
    }
    //Phaser.Sprite.call(this, game, x, y, unitImageTag);

    //this.anchor.setTo(0.5, 0.5);

    // this.maxHealth = 2;
    // this.health = 2;
    // this.maxActions = 5;
    // this.actions = 5;
    // this.range = 1;
    // this.attack = 0.3;
    // this.defense = 0.5;

    // const barConfig = {
    //     width: 5*this.maxHealth,
    //     height: 8,
    //     x: x,
    //     y: y,
    //     bg: {color: '#651828'},
    //     bar: {color: '#FEFF03'},
    //     animationDuration: 200,
    //     flipped: false
    // };
    // this.healthBar = new HealthBar(game, barConfig);
    // updateHealthBar(this);
}

//Unit.prototype = Object.create(Phaser.Sprite.prototype);
//Unit.prototype.constructor = Unit;

// Unit.prototype.move = function(x, y) {
//     this.visible = true;
//     this.x = x;
//     this.y = y;
//     this.healthBar.setPosition(this.x, this.y);
// };

// Unit.prototype.refreshActions = function() {
//     this.actions = this.maxActions;
// };
//
// Unit.prototype.updateActions = function(actionPointsUsed) {
//     this.actions -= actionPointsUsed;
// };
//
// Unit.prototype.useAttack = function() {
//     this.actions = 0;
// };
//
// Unit.prototype.updateHealth = function() {
//     this.health--;
//     updateHealthBar(this);
// };
//
// Unit.prototype.isDead = function() {
//     return this.health <= 0;
// };
//
// Unit.prototype.cleanUp = function() {
//     this.healthBar.kill();
// };

function updateHealthBar(unit) {
    const healthPercentage = (unit.health/unit.maxHealth)*100;
    unit.healthBar.setPercent(healthPercentage);
}
