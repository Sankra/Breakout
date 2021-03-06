import { Drawable } from "./drawable.js";
import { clamp, r2c } from "./helpers.js";
import { Paddle } from "./paddle.js";

export class Ball extends Drawable {
    constructor(maxWidth, maxHeight, level) {
        super();
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.speed = 3 + level
        this.reset();
    }

    static get radius() {
        return 6;
    }

    reset() {
        this.x = (this.maxWidth - Ball.radius) / 2;
        this.y = this.maxHeight - Ball.radius + 1 - Paddle.height * 2;
        this.dx = this.speed;
        this.dy = -this.speed;
    }

    update(paddle) {
        this.x += this.dx;
        this.y += this.dy;
        if (this.y < Ball.radius) {
            this.dy = this.speed;
        } else if (r2c(paddle.x, paddle.y, paddle.x + Paddle.width, paddle.y + Paddle.height, this.x, this.y, Ball.radius)) {
            this.dy = -this.speed;
        } else if (this.y + Ball.radius > this.maxHeight) {
            return true;
        }

        this.x = clamp(this.x, Ball.radius - 1, this.maxWidth - Ball.radius + 1);
        this.y = clamp(this.y, Ball.radius - 1, this.maxHeight - Ball.radius);
        if (this.x > this.maxWidth - Ball.radius || this.x < Ball.radius) {
            this.dx = -this.dx;
        }

        return false;
    }

    draw(/** @type {WebGLRenderingContext} */ ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }
}