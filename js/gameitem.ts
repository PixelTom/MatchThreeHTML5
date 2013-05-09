/**
 * Created with JetBrains WebStorm.
 * User: thomas
 * Date: 9/05/13
 * Time: 3:42 PM
 * To change this template use File | Settings | File Templates.
 */
/// <reference path="lib/defintelytyped/easeljs/easeljs.d.ts" />

class GameItem extends createjs.Bitmap {
    private types: string[] = ["HAMBURGER", "FRIES", "SUNDAE", "PIZZA", "CHICKEN"];
    public type: string;
    public destX: number;
    public destY: number;
    public xID: number;
    public yID: number;
    public markedForDeletion:bool = false;

    constructor(tX: number, tY: number, tType:string = "") {
        var url:string;

        if(tType == ""){
            tType = this.types[Math.floor(Math.random() * 5)];
        }

        //alert(tType);
        switch (tType) {
            case "HAMBURGER":
                url = "assets/img/food_burger.png";
                //cString = 'rgba(255,0,0,1)';
                break;
            case "FRIES":
                url = "assets/img/food_fries.png";
                //cString = 'rgba(0,255,0,1)';
                break;
            case "SUNDAE":
                url = "assets/img/food_sundae.png";
                //cString = 'rgba(0,0,255,1)';
                break;
            case "PIZZA":
                url = "assets/img/food_pizza.png";
                //cString = 'rgba(255,255,0,1)';
                break;
            case "CHICKEN":
                url = "assets/img/food_chicken.png";
                //cString = 'rgba(0,255,255,1)';
                break;
        }
        super(url);
        this.type = tType;

        //var cString: string;

        //this.graphics.beginFill(cString).drawRect(0, 0, 80, 80);
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