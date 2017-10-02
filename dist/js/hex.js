
Hex = function(x, y, z) {
    let column = x;
    let row = y;
    let depth = z;

    if (!depth) depth = (-x-y);

    this.x = () => { return column; };
    this.y = () => { return row; };
    this.z = () => { return depth; };
};

Hex.prototype.constructor = Hex;

Hex.prototype.getInfo = function() {
    return 'x: '+this.x()+', y: '+this.y()+', z: '+this.z();
};

Hex.prototype.equals = function(hex) {
    if (!isAHex(hex)) return false;

    return this.x() === hex.x() && this.y() === hex.y() && this.z() === hex.z();
};

Hex.addHexes = function(a, b) {
    if (!isAHex(a) || !isAHex(b)) return;

    return new Hex(a.x()+b.x(), a.y()+b.y(), a.z()+b.z());
};

Hex.subtractHexes = function (a, b) {
    if (!isAHex(a) || !isAHex(b)) return;

    return new Hex(a.x()-b.x(), a.y()-b.y(), a.z()-b.z());
};

Hex.multiplyHexes = function (hex, multiple) {
    if (!isAHex(hex) || !(typeof multiple === "number")) return;

    return new Hex(hex.x()*multiple, hex.y()*multiple, hex.z()*multiple);
};

Hex.hexLength = function(hex) {
    if (!isAHex(hex)) return;

    return parseInt((Math.abs(hex.x()) + Math.abs(hex.y()) + Math.abs(hex.z()))/2);
};

Hex.hexDistance = function(hex1, hex2) {
    if (!isAHex(hex1) || !isAHex(hex2)) return;

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
let directionStrings = [];
Object.keys(hexDirectionsMap).forEach((key) => {
    directionStrings.push(key);
});
hexDirectionsMap.directionStrings = directionStrings;

Hex.getHexDirection = function(direction) {
    if (typeof direction === 'number')
        direction = hexDirectionsMap.directionStrings[direction];

    return hexDirectionsMap[direction];
};

Hex.hexNeighbor = function(hex, direction) {
    if (!isAHex(hex)) return;

    return Hex.addHexes(hex, Hex.getHexDirection(direction));
};

function isAHex(hex) {
    return hex instanceof Hex;
}