const md5 = require("js-md5");
class Tank {
    constructor(x, y, skin, health = 1, speed = 1, size = 32, move = -1) {
        if (move === -1) {
            move = 90 * Math.floor(Math.random() * 4);
            move = move % 360;
        }
        this.x = x;
        this.y = y;
        this.size = size;
        this.uuid = md5(skin + Date.now() + move);
        this.move = +move;
        this.skin = skin;
        this.health = +health;
        this.speed = +speed;
        this.pulya = { x: -32, y: -32, speed: 4, move, size };
    }
}

module.exports = Tank;