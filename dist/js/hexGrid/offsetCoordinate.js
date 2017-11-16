'use strict';

class OffsetCoordinate  {
    constructor(x, y) {
        Object.defineProperty(this, 'x', {writable: false, value: x});
        Object.defineProperty(this, 'y', {writable: false, value: y});
    }
}

Object.defineProperty(OffsetCoordinate, 'EVEN', {writable: false, value: 1});
Object.defineProperty(OffsetCoordinate, 'ODD', {writable: false, value: -1});

OffsetCoordinate.hexToQOffset = function(offset, hex) {
    let col = hex.x;
    let row = hex.y + Math.floor((hex.x + offset*(hex.x & 1)) / 2);
    return new OffsetCoordinate(col, row);
};

OffsetCoordinate.qOffsetToHex = function(offset, offsetCoord) {
    let col = offsetCoord.x;
    let row = offsetCoord.y - Math.floor((offsetCoord.x + offset*(offsetCoord.x & 1)) / 2);
    return new Hex(col, row);
};

OffsetCoordinate.hexToROffset = function(offset, hex) {
    let col = hex.x + Math.floor((hex.y + offset*(hex.y & 1)) / 2);
    let row = hex.y;
    return new OffsetCoordinate(col, row);
};

OffsetCoordinate.rOffsetToHex = function(offset, offsetCord) {
    let col = offsetCord.x - Math.floor((offsetCord.y + offset*(offsetCord.y & 1)) / 2);
    let row = offsetCord.y;
    return new Hex(col, row);
};
