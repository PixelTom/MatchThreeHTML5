var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ScrollingText = (function (_super) {
    __extends(ScrollingText, _super);
    function ScrollingText(tLife, tText, tFont, tColour) {
        _super.call(this, tText, tFont, tColour);
        this.life = 100;
        this.life = tLife;
        this.addEventListener("tick", this.doTick);
    }
    ScrollingText.prototype.doTick = function (event) {
        var tTxt = event.target;
        tTxt.life--;
        if(tTxt.life < 0) {
            event.target.removeEventListener("tick", this.doTick);
            pointsHolder.removeChild(event.target);
            event.target = null;
        }
    };
    return ScrollingText;
})(createjs.Text);
function exec() {
    var game = new Game();
}
exec();
//@ sourceMappingURL=app.js.map
