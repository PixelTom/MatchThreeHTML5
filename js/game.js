var easelStage;
var foodHolder;
var pointsHolder;
var recArray;
var selected;
var that;
var score = 0;
var scoreTxt;
var Game = (function () {
    function Game() {
        this.numX = 5;
        this.numY = 5;
        that = this;
        this.canv = document.createElement("canvas");
        this.canv.height = 600;
        this.canv.width = 800;
        this.canv.style.border = "1px solid gray";
        document.body.appendChild(this.canv);
        easelStage = new createjs.Stage(this.canv);
        var background = new createjs.Bitmap("assets/img/bg1.png");
        easelStage.addChild(background);
        this.buildFood();
        scoreTxt = new createjs.Text("SCORE: 0", "30px PixelWords", "red");
        pointsHolder.addChild(scoreTxt);
        createjs.Ticker.setFPS(40);
        createjs.Ticker.addEventListener("tick", this.doTick);
    }
    Game.prototype.doTick = function (event) {
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
        console.log("clicked");
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
        recArray = [];
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
                var pntTxt = new ScrollingText(50, "+20", "20px PixelWords", "black");
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
        checkArray = [];
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
        var currArray = [];
        for(i = 0; i < checkArray.length; i++) {
            tGameItem = checkArray[i];
            if(tGameItem.type != matchType) {
                matchType = tGameItem.type;
                currArray = [];
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
        var itemArray = [];
        var item;
        for(var k = 0; k < 5; k++) {
            itemArray = [];
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
    return Game;
})();
//@ sourceMappingURL=game.js.map
