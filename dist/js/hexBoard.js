
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
        if (possibleUnitToCollideWith && unit !== possibleUnitToCollideWith)
            UnitCollisionHandler.handleCollision(unit, possibleUnitToCollideWith);

        this.cleanUpUnits([unit, possibleUnitToCollideWith]);

        if (!findTopObjectWithHex(this.unitsLayer, hex)) {
            console.log('Space is unoccupied');
            const trueDistance = findTrueDistanceToHex(unit, hex, this.unitsLayer);
            unit.moveToHex(hex, trueDistance, {
                hexToPixel: (hex) => translator.hexToPixel(this.layout, hex)
            });
        }
    }

    refreshUnits(teamTag) {
        this.unitsLayer.forEach(unit => {
            if (unit.team === teamTag) {
                console.log('refresh unit on team '+unit.team);
                unit.restoreMovesAndActions();
            }
        });
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
        const foundUnits = findObjectsWithBoardCoodinates(this.unitsLayer, positionOfObject.x, positionOfObject.y);
        return foundUnits[0];
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

function findTrueDistanceToHex(unit, destinationHex, unitsLayer) {
    const start = unit.hex();
    const movement = unit.movesLeft();
    const visited = {};
    visited[start.getInfo()] = start;

    const fringes = [];
    fringes.push([start]);

    let distanceToDestinationHex = null;

    for (let radiusLevel = 1; radiusLevel <= movement; radiusLevel++) {
        fringes.push([]);
        fringes[radiusLevel-1].forEach(hex => {
            for (let direction = 0; direction < 6; direction++) {
                const neighbor = Hex.hexNeighbor(hex, direction);

                const currentOccupant = findTopObjectWithHex(unitsLayer, neighbor);
                if (!visited[neighbor.getInfo()] && pathNotBlocked(currentOccupant, unit)) {
                    if (neighbor.equals(destinationHex)) {
                        console.log('\tfound the destination');
                        console.log('\tThe true distance is: '+radiusLevel);
                        distanceToDestinationHex = radiusLevel;
                    }
                    visited[neighbor.getInfo()] = neighbor;
                    fringes[radiusLevel].push(neighbor);
                }
            }
        });
    }
    return distanceToDestinationHex;
}

function pathNotBlocked(possibleBlock, unit) {
    return !possibleBlock || possibleBlock.team === unit.team;
}

function findObjectsWithBoardCoodinates(groupOfObjects, x, y) {
    let objectToFind = [];
    groupOfObjects.forEach(object => {
        if (object.x === x && object.y === y)
            objectToFind.push(object);
    });
    return objectToFind;
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