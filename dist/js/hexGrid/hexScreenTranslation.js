
let translator = {};

translator.hexToPixel = function(layout, hex) {
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

translator.hexCornerOffset = function (layout, corner) {
    const size = layout.size;
    const angle = 2.0 * Math.PI * (layout.orientation.startAngle + corner) / 6;

    return new Point(size.x * Math.cos(angle), size.y * Math.sin(angle));
};

translator.hexCorners = function(layout, hex) {
    const corners = [];
    const center = translator.hexToPixel(layout, hex);

    for (let i = 0; i < 6; i++) {
        const offset = translator.hexCornerOffset(layout, i);
        corners.push(new Point(center.x + offset.x, center.y + offset.y));
    }

    return corners;
};