
Point = function(x, y) {
    this.x = x;
    this.y = y;
};

Point.prototype = Point;
Point.prototype.hexToPoint = function (layout, hex) {
    if (!(layout instanceof Layout) || !(hex instanceof Hex)) return;

    const orientation = layout.orientation();
    let
        x = ((orientation.forward0()*hex.x()) + (orientation.forward1()*hex.y())) * layout.size().x,
        y = ((orientation.forward2()*hex.x()) + (orientation.forward3()*hex.y())) * layout.size().y;

    return new Point(x+layout.origin().x, y+layout.origin().y);
};