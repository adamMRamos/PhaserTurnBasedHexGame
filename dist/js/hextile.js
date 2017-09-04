//  Here is a custom game object
HexTile = function (game, x, y, tileImage,isVertical, i,j, type) {

    Phaser.Sprite.call(this, game, x, y, tileImage);

    this.anchor.setTo(0.5, 0.5);
    this.tileTag = game.make.text(0,0,type);

    this.tileTag.anchor.setTo(0.5, 0.5);

    this.tileTag.addColor('#ffffff',0);
    if(isVertical){
        this.tileTag.rotation=-Math.PI/2;
    }

    this.addChild(this.tileTag);
    this.tileTag.visible=false;
    this.revealed=false;
    this.name="tile"+i+"_"+j;
    this.type=type;

    if(isVertical){
        this.rotation=Math.PI/2;
    }
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.events.onInputOut.add(this.rollOut, this);
    this.events.onInputOver.add(this.rollOver, this);
    this.marked=false;
};

HexTile.prototype = Object.create(Phaser.Sprite.prototype);
HexTile.prototype.constructor = HexTile;

HexTile.prototype.rollOut=function(){
    this.scale.x = 1;
    this.scale.y = 1;
};

HexTile.prototype.rollOver=function(){
    this.scale.x = 0.9;
    this.scale.y = 0.9;
};

HexTile.prototype.reveal=function(){
    this.tileTag.visible=true;
    this.revealed=true;
    if(this.type==10){
        this.tint='0xcc0000';
    }else{
        this.tint='0x00cc00';
    }
};

HexTile.prototype.toggleMark=function(){
    if(this.marked){
       this.marked=false; 
       this.tint='0xffffff';
    }else{
        this.marked=true;
        this.tint='0x0000cc';
    }
};