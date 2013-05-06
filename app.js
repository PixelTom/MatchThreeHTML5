var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var easelStage;
var foodHolder;
var pointsHolder;
var recArray;
var selected;
var that;
var score = 0;
var scoreTxt;
var GameItem = (function (_super) {
    __extends(GameItem, _super);
    function GameItem(tX, tY, tType) {
        if (typeof tType === "undefined") { tType = ""; }
        _super.call(this);
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
        this.type = tType;
        var cString;
        switch(this.type) {
            case "HAMBURGER":
                cString = 'rgba(255,0,0,1)';
                break;
            case "FRIES":
                cString = 'rgba(0,255,0,1)';
                break;
            case "SUNDAE":
                cString = 'rgba(0,0,255,1)';
                break;
            case "PIZZA":
                cString = 'rgba(255,255,0,1)';
                break;
            case "CHICKEN":
                cString = 'rgba(0,255,255,1)';
                break;
        }
        this.graphics.beginFill(cString).drawRect(0, 0, 80, 80);
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
})(createjs.Shape);
var ScrollingText = (function (_super) {
    __extends(ScrollingText, _super);
    function ScrollingText(tLife, tText, tFont, tColour) {
        _super.call(this, tText, tFont, tColour);
        this.life = 100;
        this.life = tLife;
        this.addEventListener("tick", this.doTick);
    }
    ScrollingText.prototype.doTick = function (event) {
        event.target.life--;
        if(event.target.life < 0) {
            event.target.removeEventListener("tick", this.doTick);
            pointsHolder.removeChild(event.target);
            event.target = null;
        }
    };
    return ScrollingText;
})(createjs.Text);
var Game = (function () {
    function Game() {
        this.types = [
            "BURGER", 
            "FRIES", 
            "SUNDAE", 
            "PIZZA", 
            "CHICKEN"
        ];
        this.xStart = 170;
        this.yStart = 70;
        this.numX = 5;
        this.numY = 5;
        that = this;
        this.canv = document.createElement("canvas");
        this.canv.height = 600;
        this.canv.width = 800;
        this.canv.style.border = "1px solid gray";
        document.body.appendChild(this.canv);
        easelStage = new createjs.Stage(this.canv);
        this.buildFood();
        scoreTxt = new createjs.Text("SCORE: 0", "30px Arial", "red");
        pointsHolder.addChild(scoreTxt);
        createjs.Ticker.setFPS(40);
        createjs.Ticker.addEventListener("tick", this.flick);
    }
    Game.prototype.flick = function (event) {
        for(var i in recArray) {
            var tGameItem = recArray[i];
            if(tGameItem.y < tGameItem.destY) {
                tGameItem.y += 30;
            }
            if(tGameItem.y > tGameItem.destY) {
                tGameItem.y = tGameItem.destY;
            }
            if(tGameItem.x < tGameItem.destX) {
                tGameItem.x += 30;
            }
            if(tGameItem.x > tGameItem.destX) {
                tGameItem.x = tGameItem.destX;
            }
        }
        easelStage.update();
    };
    Game.prototype.doClick = function (event) {
        for(var i = 0; i < recArray.length; i++) {
            var child = recArray[i];
            var pt = child.globalToLocal(easelStage.mouseX, easelStage.mouseY);
            if(easelStage.mouseInBounds && child.hitTest(pt.x, pt.y)) {
                if(selected == null) {
                    selected = child;
                } else {
                    var found = false;
                    if((child.xID == (selected.xID - 1) || child.xID == (selected.xID + 1)) && child.yID == selected.yID) {
                        found = true;
                    }
                    if((child.yID == (selected.yID - 1) || child.yID == (selected.yID + 1)) && child.xID == selected.xID) {
                        found = true;
                    }
                    if(found) {
                        var txID;
                        var tyID;
                        txID = child.xID;
                        tyID = child.yID;
                        child.xID = selected.xID;
                        child.yID = selected.yID;
                        selected.xID = txID;
                        selected.yID = tyID;
                        child.destX = selected.x;
                        child.destY = selected.y;
                        selected.destX = child.x;
                        selected.destY = child.y;
                        setTimeout(function () {
                            that.checkMatches();
                        }, 1000);
                    }
                    selected = null;
                }
            }
        }
    };
    Game.prototype.buildFood = function () {
        foodHolder = new createjs.Container();
        foodHolder.x = 165;
        foodHolder.y = 40;
        pointsHolder = new createjs.Container();
        recArray = new Array();
        var countX = 0;
        var countY = 0;
        while(countX < this.numX) {
            countY = 0;
            while(countY < this.numY) {
                var newItem = new GameItem(countX, countY);
                recArray.push(newItem);
                countY++;
                foodHolder.addChild(newItem);
            }
            countX++;
        }
        easelStage.addChild(foodHolder);
        easelStage.addChild(pointsHolder);
        easelStage.update();
        foodHolder.addEventListener("click", this.doClick);
        setTimeout(function () {
            that.checkMatches();
        }, 1000);
    };
    Game.prototype.checkMatches = function () {
        for(var i = 0; i < 5; i++) {
            this.checkFood(i, "X");
            this.checkFood(i, "Y");
        }
        for(i = recArray.length - 1; i >= 0; i--) {
            var tGameItem = recArray[i];
            if(tGameItem.markedForDeletion) {
                var pntTxt = new ScrollingText(50, "+20", "20px Arial", "black");
                pntTxt.x = (tGameItem.xID * 100) + 185;
                pntTxt.y = (tGameItem.yID * 100) + 65;
                pointsHolder.addChild(pntTxt);
                foodHolder.removeChild(tGameItem);
                recArray.splice(i, 1);
            }
        }
        var found = this.addNewFood();
        if(found) {
            setTimeout(function () {
                that.checkMatches();
            }, 1000);
        }
    };
    Game.prototype.checkFood = function (qual, id) {
        var tGameItem;
        var checkArray;
        checkArray = new Array();
        for(var i = 0; i < recArray.length; i++) {
            tGameItem = recArray[i];
            switch(id) {
                case "X":
                    if(tGameItem.xID == qual) {
                        checkArray[tGameItem.yID] = tGameItem;
                    }
                    break;
                case "Y":
                    if(tGameItem.yID == qual) {
                        checkArray[tGameItem.xID] = tGameItem;
                    }
                    break;
            }
        }
        var matchType = "";
        var currArray = new Array();
        for(i = 0; i < checkArray.length; i++) {
            tGameItem = checkArray[i];
            if(tGameItem.type != matchType) {
                matchType = tGameItem.type;
                currArray = new Array();
            }
            currArray.push(tGameItem);
            if(currArray.length >= 3) {
                for(var j = 0; j < currArray.length; j++) {
                    tGameItem = currArray[j];
                    tGameItem.markedForDeletion = true;
                }
            }
        }
    };
    Game.prototype.addNewFood = function () {
        var runningScore = 0;
        var added = false;
        var qual = 0;
        var itemArray = new Array();
        var item;
        for(var k = 0; k < 5; k++) {
            itemArray = new Array();
            for(var i = 0; i < recArray.length; i++) {
                item = recArray[i];
                if(item.xID == qual) {
                    itemArray[item.yID] = item;
                }
            }
            for(i = itemArray.length - 1; i >= 0; i--) {
                if(itemArray[i] == null) {
                    itemArray.splice(i, 1);
                }
            }
            for(i = 4 - itemArray.length; i >= 0; i--) {
                added = true;
                item = new GameItem(k, i);
                foodHolder.addChild(item);
                recArray.push(item);
                runningScore += 20;
                runningScore += Math.ceil(runningScore / 10);
            }
            for(i = 0; i < itemArray.length; i++) {
                item = itemArray[i];
                item.assignNewValues(k, 5 - itemArray.length + i);
            }
            qual++;
        }
        score += runningScore;
        scoreTxt.text = "SCORE: " + score;
        return added;
    };
    Game.prototype.drawText = function (input, xPos, yPos) {
        this.ctx.font = "30px Arial";
        this.ctx.fillText(input, xPos, yPos);
    };
    return Game;
})();
function exec() {
    var game = new Game();
}
exec();
//@ sourceMappingURL=app.js.map
