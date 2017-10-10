
let Orientation = function(forward0, forward1, forward2, forward3,
                       backward0, backward1, backward2, backward3,
                       startAngle) {
    //forward
    Object.defineProperty(this, 'f0', { writable: false, value: forward0 });
    Object.defineProperty(this, 'f1', { writable: false, value: forward1 });
    Object.defineProperty(this, 'f2', { writable: false, value: forward2 });
    Object.defineProperty(this, 'f3', { writable: false, value: forward3 });
    //backward
    Object.defineProperty(this, 'b0', { writable: false, value: backward0 });
    Object.defineProperty(this, 'b1', { writable: false, value: backward1 });
    Object.defineProperty(this, 'b2', { writable: false, value: backward2 });
    Object.defineProperty(this, 'b3', { writable: false, value: backward3 });
    //start angle
    Object.defineProperty(this, 'startAngle', { writable: false, value: startAngle });
};

let layouts = {
    pointy: new Orientation(
        Math.sqrt(3.0), (Math.sqrt(3.0) / 2.0), 0.0, (3.0 / 2.0),
        (Math.sqrt(3.0) / 3.0), (-1.0 / 3.0), 0.0, (2.0 / 3.0),
        0.5),
    flat: new Orientation(
        (3.0 / 2.0), 0.0, (Math.sqrt(3.0) / 2.0), Math.sqrt(3.0),
        (2.0 / 3.0), 0.0, (-1.0 / 3.0), (Math.sqrt(3.0) / 3.0),
        0.0)
};

Layout = function (orientation, size, origin) {
    Object.defineProperty(this, 'orientation', { writable: false, value: orientation });
    Object.defineProperty(this, 'size', { writable: false, value: size });
    Object.defineProperty(this, 'origin', { writable: false, value: origin });
};

Layout.prototype.constructor = Layout;
Object.defineProperty(Layout, 'POINTY', { writable: false, value: layouts['pointy'] });
Object.defineProperty(Layout, 'FLAT', { writable: false, value: layouts['flat'] });
