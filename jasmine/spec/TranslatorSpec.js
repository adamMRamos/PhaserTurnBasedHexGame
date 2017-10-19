// noinspection JSUnresolvedFunction
describe('Translator', () => {
    let hex0, hexDirectlyNorthOfCenter, hexDirectlySouthOfCenter;
    let northEastHex, southEastHex, northWestHex, southWestHex;
    let hexSize40x40, centerOfLayout, flatLayout;
    let northPoint, southPoint,
        northEastPoint, southEastPoint, northWestPoint, southWestPoint;

    beforeEach(() => {
        hex0 = new Hex(0,0);
        hexDirectlyNorthOfCenter = new Hex( 0,-1, 1);
        hexDirectlySouthOfCenter = new Hex( 0, 1,-1);
        northEastHex = new Hex( 1,-1, 0);
        southEastHex = new Hex( 1, 0,-1);
        northWestHex = new Hex(-1, 0, 1);
        southWestHex = new Hex(-1, 1, 0);

        hexSize40x40 = new Point(40,40);
        centerOfLayout = new Point(300,300);
        northPoint = new Point(300, 230);
        southPoint = new Point(300, 370);
        northEastPoint = new Point(360, 265);
        southEastPoint = new Point(360, 334);
        northWestPoint = new Point(240, 265);
        southWestPoint = new Point(240, 334);
        flatLayout = new Layout(Layout.FLAT, hexSize40x40, centerOfLayout);
    });
    // noinspection JSUnresolvedFunction
    describe('Translate from hex to pixel (FLAT layout)', () => {
        // noinspection JSUnresolvedFunction
        it('center hex returns Point(300,300)', () => {
            const centerPoint = translator.hexToPixel(flatLayout, hex0);
            expect(centerPoint).toEqualPoint(centerOfLayout);
        });
        // noinspection JSUnresolvedFunction
        it('north hex returns Point(300,~230)', () => {
            testHexConversionToPixelWorks(
                hexDirectlyNorthOfCenter,
                flatLayout, centerOfLayout, hexSize40x40.x,
                false, null
            );
        });
        // noinspection JSUnresolvedFunction
        it('south hex returns Point(300,~370)', () => {
            testHexConversionToPixelWorks(
                hexDirectlySouthOfCenter,
                flatLayout, centerOfLayout, hexSize40x40.x,
                true, null
            );
        });
        // noinspection JSUnresolvedFunction
        it('north east hex returns Point(360,~265)', () => {
            testHexConversionToPixelWorks(
                northEastHex,
                flatLayout, centerOfLayout, hexSize40x40.x,
                false, true
            );
        });
        // noinspection JSUnresolvedFunction
        it('south east hex returns Point(360,~334)', () => {
            testHexConversionToPixelWorks(
                southEastHex,
                flatLayout, centerOfLayout, hexSize40x40.x,
                true, true
            );
        });
        // noinspection JSUnresolvedFunction
        it('north west hex returns Point(240,~265)', () => {
            testHexConversionToPixelWorks(
                northWestHex,
                flatLayout, centerOfLayout, hexSize40x40.x,
                false, false
            );
        });
        // noinspection JSUnresolvedFunction
        it('south west hex returns Point(240,~334)', () => {
            testHexConversionToPixelWorks(
                southWestHex,
                flatLayout, centerOfLayout, hexSize40x40.x,
                true, false
            );
        });
    });
    // noinspection JSUnresolvedFunction
    describe('Translate from pixel to hex (FLAT Layout)', () => {
        // noinspection JSUnresolvedFunction
        it('center of layout returns Hex(0,0)', () => {
            const centerHex = translator.pixelToHex(flatLayout, centerOfLayout);
            expect(centerHex).toEqualHex(hex0);
        });
        // noinspection JSUnresolvedFunction
        it('north point returns Hex(0,-1)', () => {
            const actualNorthHex = translator.pixelToHex(flatLayout, northPoint);
            const actualNorthHexRounded = Hex.roundHex(actualNorthHex);

            expect(actualNorthHexRounded).toEqualHex(hexDirectlyNorthOfCenter);
        });
        // noinspection JSUnresolvedFunction
        it('south point returns Hex(0,1)', () => {
            const actualSouthHex = translator.pixelToHex(flatLayout, southPoint);
            const actualSouthHexRounded = Hex.roundHex(actualSouthHex);

            expect(actualSouthHexRounded).toEqualHex(hexDirectlySouthOfCenter);
        });
        // noinspection JSUnresolvedFunction
        it('north east point returns Hex( 1,-1)', () => {
            testPixelToHexConversion(northEastPoint, northEastHex, flatLayout, hexSize40x40);
        });
        // noinspection JSUnresolvedFunction
        it('south east point returns Hex( 1, 0)', () => {
            testPixelToHexConversion(southEastPoint, southEastHex, flatLayout, hexSize40x40);
        });
        // noinspection JSUnresolvedFunction
        it('north west point returns Hex(-1, 0)', () => {
            testPixelToHexConversion(northWestPoint, northWestHex, flatLayout, hexSize40x40);
        });
        // noinspection JSUnresolvedFunction
        it('south west point returns Hex(-1, 1)', () => {
            testPixelToHexConversion(southWestPoint, southWestHex, flatLayout, hexSize40x40);
        });
    });
});

