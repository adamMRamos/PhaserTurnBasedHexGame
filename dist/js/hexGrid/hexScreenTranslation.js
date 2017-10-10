
let translator = {};

translator.hexToPixel = function (layout, hex) {
    if (!Layout.isALayout(layout) || !Hex.isAHex(hex)) return;

    const orientation = layout.orientation;
    const x = ((orientation.f0 * hex.x) + (orientation.f1 * hex.y)) * layout.size.x;
    const y = ((orientation.f2 * hex.x) + (orientation.f3 * hex.y)) * layout.size.y;

    return new Point(x + layout.origin.x, y + layout.origin.y);
};

translator.pixelToHex = function(layout, point) {
    const orientation = layout.orientation;
    const newPoint = new Point(
        (point.x - layout.origin.x) / layout.size.x,
        (point.y - layout.origin.y) / layout.size.y
    );
    const x = (orientation.b0 * newPoint.x) + (orientation.b1 * newPoint.y);
    const y = (orientation.b2 * newPoint.x) + (orientation.b3 * newPoint.y);

    return new Hex(x, y);
};