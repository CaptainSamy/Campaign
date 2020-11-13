
var play_state = {
    create: function () {
        // showing level title
        var style = {
            font: "32px Arial",
            fill: "#ffffff"
        };
        var levelTitle = level.add.text(0,0,"PLAYING LEVEL "+level.global.level,style);
        levelTitle.align = "center";
        levelTitle.x = (level.width - levelTitle.width) / 2;
        // showing game thumbnails
        for(var i=0; i<=3; i++){
            var gameThumb = level.add.button(level.width/2, 90*(i+1), "level", this.levelFinished, this);
            gameThumb.anchor.setTo(0.5);
            gameThumb.frame = i;
        }
    }
}

function levelFinished(button) {
    // did we improved our stars in current level?
    if(level.global.starsArray[level.global.level-1]<button.frame){
        level.global.starsArray[level.global.level-1] = button.frame;
    }
    // if we completed a level and next level is locked - and exists - then unlock it
    if(button.frame>0 && level.global.starsArray[level.global.level]==4 && level.global.level< level.global.starsArray.length){
        level.global.starsArray[level.global.level] = 0;
    }
    // back to level selection
    level.state.start("main");
}