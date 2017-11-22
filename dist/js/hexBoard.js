
class HexBoard {
    constructor(hexMapGroup, origin) {
        this.hexMapGroup = hexMapGroup.group;
        this.unitsLayer = hexMapGroup.unitsGroup;
        this.hexMap = hexMapGroup.map;
        this.hexMapGroup.x = origin.x;
        this.hexMapGroup.y = origin.y;
        const hexSize = new Point(40,40);
        this.layout = new Layout(Layout.FLAT, hexSize, origin);
    }

    tryToMoveUnitToHex(unit, hex) {
        const possibleUnitToCollideWith = findTopObjectWithHex(this.unitsLayer, hex);
        if (!possibleUnitToCollideWith)
            unit.moveToHex(hex, {
                hexToPixel: (hex) => translator.hexToPixel(this.layout, hex)
            });
        else if (unit !== possibleUnitToCollideWith)
            UnitCollisionHandler.handleCollision(unit, possibleUnitToCollideWith);

        this.cleanUpUnits([unit, possibleUnitToCollideWith]);
    }

    cleanUpUnits(units) {
        units.forEach(unit => {
            if (unit && !unit.alive) {
                console.log(unit.alive);
                this.unitsLayer.remove(unit);
            }
        });
    }

    addUnit(unit) {
        return this.unitsLayer.add(unit);
    }

    addObject(object) {
        return this.hexMapGroup.add(object);
    }

    addObjectAtHex(object, hex) {
        const centerOfHex = translator.hexToPixel(this.layout, hex);
        object.x = centerOfHex.x;
        object.y = centerOfHex.y;
        return this.hexMapGroup.add(object);
    }

    addObjectAtPosition(object, point) {
        const hex = Hex.roundHex(translator.pixelToHex(this.layout, point));
        const centerOfHex = translator.hexToPixel(this.layout, hex);
        object.x = centerOfHex.x;
        object.y = centerOfHex.y;
        return this.hexMapGroup.add(object);
    }

    findTopUnitAtHex(hex) {
        const positionOfObject = translator.hexToPixel(this.layout, hex);
        return findTopObjectWithBoardCoordinates(this.unitsLayer, positionOfObject.x, positionOfObject.y);
    }

    findTopObjectAtHex(hex) {
        const positionOfObject = translator.hexToPixel(this.layout, hex);
        return findTopObjectWithBoardCoordinates(this.hexMapGroup, positionOfObject.x, positionOfObject.y);
    }

    findTopUnitAtPosition(position) {
        const hexOfObject = Hex.roundHex(translator.pixelToHex(this.layout, position));
        return this.findTopUnitAtHex(hexOfObject);
    }

    findTopObjectAtPosition(position) {
        const hexOfObject = Hex.roundHex(translator.pixelToHex(this.layout, position));
        return this.findTopObjectAtHex(hexOfObject);
    }

    addXY(x, y) {
        this.hexMapGroup.x += x;
        this.hexMapGroup.y += y;
    }

    currentPosition() {
        return new Point(this.hexMapGroup.x, this.hexMapGroup.y);
    }

    toBoardHex(worldX, worldY) {
        const pointOnTheBoard = this.toBoardPosition(worldX, worldY);
        return Hex.roundHex(translator.pixelToHex(this.layout, pointOnTheBoard));
    }

    toBoardPosition(worldX, worldY) {
        return new Point(worldX-this.hexMapGroup.x, worldY-this.hexMapGroup.y);
    }

    fromBoardHex(hex) {
        const boardPosition = translator.hexToPixel(this.layout, hex);
        return this.fromBoardPosition(boardPosition.x, boardPosition.y);
    }

    fromBoardPosition(worldX, worldY) {
        return new Point(worldX+this.hexMapGroup.x, worldY+this.hexMapGroup.y);
    }
}

function findTopObjectWithBoardCoordinates(groupOfObjects, x, y) {
    let objectToFind = null;
    groupOfObjects.forEach(object => {
        if (!objectToFind && object.x === x && object.y === y)
            objectToFind = object;
    });
    return objectToFind;
}

function findTopObjectWithHex(groupOfObjects, hex) {
    let objectToFind = null;
    groupOfObjects.forEach(object => {
        if (!objectToFind && object.hex().equals(hex)) objectToFind = object;
    });
    return objectToFind;
}