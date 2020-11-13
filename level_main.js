var PLAYER_DATA = null;
var holdicons = [];
var X_POS_ICONS_LEVEL = 120;
var levelNum = 50;
var scrollingMap;
var map;
var txtLevel;


var main_state = {
    init: function() {
        level.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        level.scale.maxWidth = 800;
        level.scale.maxHeight = 600;
        level.scale.pageAlignHorizontally = true;
        level.scale.pageAlignVertically = true;
        level.scale.setScreenSize(true);
    },
    preload: function() {
        level.load.spritesheet('levelIcons', 'assets/imagesLevel/level_icons.png', 96, 96);
        level.load.bitmapFont('font72', 'assets/imagesLevel/font72.png', 'assets/imagesLevel/font72.xml');
        level.load.image('map', 'assets/imagesLevel/map.png');
        initProgressData();
    },
    create: function() {
        level.stage.backgroundColor = '#5d6479';
        level.world.setBounds(0, 0, 2000, 2000);
        createLevelIcons();
        animateLevelIcons();

        scrollingMap = level.add.group();
        map = scrollingMap.create(0, 0, 'map');
        scrollingMap.create(createLevelIcons());

        this.dragging = false;
        this.autoScroll = false;
        this.timeConstant = 325;
        level.input.onDown.add(beginMove, this);
        level.input.onUp.add(endMove, this);
        level.input.addMoveCallback(moveCamera, this);
    },
    update: function() {
        if(this.autoScroll && this.amplitude != 0){
            this.elapsed = Date.now() - this.timestamp;
            var delta = -this.amplitude * Math.exp(-this.elapsed / this.timeConstant);
            if ((delta > 0.5 || delta < -0.5)) {
                level.camera.x = this.target - delta;
                this.autoScroll = true;
            }
            else {
                this.autoScroll = false;
                level.camera.x = this.target;
            }
        }
    }
}

function initProgressData() {
    if (!PLAYER_DATA) {
        var str = window.localStorage.getItem('myGame_progress');
        try {
            PLAYER_DATA = JSON.parse(str);
        } catch (e) {
            PLAYER_DATA = [];
        }
        if (Object.prototype.toString.call(PLAYER_DATA) !== '[object Array]') {
            PLAYER_DATA = [];
        }
    }
}

function createLevelIcons() {
    var levelLesson = 0;
    xpos = 0;
    ypos = 0;
    for(var i = 0; i < levelNum; i++) {
        levelLesson = levelLesson + 1;
        if (typeof PLAYER_DATA[levelLesson - 1] !== 'number') {
            if (levelLesson == 1) {
                PLAYER_DATA[levelLesson - 1] = 0;
            } else {
                PLAYER_DATA[levelLesson - 1] = -1;
            }
        }
        var playdata = PLAYER_DATA[levelLesson - 1];
        var isLocked = true;
        var stars = 0;
        if (playdata > -1) {
            isLocked = false;
            if (playdata < 4) {
                stars = playdata;
            }
        }

        xpos += X_POS_ICONS_LEVEL;
        if (ypos > 500) {
            ypos -= rand(100, 150);
        } else if (ypos > 200) {
            ypos -= rand(100, 200)
        } else {
            ypos += rand(150, 300);
        }


        // create icon
        holdicons[levelLesson - 1] = createLevelIcon(xpos, ypos, levelLesson, isLocked, stars);
        var backIcon = holdicons[levelLesson - 1].getAt(0);
        backIcon.health = levelLesson;
        backIcon.inputEnabled = true;
        backIcon.events.onInputDown.add(onSpriteDown, this);
    }
}

function animateLevelIcons() {
    for(var i = 0; i < holdicons.length; i++) {
        var iconGroup = holdicons[i];
        iconGroup.y = iconGroup.y + 600;
        var y = iconGroup.y;
        // tween animation
        level.add.tween(iconGroup).to({y: y-600}, 500, Phaser.Easing.Back.Out, true, (i*40));
    }
}

function createLevelIcon(xpos, ypos, levelLesson, isLocked, stars) {
    //create new group
    var iconGroup = level.add.group();
    iconGroup.x = xpos;
    iconGroup.y = ypos;
    //
    iconGroup.xOrg = xpos;
    iconGroup.yOrg = ypos;
    //
    var frame = 0;
    if (isLocked == false) {frame = 1}
    // add bg
    var icon1 = level.add.sprite(0, 0, 'levelIcons', frame);
    iconGroup.add(icon1);
    // add stars, text level
    if (isLocked == false) {
        if (levelLesson % 5 == 0) {
            txtLevel = level.add.bitmapText(30, 16, 'font72', ''+levelLesson, 55);
        } else {
            txtLevel = level.add.bitmapText(30, 16, 'font72', ''+levelLesson, 45);
        }
        iconGroup.add(txtLevel);
        var icon2 = level.add.sprite(0, 0, 'levelIcons', (2+stars));
        iconGroup.add(icon2);
    }
    return iconGroup;
}

function onSpriteDown(sprite, pointer) {
    var levelLesson = sprite.health;
    if (PLAYER_DATA[levelLesson - 1] < 0) {
        var iconGroup = holdicons[levelLesson -1];
        var xpos = iconGroup.xOrg;

        var tween = level.add.tween(iconGroup)
            .to({x: xpos+6}, 20, Phaser.Easing.Linear.None)
            .to({x: xpos-5}, 20, Phaser.Easing.Linear.None)
            .to({x: xpos+4}, 20, Phaser.Easing.Linear.None)
            .to({x: xpos-3}, 20, Phaser.Easing.Linear.None)
            .to({x: xpos+2}, 20, Phaser.Easing.Linear.None)
            .to({x: xpos}, 20, Phaser.Easing.Linear.None)
            .start();
    } else {
        var iconGroup = holdicons[levelLesson - 1];
        var tween = level.add.tween(iconGroup.scale)
            .to({x:0.9, y: 0.9}, 100, Phaser.Easing.Linear.None)
            .to({x:1.0, y: 1.0}, 100, Phaser.Easing.Linear.None)
            .start();
        tween._lastChild.onComplete.add(() => {
            onLevelSelected(sprite.health)
        }, this);
    }
}

function onLevelSelected(levelLesson) {
    level.state.states['level']._levelNumber = levelLesson;
    level.state.start('play');
}

function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
    scroll map
*/
function beginMove() {
    this.startX = level.input.x;
    this.dragging = true;
    this.timestamp = Date.now();
    this.velocity = this.amplitude = 0
}

function endMove() {
    this.dragging = false;
    this.autoScroll = false;
    if (level.input.activePointer.withinGame && (this.velocity > 10 || this.velocity < -10)) {
        this.amplitude = 0.8 * this.velocity;
        this.now = Date.now();
        this.target = Math.round(level.camera.x - this.amplitude);
        this.autoScroll = true;
    }
    if(!level.input.activePointer.withinGame){
        this.autoScroll = true;
    }
}

function moveCamera(pointer, x, y) {
    if(this.dragging){
        var delta = x - this.startX;
        this.startX = x;
        this.now = Date.now();
        var elapsed = this.now - this.timestamp;
        this.timestamp = this.now;

        var v = 1000 * delta / (1 + elapsed);
        this.velocity = 0.8 * v + 0.2 * this.velocity;

        level.camera.x -= delta;
    }
}
/*
    end scroll map
*/