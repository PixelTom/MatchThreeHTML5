var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameItem = (function (_super) {
    __extends(GameItem, _super);
    function GameItem(tX, tY, tType) {
        if (typeof tType === "undefined") { tType = ""; }
        var url;
        this.types = [
            "HAMBURGER", 
            "FRIES", 
            "SUNDAE", 
            "PIZZA", 
            "CHICKEN"
        ];
        this.markedForDeletion = false;
        if(tType == "") {
            tType = this.types[Math.floor(Math.random() * 5)];
        }
        switch(tType) {
            case "HAMBURGER":
                url = "assets/img/food_burger.png";
                break;
            case "FRIES":
                url = "assets/img/food_fries.png";
                break;
            case "SUNDAE":
                url = "assets/img/food_sundae.png";
                break;
            case "PIZZA":
                url = "assets/img/food_pizza.png";
                break;
            case "CHICKEN":
                url = "assets/img/food_chicken.png";
                break;
        }
        _super.call(this, url);
        this.type = tType;
        this.destX = tX * 100;
        this.destY = tY * 100;
        this.xID = tX;
        this.yID = tY;
        this.x = tX * 100;
        this.y = 0 - (Math.random() * 200) - 100;
    }
    GameItem.prototype.assignNewValues = function (newX, newY) {
        this.destX = newX * 100;
        this.destY = newY * 100;
        this.xID = newX;
        this.yID = newY;
    };
    return GameItem;
})(createjs.Bitmap);
//@ sourceMappingURL=gameitem.js.map
