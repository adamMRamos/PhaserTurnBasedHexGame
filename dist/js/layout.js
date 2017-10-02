
let Orientation = function(forward0, forward1, forward2, forward3,
                       backward0, backward1, backward2, backward3,
                       startAngle) {
    let f0 = forward0,
        f1 = forward1,
        f2 = forward2,
        f3 = forward3;
    let b0 = backward0,
        b1 = backward1,
        b2 = backward2,
        b3 = backward3;
    let angle = startAngle;

    this.forward0 = () => { return f0 };
    this.forward1 = () => { return f1 };
    this.forward2 = () => { return f2 };
    this.forward3 = () => { return f3 };

    this.backward0 = () => { return b0 };
    this.backward1 = () => { return b1 };
    this.backward2 = () => { return b2 };
    this.backward3 = () => { return b3 };

    this.startAngle = () => { return angle };
};

let layoutPointy = new Orientation(
    Math.sqrt(3.0), (Math.sqrt(3.0) / 2.0), 0.0, (3.0 / 2.0),
    (Math.sqrt(3.0) / 3.0), (-1.0 / 3.0), 0.0, (2.0 / 3.0),
    0.5);

let layoutFlat = new Orientation(
    (3.0 / 2.0), 0.0, (Math.sqrt(3.0) / 2.0), Math.sqrt(3.0),
    (2.0 / 3.0), 0.0, (-1.0 / 3.0), (Math.sqrt(3.0) / 3.0),
    0.0);

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

    let aOrientation = layouts[orientation],
        aSize = size,
        aOrigin = origin;

    this.orientation = () => { return aOrientation };
    this.size = () => { return aSize };
    this.origin = () => { return aOrigin };
};

Layout.prototype.constructor = Layout;
Layout.POINTY = "pointy";
Layout.FLAT = "flat";
