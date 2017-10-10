
Hex = function(x, y, z) {
    let column = x;
    let row = y;
    let depth = z;

    if (!depth) depth = (-x-y);

    if (column === -0) column = 0;
    if (row === -0) row = 0;
    if (depth === -0) depth = 0;

    Object.defineProperty(this, 'x', { writable: false, value: column });
    Object.defineProperty(this, 'y', { writable: false, value: row });
    Object.defineProperty(this, 'z', { writable: false, value: depth });
};

Hex.prototype.constructor = Hex;

Hex.prototype.getInfo = function() {
    return 'x: '+this.x+', y: '+this.y+', z: '+this.z;
};

Hex.prototype.equals = function(hex) {
    if (!Hex.isAHex(hex)) return false;

    return this.x === hex.x && this.y === hex.y && this.z === hex.z;
};

Hex.addHexes = function(a, b) {
    if (!Hex.isAHex(a) || !Hex.isAHex(b)) return;

    return new Hex(a.x+b.x, a.y+b.y, a.z+b.z);
};

Hex.subtractHexes = function (a, b) {
    if (!Hex.isAHex(a) || !Hex.isAHex(b)) return;

    return new Hex(a.x-b.x, a.y-b.y, a.z-b.z);
};

Hex.multiplyHexes = function (hex, multiple) {
    if (!Hex.isAHex(hex) || !(typeof multiple === 'number')) return;

    return new Hex(hex.x*multiple, hex.y*multiple, hex.z*multiple);
};

Hex.hexLength = function(hex) {
    if (!Hex.isAHex(hex)) return;

    return parseInt((Math.abs(hex.x) + Math.abs(hex.y) + Math.abs(hex.z))/2);
};

Hex.hexDistance = function(hex1, hex2) {
    if (!Hex.isAHex(hex1) || !Hex.isAHex(hex2)) return;

    return Hex.hexLength(Hex.subtractHexes(hex1, hex2));
};

let hexDirectionsMap = {
    north:      new Hex( 0, 1,-1),
    northEast:  new Hex( 1, 0,-1),
    southEast:  new Hex( 1,-1, 0),
    south:      new Hex( 0,-1, 1),
    southWest:  new Hex(-1, 0, 1),
    northWest:  new Hex(-1, 1, 0)
};
hexDirectionsMap.directionStrings = Object.keys(hexDirectionsMap);

Hex.getHexDirection = function(direction) {
    if (typeof direction === 'number')
        direction = hexDirectionsMap.directionStrings[direction];
    else if (typeof direction !== 'string') return;

    return hexDirectionsMap[direction];
};

Hex.hexNeighbor = function(hex, direction) {
    if (!Hex.isAHex(hex)) return;

    return Hex.addHexes(hex, Hex.getHexDirection(direction));
};

Hex.isAHex = function(hex) {
    return hex instanceof Hex;
};