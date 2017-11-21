// noinspection JSUnresolvedFunction
describe('Unit', () => {
    /*
    a unit
        can move itself
            can change position to new hex
                given a position moves to the hex at that position
                given a hex moves to the hex
            does not move to hex beyond max move distance
            does not move to hex beyond current available moves
     */
    const hexSize = new Point(40,40);
    const origin = new Point(100,100);
    const layout = new Layout(Layout.FLAT, hexSize, origin);
    const hexBoardTranslator = new HexBoardTranslator(layout);
    let unitHexPosition;
    let unitFrame;

    beforeEach(() => {
        unitHexPosition = new Hex(10,0);
        unitFrame = new UnitFrame(unitHexPosition, 2);
    });

    // noinspection JSUnresolvedFunction
    describe('Move', () => {

        // noinspection JSUnresolvedFunction
        describe('Can change position to new hex', () => {

            // noinspection JSUnresolvedFunction
            it('Given a position, move to the hex at that position', () => {
                unitFrame.moveToHexAtPosition(new Point(570, 370), hexBoardTranslator);
                expect(unitFrame.hex).toEqualHex(new Hex(8, 0));
            });

            // noinspection JSUnresolvedFunction
            it('Given a hex, move to the hex', () => {
                unitFrame.moveToHex(new Hex(8, 0));
                expect(unitFrame.hex).toEqualHex(new Hex(8, 0));
            });
        });

        // noinspection JSUnresolvedFunction
        it('Does not move to hex beyond max move distance', () => {
            unitFrame.moveToHex(new Hex(7, 0));
            expect(unitFrame.hex).not.toEqualHex(new Hex(7, 0));
        });

        // noinspection JSUnresolvedFunction
        it('Does not move to hex beyond available moves', () => {
            const northWest = Hex.getHexDirection('northWest');
            let nextPosition = unitHexPosition;
            const moveTheUnit = () => {
                nextPosition = Hex.addHexes(nextPosition, northWest);
                unitFrame.moveToHex(nextPosition);
            };

            for (let i = 0; i < unitFrame.maxMoves; i++) {
                moveTheUnit();
                expect(unitFrame.hex).toEqualHex(nextPosition);
            }
            moveTheUnit();
            expect(unitFrame.hex).not.toEqualHex(nextPosition);
        });
    });
});