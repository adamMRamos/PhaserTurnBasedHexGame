// noinspection JSUnresolvedFunction
describe('Hex', () => {
    let hex0, hex1, hex2, hexDirectlyNorthOfCenter;
    let hexes;

    beforeEach(() => {
        hex0 = new Hex(0,0);
        hex1 = new Hex(1,0);
        hex2 = new Hex(0,1);
        hexDirectlyNorthOfCenter = new Hex(1,1,-2);

        hexes = [];
        hexes.push(hex0, hex1, hex2, hexDirectlyNorthOfCenter);
    });
    // noinspection JSUnresolvedFunction
    it('constructor works as expected', () => {
        expect(hex0).toMatchHexFields([ 0, 0, 0]);
        expect(hex1).toMatchHexFields([ 1, 0,-1]);
        expect(hex2).toMatchHexFields([ 0, 1,-1]);
        expect(hexDirectlyNorthOfCenter).toMatchHexFields([1,1,-2]);
    });
    // noinspection JSUnresolvedFunction
    it('getInfo works as expected', () => {
        checkGetInfoResults(hex0, 'x: 0, y: 0, z: 0');
        checkGetInfoResults(hex1, 'x: 1, y: 0, z: -1');
        checkGetInfoResults(hex2, 'x: 0, y: 1, z: -1');
        checkGetInfoResults(hexDirectlyNorthOfCenter, 'x: 1, y: 1, z: -2');
    });
    // noinspection JSUnresolvedFunction
    it('equals works as expected', () => {
        hexes.forEach((hex) => {
            checkHexEqualsSameHex(hex);
            hexes.forEach((otherHex) => {
                if (!(Object.is(hex, otherHex))) expect(hex.equals(otherHex)).toEqual(false);
            });
        });
     });
    // noinspection JSUnresolvedFunction
    describe('Perform hex math', () => {
        let hexCoordsToUse = [[0,1], [1,0], [0,0], [1,1]];
        let hexDirectionsMap = {
            north:      new Hex( 0,-1, 1), northEast:  new Hex( 1,-1, 0), southEast:  new Hex( 1, 0,-1),
            south:      new Hex( 0, 1,-1), southWest:  new Hex(-1, 1, 0), northWest:  new Hex(-1, 0, 1)
        };
        hexDirectionsMap.directionStrings = Object.keys(hexDirectionsMap);

        // noinspection JSUnresolvedFunction
        it ('Hex rounding works as expected', () => {
            const fractionalHexes = [
                new Hex(0.5, -0.7), new Hex(1.2, -0.6), new Hex(0.7, -1.2),
                new Hex(1.1, -1.3), new Hex(1.0, -1.0)
            ];

            checkHexRoundingIsAsExpected(fractionalHexes, hexDirectionsMap.northEast);
        });
        // noinspection JSUnresolvedFunction
        it('Adding hexes works as expected', () => {
            performFunctionOnAllHexesAndHexCoordinates(
                hexes, hexCoordsToUse, checkAddingHexIsAsExpected
            );
        });
        // noinspection JSUnresolvedFunction
        it('Subtracting hexes works as expected', () => {
            performFunctionOnAllHexesAndHexCoordinates(
                hexes, hexCoordsToUse, checkSubtractingHexIsAsExpected
            );
        });
        // noinspection JSUnresolvedFunction
        it('Multiplying hexes works as expected', () => {
            const values = [0, 1, 2, 3, 4];
            hexes.forEach((hex) => {
                values.forEach((val) => checkMultiplyingHexIsAsExpected(hex, val));
            });
        });
        // noinspection JSUnresolvedFunction
        it('Finding hex length works as expected', () => hexes.forEach((hex) => checkHexLength(hex)));
        // noinspection JSUnresolvedFunction
        it('Finding hex distance works as expected', () => {
            performFunctionOnAllHexesAndHexCoordinates(
                hexes, hexCoordsToUse, checkHexDistanceIsAsExpected
            )
        });
        // noinspection JSUnresolvedFunction
        it('Finding hex direction works as expected', () => {
            checkHexDirectionsWorksAsExpected(hexDirectionsMap);
            findingDirectionWithStringIsTheSameAsInt(hexDirectionsMap);
        });
        // noinspection JSUnresolvedFunction
        it('Finding hex neighbor works as expected', () => {
            hexes.forEach((hex) => findingHexNeighborWorksAsExpected(hex, hexDirectionsMap));
        });
    });
    // noinspection JSUnresolvedFunction
    describe('All functions return undefined on invalid input', () => {
        // noinspection JSUnresolvedFunction
        it('Adding hexes returns undefined', () => {
            testForUndefinedResult(hex0, Hex.addHexes);
        });
        // noinspection JSUnresolvedFunction
        it('Subtracting hexes returns undefined', () => {
            testForUndefinedResult(hex0, Hex.subtractHexes);
        });
        // noinspection JSUnresolvedFunction
        it('Multiplying hexes returns undefined', () => {
            testForUndefinedResult(hex0, Hex.multiplyHexes);
        });
        // noinspection JSUnresolvedFunction
        it('Finding hex length returns undefined', () => {
            let undefinedInput;
            expect(Hex.hexLength(undefinedInput)).not.toBeDefined();
            expect(Hex.hexLength(null)).not.toBeDefined();
            expect(Hex.hexLength('hex')).not.toBeDefined();
            expect(Hex.hexLength(0)).not.toBeDefined();
            expect(Hex.hexLength(true)).not.toBeDefined();
        });
        // noinspection JSUnresolvedFunction
        it('Finding hex distance returns undefined', () => {
            testForUndefinedResult(hex0, Hex.hexDistance);
        });
        // noinspection JSUnresolvedFunction
        it('Rounding hex returns undefined', () => {
            testForUndefinedResultOnOneInput(Hex.roundHex);
        });
        // noinspection JSUnresolvedFunction
        it('Finding hex direction returns undefined', () => {
            testForUndefinedResultOnOneInput(Hex.getHexDirection);
        });
        // noinspection JSUnresolvedFunction
        it('Finding hex neighbor returns undefined', () => {
            testForUndefinedResult(hex0, Hex.hexNeighbor);
            expect(Hex.hexNeighbor(hex0, 'hex')).not.toBeDefined();
            expect(Hex.hexNeighbor(hex0, 6)).not.toBeDefined();
            expect(Hex.hexNeighbor(hex0, -1)).not.toBeDefined();
            expect(Hex.hexNeighbor(hex0, true)).not.toBeDefined();
        });
    });
});

