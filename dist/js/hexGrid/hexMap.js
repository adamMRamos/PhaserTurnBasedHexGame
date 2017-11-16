
//let mapStore;
class HexMap {
    constructor() {
        this.mapStore = {};
    }

    insertHex(hex) {
        this.mapStore[hex.getInfo()] = hex;
    }

    getHex() {
        return this.mapStore[hex.getInfo()];
    }

    forEach(callback) {
        Object.keys(this.mapStore).forEach((key) => {
            callback(this.mapStore[key]);
        });
    }

    static parallelogramMap(coord1, coord2) {
        const x1 = coord1.x, x2 = coord2.x;
        const y1 = coord1.y, y2 = coord2.y;

        const map = new HexMap();
        for (let x = x1; x < x2; x++)
            for (let y = y1; y < y2; y++)
                map.insertHex(new Hex(x,y));
        return map;
    }

    static hexagonMap(x, y, z) {
        let radius = Math.max(Math.abs(x),Math.abs(y), Math.abs(z));

        const map = new HexMap();
        for (let q = -radius; q <= radius; q++) {
            const r1 = Math.max(-radius, -q-radius);
            const r2 = Math.min(radius, -q+radius);

            for (let r = r1; r <= r2; r++) map.insertHex(new Hex(q,r));
        }
        return map;
    }

    static rectangleMap(width, height) {
        const map = new HexMap();
        for (let q = 0; q < width; q++) {
            const qOffset = Math.floor(q/2); // or q>>1
            for (let r = -qOffset; r < height-qOffset; r++) map.insertHex(new Hex(q,r));
        }
        return map;
    }
}
//
// HexMap.prototype.insertHex = function(hex) {
//
// };

// HexMap.prototype.getHex = function (hex) {
//
// };

// HexMap.prototype.forEach = function(callback) {
//     Object.keys(mapStore).forEach((key) => {
//         callback(mapStore[key]);
//     });
// };

// HexMap.parallelogramMap = function(coord1, coord2) {
//     const x1 = coord1.x, x2 = coord2.x;
//     const y1 = coord1.y, y2 = coord2.y;
//
//     const map = new HexMap();
//     for (let x = x1; x < x2; x++)
//         for (let y = y1; y < y2; y++)
//             map.insertHex(new Hex(x,y));
//     return map;
// };

// HexMap.hexagonMap = function(x, y, z) {
//     let radius = Math.max(Math.abs(x),Math.abs(y), Math.abs(z));
//
//     const map = new HexMap();
//     for (let q = -radius; q <= radius; q++) {
//         const r1 = Math.max(-radius, -q-radius);
//         const r2 = Math.min(radius, -q+radius);
//
//         for (let r = r1; r <= r2; r++) map.insertHex(new Hex(q,r));
//     }
//     return map;
// };

// HexMap.rectangleMap = function(width, height) {
//     const map = new HexMap();
//     for (let q = 0; q < width; q++) {
//         const qOffset = Math.floor(q/2); // or q>>1
//         for (let r = -qOffset; r < height-qOffset; r++) map.insertHex(new Hex(q,r));
//     }
//     return map;
// };