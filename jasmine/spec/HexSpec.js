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
        checkHexFields(hex0, 0, 0, 0);
        checkHexFields(hex1, 1, 0, -1);
        checkHexFields(hex2, 0, 1, -1);
        checkHexFields(hexDirectlyNorthOfCenter, 1, 1, -2);
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
});

function checkHexFields(hex, x, y, z) {
    expect(hex.x()).toEqual(x);
    expect(hex.y()).toEqual(y);
    expect(hex.z()).toEqual(z);
}

function checkGetInfoResults(hex, expectedStringResult) {
    expect(hex.getInfo()).toEqual(expectedStringResult);
}

function checkHexEqualsSameHex(hex) {
    expect(hex.equals(new Hex(hex.x(), hex.y(), hex.z()))).toEqual(true);
}