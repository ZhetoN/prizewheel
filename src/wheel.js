"use strict";

import * as TWEEN from 'es6-tween';

import Resources from './resources.js';

const {WHEEL_SIZE} = {...Resources.settings};

class PrizeWheel {

    constructor() {
        const sprite = Resources.sprites.wheel;
        sprite.anchor.set(0.5);
        sprite.width  = WHEEL_SIZE;
        sprite.height = WHEEL_SIZE;
        this.sprite = sprite;

        this.currentAngle = { angle: 0 };
        this.tween = new TWEEN.Tween(this.currentAngle)
            .easing(TWEEN.Easing.Cubic.Out)
            .on('update', ({angle}) => {
                this.sprite.rotation = angle * (Math.PI / 180);
            })
            .on('complete', () => {
                // normalize angle
                this.currentAngle.angle %= 360;
                this.resolve();
            });
    }

    rotate(angle, duration) {
        this.tween.to({angle: angle}, duration).start();
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
        });
    }

    getAngle() {
        return this.currentAngle.angle;
    }
}

export default PrizeWheel;