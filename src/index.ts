import "phaser";

var config = {
    type: Phaser.CANVAS,
    parent: "game",
    width: 800,
    height: 600,
    zoom: 2,
    loader: {
        path: "src/"
    },
    render: {
        antialias: false,
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 600 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var platforms;
var player;
var cursors;

function preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png", {
        frameWidth: 32,
        frameHeight: 48
    });
}

function create() {
    this.add.image(400, 300, "sky");
    this.add.image(400, 300, "star");

    // Platforms
    platforms = this.physics.add.staticGroup();
    platforms
        .create(400, 568, "ground")
        .setScale(2)
        .refreshBody();
    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");

    // Player
    player = this.physics.add.sprite(100, 100, "dude");
    player.setDrag(1000, 0);
    player.setBounce(0.2);
    player.setMaxVelocity(240, Infinity);
    player.setSize(28, 32).setOffset(2, 48 - 32);
    player.setCollideWorldBounds(true);
    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 4 }],
        frameRate: 20
    });
    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    player.body.setGravityY(300);
    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.left.isDown) {
        player.setAccelerationX(-600);
        player.anims.play("left", true);
    } else if (cursors.right.isDown) {
        player.setAccelerationX(600);
        player.anims.play("right", true);
    } else {
        player.setAccelerationX(0);
        // player.setVelocityX(0);
        player.anims.play("turn");
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-600);
    }
}
