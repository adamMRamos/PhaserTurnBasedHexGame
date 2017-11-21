// noinspection JSUnresolvedFunction
describe('Board', () => {
    /*
    a board
	    has to insert stuff
	    get stuff out for manipulation
	    has to move
	    translate world position to board position
	        from world to board pixel or hex
	        from board pixel or hex to world
	*/
    const origin = new Point(100,100);
    let testHexBoard;

    beforeEach(() => {
        const objects = [];
        const mockGroupObject = {
            group: {
                add: (object) => objects.push(object),
                forEach: (callback) => objects.forEach(callback),
                x:0,
                y:0
            },
            map: {}
        };
        testHexBoard = new HexBoard(mockGroupObject, origin);
    });

    // noinspection JSUnresolvedFunction
    describe('Insert Objects', () => {
        // noinspection JSUnresolvedFunction
        it('Can insert objects onto hex', () => {
            const fakeSprite = {x: 0, y: 0};
            const hex = new Hex(0,0);
            expect(testHexBoard.addObjectAtHex(fakeSprite, hex)).toBeDefined();
        });

        // noinspection JSUnresolvedFunction
        it('Can insert objects onto position', () => {
            const fakeSprite = {x: 0, y: 0};
            const point = new Point(100,100);
            expect(testHexBoard.addObjectAtPosition(fakeSprite, point)).toBeDefined();
        });
    });

    // noinspection JSUnresolvedFunction
    describe('Find Objects', () => {
        const fakeSprite2 = {x:1,y:1, a:'a'};
        const fakeSprite = {x: 0, y: 0, b:'b'};
        const hex = new Hex(0,0);
        const point = new Point(100,100);

        beforeEach(() => {
            testHexBoard.addObjectAtHex(fakeSprite, hex);
            testHexBoard.addObjectAtHex(fakeSprite2, hex);
        });

        // noinspection JSUnresolvedFunction
        it('Can find top object based on hex position', () => {
            const foundObject = testHexBoard.findTopObjectAtHex(hex);
            expect(foundObject).toEqual(fakeSprite);
        });

        // noinspection JSUnresolvedFunction
        it('Can find top object based on pixel position', () => {
            const foundObject = testHexBoard.findTopObjectAtPosition(point);
            expect(foundObject).toEqual(fakeSprite);
        });

        // noinspection JSUnresolvedFunction
        it('Top object based on hex position is not the second object', () => {
            const foundObject = testHexBoard.findTopObjectAtHex(hex);
            expect(foundObject).not.toEqual(fakeSprite2);
        });

        // noinspection JSUnresolvedFunction
        it('Top object based on pixel position is not the second object', () => {
            const foundObject = testHexBoard.findTopObjectAtPosition(point);
            expect(foundObject).not.toEqual(fakeSprite2);
        });
    });

    // noinspection JSUnresolvedFunction
    describe('Move', () => {
        // noinspection JSUnresolvedFunction
        it('Can move position', () => {
            testHexBoard.addXY(+8, +8);
            const boardPosition = testHexBoard.currentPosition();
            expect(boardPosition).toEqualPoint(new Point(origin.x+8, origin.y+8));
        });
    });

    // noinspection JSUnresolvedFunction
    describe('Translate between world and board positions', () => {
        const worldX = 200;
        const worldY = 200;

        // noinspection JSUnresolvedFunction
        it('Translate world coordinates to Hex', () => {
            const hex = testHexBoard.toBoardHex(worldX,worldY);
            expect(hex).toEqualHex(new Hex(0,0));
        });

        // noinspection JSUnresolvedFunction
        it('Translate world coordinates to Position', () => {
            const point = testHexBoard.toBoardPosition(worldX,worldY);
            expect(point).toEqualPoint(new Point(100,100));
        });

        // noinspection JSUnresolvedFunction
        it('Translate board hex to world Position', () => {
            const point = testHexBoard.fromBoardHex(new Hex(0,0));
            expect(point).toEqualPoint(new Point(worldX,worldY));
        });

        // noinspection JSUnresolvedFunction
        it('Translate board position to world Position', () => {
            const point = testHexBoard.fromBoardPosition(100,100);
            expect(point).toEqualPoint(new Point(worldX,worldY));
        });
    });
});