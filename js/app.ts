/// <reference path="lib/defintelytyped/easeljs/easeljs.d.ts" />

var easelStage: createjs.Stage;
var foodHolder: createjs.Container;
var pointsHolder: createjs.Container;
var recArray: GameItem[];
var selected: GameItem;
var that: Game;
var score: number = 0;
var scoreTxt: createjs.Text;

//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
// Extension of a EaselJS Shape
class GameItem extends createjs.Shape {
    private types: string[] = ["HAMBURGER", "FRIES", "SUNDAE", "PIZZA", "CHICKEN"];
    public type: string;
    public destX: number;
    public destY: number;
    public xID: number;
    public yID: number;
    public markedForDeletion:bool = false;

    constructor(tX: number, tY: number, tType:string = "") {
        super()

        if (tType == "") {
            tType = this.types[Math.floor(Math.random() * 5)];
        }
        this.type = tType;
        var cString: string;

        switch (this.type) {
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

    public assignNewValues(newX: number, newY: number): void {
        this.destX = newX * 100;
        this.destY = newY * 100;
        this.xID = newX;
        this.yID = newY;
    }
}
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
// Extension of CreateJS.text, added a life count and a death function to it
class ScrollingText extends createjs.Text {
    private life: number = 100; // Number of ticks till death

    constructor(tLife: number, tText: string, tFont?: string, tColour?: string) {
        super(tText, tFont, tColour);
        this.life = tLife;
        this.addEventListener("tick", this.doTick);
    }

    private doTick(event): void {
        event.target.life--;
        if (event.target.life < 0) {
            event.target.removeEventListener("tick", this.doTick);
            pointsHolder.removeChild(event.target);
            event.target = null;
        }
    }
}
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
class Game {
    private types: string[] = ["BURGER","FRIES","SUNDAE","PIZZA","CHICKEN"];
    private xStart: number = 170;
    private yStart: number = 70;
    private numX: number = 5;
    private numY:number = 5;
    public canv: HTMLCanvasElement;
    private ctx: any;
    private counter: number;
    
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

        // populate the food
        this.buildFood();
        scoreTxt = new createjs.Text("SCORE: 0", "30px Arial","red");
        pointsHolder.addChild(scoreTxt);

        
        // Set FPS and Ticker
        createjs.Ticker.setFPS(40);
        createjs.Ticker.addEventListener("tick", this.flick);
    }

    //***************************
    private flick(event) {

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

        recArray = new Array();
        var countX: number = 0;
        var countY: number = 0;

        while (countX < this.numX) {
            countY = 0;
            while (countY < this.numY) {
                var newItem: GameItem = new GameItem(countX, countY);
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
                var pntTxt: ScrollingText = new ScrollingText(50, "+20", "20px Arial", "black");
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
        checkArray = new Array();
        //alert(String(recArray.length));
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

        //alert(String(checkArray[0].xID) + ", " + String(checkArray[1].xID) + ", " + String(checkArray[2].xID) + ", " + String(checkArray[3].xID) + ", " + String(checkArray[4].xID) + ", ");

        // Check for matches
        var matchType: string = "";
        var currArray: GameItem[] = new Array();
        
        for (i = 0; i < checkArray.length; i++) {
            tGameItem = checkArray[i];
            if (tGameItem.type != matchType) {
                matchType = tGameItem.type;
                currArray = new Array();
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
        var itemArray: GameItem[] = new Array();
        var item: GameItem;

        for (var k = 0; k < 5; k++) {
            itemArray = new Array();
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
    //***************************
    // Add text to the stage
    private drawText(input: String, xPos: Number, yPos: Number): void {
        this.ctx.font = "30px Arial";
        this.ctx.fillText(input, xPos, yPos);
    }
}
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
// This function be startin' it all up I says!
function exec() {
    var game: Game = new Game();
}
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
exec();