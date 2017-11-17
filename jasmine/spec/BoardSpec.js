// noinspection JSUnresolvedFunction
describe('Board', () => {
    /*
    a board
	    has to insert stuff
	    get stuff out for manipulation
	    has to move around
	    translate world position to board position
	*/

    const mockGroup = {};
    let testHexBoard = new HexBoard(mockGroup);

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
});