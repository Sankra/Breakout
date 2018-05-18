import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { Brick } from './brick.js';
import { Bricks } from './bricks.js';
import { Player } from './player.js';

const maxWidth = 480;
const maxHeight = 360;
const brickRowCount = 6;
const brickColumnCount = 7;

const canvas = document.getElementById("myCanvas");
canvas.style.width = maxWidth + "px";
canvas.style.height = maxHeight + "px";

const ball = new Ball(maxWidth, maxHeight);
const paddle = new Paddle(maxWidth, maxHeight, document);
const bricks = new Bricks(brickRowCount, brickColumnCount, maxWidth);
const player = new Player(maxWidth, paddle);

const drawables = [ball, paddle, bricks, player];
const updateables = [ball, paddle];


/** @type {WebGLRenderingContext} */
const ctx = canvas.getContext("2d");
ctx.scale(2,2);

function draw() {
    ctx.clearRect(0, 0, maxWidth, maxHeight);

    updateables.forEach(function (updateable) {
        updateable.update();
    });

    
    if (ball.y + ball.dy > maxHeight - ball.radius) {
        if (ball.x > paddle.x && ball.x < paddle.x + Paddle.width) {
            ball.dy = -ball.dy;
        }
        else {
            player.lives--;
            if (!player.lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                ball.reset();
                paddle.reset();
            }
        }
    }

    collisionDetection();

    drawables.forEach(function (drawable) {
        drawable.draw(ctx);
    });

    requestAnimationFrame(draw);
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks.bricks[c][r];
            if (b.status == 1) {
                if (ball.x > b.x && ball.x < b.x + Brick.width && ball.y > b.y && ball.y < b.y + Brick.height) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    player.score++;
                    if (player.score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

draw();