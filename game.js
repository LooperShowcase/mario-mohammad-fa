kaboom({
  fullscreen: true,
  clearColor: [75, 0, 130, 1],
  global: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("sbob", "spongebob.png");
loadSprite("mario", "mario.png");
loadSprite("block", "block.png");
loadSprite("loop on top", "loop.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("coin", "coin.png");
loadSound("jamp", "jumpSound.mp3");
loadSound("gameSund", "gameSound.mp3");
loadSprite("surpise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("background", "background.jpg");
loadSprite("mushroom", "mushroom.png");
loadSprite("dino", "dino.png");
// loadSprite("", ".png");
// loadSprite("", ".png");
let score = 0;

scene("game", () => {
  play("gameSund");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "=                                                        ^                                                                                                        ",
    "=                                                                                                                                                                 ",
    "=                                                       =========                                                                                                          ",
    "=                                                                 =     =  =     =  =    =                                                                                           ",
    "=                                                                                          =                                                                           ",
    "=                                                                                                                                                                     ",
    "=                                                                                                 =                                                                     ",
    "=                                                                                =    =     =                                                                                         ",
    "=                                                                           =                                                                                                        ",
    "=                                                                      =                                                                                                      ",
    "=                                                                         =                                                                                             ",
    "=                         *                        *                          ==========                                                                                           ",
    "=                                                                                        =                                               ",
    "=         *                                                                                     =                                           ",
    "=                          *                                                                        =                                                          ",
    "=                             !   !!!!!!!!!                *                                           =                                   ",
    "=                 !                                                                                         =                     ",
    "=  *                               ==========                                                                   =   =                      ",
    "=                         +   =                     *                                                                   =        ",
    "=                    =   =                    =                                                                              =                             ",
    "=             +   =                             =                                                                                  =                                ",
    "=             =                                                                                                                                                      ",
    "=                                                  = =  *                                            !                          =                                               ",
    "=                   v                                    =                                                                                                          ",
    "=               =                                                                                    =                    =  =                                        ",
    "=            v                                             =           *          =    =           =                   =                                                      ",
    "=                   =                         !                                                                     =                                                  ",
    "=       a         =                                            =               =          =      =                 =                                                          ",
    "=           =                                                        =                                          =                                                       ",
    "=====================================    ==========================================         ====================================================================",
    "                                                                      ",
    "                                                                     ",
  ];
  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid()],
    "|": [sprite("pipe")],
    "+": [sprite("coin"), "coins"],
    "!": [sprite("surpise"), solid(), "coin_surprise"],
    $: [sprite("unboxed"), solid()],
    "*": [sprite("loop on top")],
    v: [sprite("surpise"), solid(), "mushroom-box"],
    n: [sprite("mushroom"), "mshroom-surprise", body()],
    a: [sprite("dino"), "dino", body()],
    "^": [sprite("pipe"), solid(), "pipe"],
  };
  const gameLevel = addLevel(map, mapSymbols);
  let isJumping = false;

  const background = add([
    sprite("background"),
    layer("bg"),
    scale(2),
    pos(width() / 2, height() / 2),

    origin("center"),
  ]);
  const player = add([
    sprite("sbob"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  const scopreLabel = add([text("score" + score)]);

  keyDown("d", () => {
    player.move(150, 0);
  });
  keyDown("a", () => {
    player.move(-150, 0);
  });
  keyDown("space", () => {
    if (player.grounded()) {
      play("jamp");

      player.jump(350);
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("coin_surprise")) {
      destroy(obj);
      gameLevel.spawn("$", obj.gridPos);
      gameLevel.spawn("+", obj.gridPos.sub(0, 1));
    }
    if (obj.is("mushroom-box")) {
      destroy(obj);
      gameLevel.spawn("$", obj.gridPos);
      gameLevel.spawn("n", obj.gridPos.sub(0, 1));
    }
  });

  action("mshroom-surprise", (obj) => {
    obj.move(20, 0);
  });
  player.collides("coins", (obj) => {
    destroy(obj);
    score += 5;
  });
  player.collides("mshroom-surprise", (obj) => {
    destroy(obj);
    player.biggify(9);
    score += 10;
  });
  action("dino", (obj) => {
    obj.move(50, 0);
  });

  player.action(() => {
    camPos(player.pos);
    scopreLabel.pos = player.pos.sub(450, 300);
    scopreLabel.text = "score: " + score;
    background.use(pos(player.pos));
    // add this
    if (player.pos.y >= 700) {
      go("lose");
    }
  });
  player.collides("pipe", () => {
    keyDown("down", () => {
      go("win");
    });
  });

  player.collides("dino", (dino) => {
    if (isJumping) {
      destroy(dino);
    } else {
      go("lose");
    }
  });
  player.action(() => {
    isJumping = !player.grounded();
  });
});

start("game");

scene("lose", () => {
  score = 0;
  add([
    text("Game over\nTry again", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyDown("space", () => {
    go("game");
  });
});

scene("win", () => {
  add([text("Win", 64), origin("center"), pos(width() / 2, height() / 2)]);
  keyDown("space", () => {
    go("game");
  });
});
