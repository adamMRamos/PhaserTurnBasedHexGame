class UnitCollisionHandler {
    static get ATTACKER(){ return true }
    static get DEFENDER(){ return false }

    static handleCollision(unit1, unit2) {
        if (unit1.canCollideWith(unit2)) {
            unit1.collideWith(unit2, UnitCollisionHandler.ATTACKER);
            unit2.collideWith(unit1, UnitCollisionHandler.DEFENDER);
        }
    }
}