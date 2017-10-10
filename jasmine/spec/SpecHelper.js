beforeEach(function () {
    jasmine.addMatchers({
        toMatchHexFields: () => {
            return {
                compare: (actual, expected) => {
                    let hex = actual, hexFields = expected;
                    return {
                        pass: hex.x() === hexFields[0] && hex.y() === hexFields[1] && hex.z() === hexFields[2]
                    };
                }
            }
        },
        toEqualHex: () => {
            return {
                compare: (actual, expected) => {
                    let hex1 = actual, hex2 = expected;
                    return {
                        pass: hex1.x() === hex2.x() && hex1.y() === hex2.y() && hex1.z() === hex2.z()
                    };
                }
            }
        },
        toBePlaying: function () {
            return {
                compare: function (actual, expected) {
                    var player = actual;

                    return {
                        pass: player.currentlyPlayingSong === expected && player.isPlaying
                    };
                }
            };
        }
    });
});