function testForUndefinedResult(validInput, func) {
    let undefinedInput1, undefinedInput2;
    expect(func(validInput, undefinedInput2)).not.toBeDefined();
    expect(func(undefinedInput1, validInput)).not.toBeDefined();
    expect(func(undefinedInput1, undefinedInput2)).not.toBeDefined();
    expect(func(validInput, null)).not.toBeDefined();
    expect(func(null, validInput)).not.toBeDefined();
    expect(func(null, null)).not.toBeDefined();
}

function testForUndefinedResultOnOneInput(func) {
    let undefinedInput;
    const invalidInputs = [undefinedInput, null, 'hex', 6, -1, true];

    invalidInputs.forEach((invalid) => expect(func(invalid)).not.toBeDefined());
}

function checkGetInfoResults(hex, expectedStringResult) {
    expect(hex.getInfo()).toEqual(expectedStringResult);
}

function checkHexEqualsSameHex(hex) {
    expect(hex.equals(new Hex(hex.x, hex.y, hex.z))).toEqual(true);
}

function performFunctionOnAllHexesAndHexCoordinates(hexes, hexCoords, aFunc) {
    hexes.forEach((hex) => {
        hexCoords.forEach((hexCoord) => aFunc(hex, hexCoord[0], hexCoord[1]));
    });
}

function checkHexRoundingIsAsExpected(hexesToRound, hex) {
    hexesToRound.forEach((fractionalHex) => {
        const roundedHex = Hex.roundHex(fractionalHex);
        expect(roundedHex).toEqualHex(hex);
    });
}

function checkAddingHexIsAsExpected(hex, x, y, z) {
    let hexToAdd = new Hex(x,y,z);
    let newHex = Hex.addHexes(hex, hexToAdd);

    let expectedHex = addHexes(hex, hexToAdd);

    expect(newHex).toEqualHex(expectedHex);
}

function checkSubtractingHexIsAsExpected(hex, x, y, z) {
    let hexToSubtract = new Hex(x,y,z);
    let newHex = Hex.subtractHexes(hex, hexToSubtract);

    let expectedSubtractedHex = subtractHexes(hex, hexToSubtract);

    expect(newHex).toEqualHex(expectedSubtractedHex);
}

function checkMultiplyingHexIsAsExpected(hex, multiple) {
    let newHex = Hex.multiplyHexes(hex, multiple);

    const x = hex.x*multiple === -0 ? 0 : hex.x*multiple;
    const y = hex.y*multiple === -0 ? 0 : hex.y*multiple;
    const z = hex.z*multiple === -0 ? 0 : hex.z*multiple;

    expect(newHex).toMatchHexFields([x,y,z]);
}

function checkHexLength(hex) {
    let hexLength = Hex.hexLength(hex);
    let expectedHexLength = findHexLength(hex);

    expect(hexLength).toEqual(expectedHexLength);
}

function checkHexDistanceIsAsExpected(hex, x, y, z) {
    let hexToCheckDistance = new Hex(x, y, z);
    let hexDistance = Hex.hexDistance(hex, hexToCheckDistance);

    let hexDifference = subtractHexes(hex, hexToCheckDistance);
    let expectedDifference = findHexLength(hexDifference);

    expect(hexDistance).toEqual(expectedDifference);
}

function checkHexDirectionsWorksAsExpected(hexDirections) {
    hexDirections.directionStrings.forEach((directionString) => {
        let expectedDirection = hexDirections[directionString];
        let hexDirection = Hex.getHexDirection(directionString);

        expect(hexDirection).toEqualHex(expectedDirection);
    });
}

function findingDirectionWithStringIsTheSameAsInt(hexDirections) {
    let i = 0;
    hexDirections.directionStrings.forEach((directionString) => {
        let hexDirectionFromString = Hex.getHexDirection(directionString);
        let hexDirectionFromInt = Hex.getHexDirection(i);

        expect(hexDirectionFromString).toEqualHex(hexDirectionFromInt);
        i++;
    });
}

function findingHexNeighborWorksAsExpected(hex, hexDirections) {
    hexDirections.directionStrings.forEach((directionString) => {
        let hexNeighbor = Hex.hexNeighbor(hex, directionString);

        let hexFromDirection = hexDirections[directionString];
        let expectedNeighbor = addHexes(hex, hexFromDirection);

        expect(hexNeighbor).toEqualHex(expectedNeighbor);
    });
}

function addHexes(a, b) {
    return new Hex(a.x+b.x, a.y+b.y, a.z+b.z);
}

function subtractHexes(a, b) {
    return new Hex(a.x-b.x, a.y-b.y, a.z-b.z);
}

function findHexLength(hex) {
    return parseInt((Math.abs(hex.x) + Math.abs(hex.y) + Math.abs(hex.z))/2);
}