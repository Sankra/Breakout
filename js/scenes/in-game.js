import { Scene } from "./scene.js";
import { Ball } from '../ball.js';
import { Paddle } from '../paddle.js';
import { Brick } from '../brick.js';
import { Bricks } from '../bricks.js';
import { Player } from '../player.js';

export class InGame extends Scene {
    constructor(canvas, maxWidth, maxHeight, level, startScore, startLives) {
        super();
        this.canvas = canvas;
        this.brickRowCount = 6;
        this.brickColumnCount = 7;
        this.remainingBricks = this.brickRowCount * this.brickColumnCount;

        this.ball = new Ball(maxWidth, maxHeight, level);
        this.paddle = new Paddle(maxWidth, maxHeight, canvas);
        this.bricks = new Bricks(this.brickRowCount, this.brickColumnCount, maxWidth);
        this.player = new Player(maxWidth, this.paddle, level, startScore, startLives);

        this.drawables = [this.bricks, this.player, this.ball, this.paddle];
        this.paddle.subscribeToInputEvents();
    }

    update() {
        this.paddle.update();
        const outOfBounds = this.ball.update(this.paddle);
        if (outOfBounds) {
            this.player.lives--;
            if (this.player.lives) {
                this.ball.reset();
                this.paddle.reset();
            }
        }

        this.collisionDetection();
    }

    draw(/** @type {WebGLRenderingContext} */ ctx) {
        this.canvas.style.cursor = "none";
        this.drawables.forEach(function (drawable) {
            drawable.draw(ctx);
        });
    }

    dispose() {
        this.paddle.unsubscribeToInputEvents();
    }

    collisionDetection() {
        for (var c = 0; c < this.brickColumnCount; c++) {
            for (var r = 0; r < this.brickRowCount; r++) {
                var b = this.bricks.bricks[c][r];
                if (b.status === 1) {
                    if (this.ball.x > b.x && this.ball.x < b.x + Brick.width && this.ball.y > b.y && this.ball.y < b.y + Brick.height) {
                        this.ball.dy = -this.ball.dy;
                        b.status = 0;
                        this.player.increaseScore();
                        this.remainingBricks--;
                    }
                }
            }
        }
    }
}