function testPixelToHexConversion(point, hex, layout, hexSize) {
    const actualHex = translator.pixelToHex(layout, point);
    const actualHexRounded = Hex.roundHex(actualHex);
    expect(actualHexRounded).toEqualHex(hex);
    // northeast, southEast, northWest, southWest
    const xyDirections = [{x:1, y:-1}, {x:1, y:1}, {x:-1, y:-1}, {x:-1, y:1}];
    xyDirections.forEach((dir) => {
        testOffsetHexMatchesHex(hex, point, layout, hexSize, dir.x, dir.y);
    });
}

function testOffsetHexMatchesHex(hex, pointToOffset, layout, hexSize, xDir, yDir) {
    const xyOffset = getXYOffset(hexSize);
    const offsetPoint = new Point(pointToOffset.x+(xyOffset.x*xDir), pointToOffset.y+(xyOffset.y*yDir));
    const offsetHex = translator.pixelToHex(layout, offsetPoint);
    const offsetHexRounded = Hex.roundHex(offsetHex);
    expect(offsetHexRounded).toEqualHex(hex);
}

function testHexConversionToPixelWorks(hex, layout, centerOfLayout, hexWidth, south, east) {
    const vertHorizDistances = findVerticalAndHorizontalDistance(
        hexWidth, southDirection(south), eastDirection(east)
    );

    const verticalDistance = vertHorizDistances.verticalDistance;
    const horizontalDistance = vertHorizDistances.horizontalDistance;

    const actualPoint = translator.hexToPixel(layout, hex);
    const expectedPoint = new Point(
        centerOfLayout.x+horizontalDistance,
        centerOfLayout.y+verticalDistance
    );

    expect(actualPoint).toEqualPoint(expectedPoint);
}

function findVerticalAndHorizontalDistance(hexWidth, yDirection, xDirection) {
    let verticalDistance = findVerticalDistance(hexWidth);
    let horizontalDistance = findHorizontalDistance(hexWidth);

    if (xDirection !== 0) verticalDistance /= 2;
    return {
        verticalDistance: verticalDistance*yDirection,
        horizontalDistance: horizontalDistance*xDirection
    };
}

function findHorizontalDistance(widthSize) {
    return hexagonWidth(widthSize)*3/4;
}

function findVerticalDistance(widthSize) {
    return hexagonHeight(hexagonWidth(widthSize));
}

function hexagonWidth(widthSize) {
    return widthSize*2;
}

function hexagonHeight(hexagonWidth) {
    return Math.sqrt(3)/2 * hexagonWidth;
}

function southDirection(isSouth) {
    return isSouth ? 1 : -1;
}

function eastDirection(isEast) {
    return isEast === null ? 0 : isEast ? 1 : -1;
}

function getXYOffset(hexSize) {
    return {x:(hexSize.x/2), y:((Math.sqrt(3)/2*hexSize.y)/2)};
}
