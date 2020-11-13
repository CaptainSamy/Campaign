var level = new Phaser.Game(800, 600, Phaser.CANVAS, 'level');

level.global = {
    // array with finished levels and stars collected.
    // 0 = playable yet unfinished level
    // 1, 2, 3 = level finished with 1, 2, 3 stars
    // 4 = locked
    starsArray : [0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    // level currently playing
    level : 0
}

level.state.add('main', main_state);
level.state.add('play', play_state);

level.state.start('main');