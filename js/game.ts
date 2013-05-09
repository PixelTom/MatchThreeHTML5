/**
 * Created with JetBrains WebStorm.
 * User: thomas
 * Date: 9/05/13
 * Time: 7:55 PM
 * To change this template use File | Settings | File Templates.
 */
/// <reference path="lib/defintelytyped/easeljs/easeljs.d.ts" />
var easelStage: createjs.Stage;
var foodHolder: createjs.Container;
var pointsHolder: createjs.Container;
var recArray: GameItem[]
var selected: GameItem;
var that: Game;
var score: number = 0;
var scoreTxt: createjs.Text;


class Game {
    private numX: number = 5;
    private numY:number = 5;
    public canv: HTMLCanvasElement;
    private ctx: any;

    //***************************
    constructor() {
        that = this;
        this.canv = <HTMLCanvasElement>document.createElement("canvas");
        this.canv.height = 600;
        this.canv.width = 800;
        this.canv.style.border = "1px solid gray";
        document.body.appendChild(this.canv);

        // Associate canvas with EaselJS
        easelStage = new createjs.Stage(this.canv);

        // Add BG
        var background:createjs.Bitmap = new createjs.Bitmap("assets/img/bg1.png");
        //background.scaleX = background.scaleY = 4;
        easelStage.addChild(background);


        // populate the food
        this.buildFood();

        // Add score
        scoreTxt = new createjs.Text("SCORE: 0", "30px PixelWords","red");
        pointsHolder.addChild(scoreTxt);


        // Set FPS and Ticker
        createjs.Ticker.setFPS(40);
        createjs.Ticker.addEventListener("tick", this.doTick);
    }

    //***************************
    private doTick(event) {

        // Drop the food into place
        for (var i in recArray) {
            var tGameItem: GameItem = recArray[i];
            if (tGameItem.y < tGameItem.destY) tGameItem.y += 30;
            if (tGameItem.y > tGameItem.destY) {
                tGameItem.y = tGameItem.destY;
            }
            if (tGameItem.x < tGameItem.destX) tGameItem.x += 30;
            if (tGameItem.x > tGameItem.destX) {
                tGameItem.x = tGameItem.destX;
            }
        }

        easelStage.update();
    }

    //***************************
    // Determine what food was clicked, then
    // A: Highlight
    // B: Swap two, or de-highlight
    private doClick(event): void {
        console.log("clicked");
        for (var i = 0; i < recArray.length; i++) {
            var child: GameItem = recArray[i];
            var pt = child.globalToLocal(easelStage.mouseX, easelStage.mouseY);
            if (easelStage.mouseInBounds && child.hitTest(pt.x, pt.y)) {
                if (selected == null) {
                    selected = child;
                } else {
                    var found: Boolean = false;
                    if ((child.xID == (selected.xID - 1) || child.xID == (selected.xID + 1)) && child.yID == selected.yID) found = true;
                    if ((child.yID == (selected.yID - 1) || child.yID == (selected.yID + 1)) && child.xID == selected.xID) found = true;

                    if (found) {
                        var txID: number;
                        var tyID: number;
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

                        setTimeout(function () { that.checkMatches() }, 1000);
                    }

                    selected = null;
                }
            }
        }
    }

    //***************************
    // Building initial display list
    private buildFood(): void {
        foodHolder = new createjs.Container();
        foodHolder.x = 165;
        foodHolder.y = 40;

        pointsHolder = new createjs.Container();

        recArray = [];
        var countX: number = 0;
        var countY: number = 0;

        while (countX < this.numX) {
            countY = 0;
            while (countY < this.numY) {
                var newItem:GameItem = new GameItem(countX, countY);
                recArray.push(newItem);
                countY++;
                foodHolder.addChild(newItem);
            }
            countX++;
        }

        easelStage.addChild(foodHolder);
        easelStage.addChild(pointsHolder);
        easelStage.update();

        // Add click listener to the foodObjects
        foodHolder.addEventListener("click", this.doClick);
        setTimeout(function () { that.checkMatches() }, 1000);
    }

    //***************************
    public checkMatches(): void {
        for (var i = 0; i < 5; i++) {
            this.checkFood(i,"X");
            this.checkFood(i, "Y");
        }
        // Clear the marked items
        for (i = recArray.length - 1; i >= 0; i--) {
            var tGameItem: GameItem = recArray[i];
            if (tGameItem.markedForDeletion) {
                // Adding points popup
                var pntTxt: ScrollingText = new ScrollingText(50, "+20", "20px PixelWords", "black");
                pntTxt.x = (tGameItem.xID * 100) + 185;
                pntTxt.y = (tGameItem.yID * 100) + 65;
                pointsHolder.addChild(pntTxt);

                foodHolder.removeChild(tGameItem);
                recArray.splice(i, 1);
            }
        }

        var found: bool = this.addNewFood();
        if (found) {
            setTimeout(function () { that.checkMatches() }, 1000);
        }

    }

    //***************************
    private checkFood(qual: number, id: string): void {
        var tGameItem: GameItem;
        var checkArray: GameItem[];

        // Grab the items that match, chuck into array
        checkArray = [];

        for (var i = 0; i < recArray.length; i++) {
            tGameItem = recArray[i];
            switch (id) {
                case "X":
                    if (tGameItem.xID == qual) {
                        checkArray[tGameItem.yID] = tGameItem;
                    }
                    break;
                case "Y":
                    if (tGameItem.yID == qual) {
                        checkArray[tGameItem.xID] = tGameItem;
                    }
                    break;
            }
        }



        // Check for matches
        var matchType: string = "";
        var currArray: GameItem[] = [];

        for (i = 0; i < checkArray.length; i++) {
            tGameItem = checkArray[i];
            if (tGameItem.type != matchType) {
                matchType = tGameItem.type;
                currArray = [];
            }
            currArray.push(tGameItem);
            if (currArray.length >= 3) {
                for (var j = 0; j < currArray.length; j++) {
                    tGameItem = currArray[j];
                    tGameItem.markedForDeletion = true;
                }
            }
        }
    }

    //***************************
    private addNewFood(): bool {
        // Grab all of the same X
        var runningScore: number = 0;
        var added: bool = false;
        var qual: number = 0;
        var itemArray: GameItem[] = [];
        var item: GameItem;

        for (var k = 0; k < 5; k++) {
            itemArray = [];
            for (var i = 0; i < recArray.length; i++) {
                item = recArray[i];
                if (item.xID == qual) {
                    itemArray[item.yID] = item;
                }
            }
            for (i = itemArray.length - 1; i >= 0; i--) {
                if (itemArray[i] == null) {
                    itemArray.splice(i, 1);
                }
            }
            for (i = 4 - itemArray.length; i >= 0; i--) {
                added = true;
                item = new GameItem(k, i);
                foodHolder.addChild(item);
                recArray.push(item);
                runningScore += 20;
                runningScore += Math.ceil(runningScore / 10);
            }
            for (i = 0; i < itemArray.length; i++) {
                item = itemArray[i];
                item.assignNewValues(k, 5 - itemArray.length + i);
            }
            //alert("itemArray" + String(itemArray[0]) + String(itemArray[1]) + String(itemArray[2]) + String(itemArray[3]) + String(itemArray[4]));
            qual++;
        }

        score += runningScore;
        scoreTxt.text = "SCORE: " + score;

        return added;

    }
}