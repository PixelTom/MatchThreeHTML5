/// <reference path="lib/defintelytyped/easeljs/easeljs.d.ts" />



//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
// Extension of a EaselJS Bitmap
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
        var tTxt:ScrollingText = event.target;
        tTxt.life--;
        if (tTxt.life < 0) {
            event.target.removeEventListener("tick", this.doTick);
            pointsHolder.removeChild(event.target);
            event.target = null;
        }
    }
}
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
// This function be starting it all up I says!
function exec() {
    var game: Game = new Game();
}
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
exec();