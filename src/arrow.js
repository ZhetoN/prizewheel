"use strict";

import * as TWEEN from 'es6-tween';
import Resources from './resources.js';

class Arrow {

    constructor() {
        const sprite = Resources.sprites.arrow;
        sprite.anchor.set(0.5);
        sprite.pivot.set(25, 0);
        sprite.width = 100;
        sprite.height = 100;
        sprite.x = 230;
        this.sprite = sprite;

        const rotation = { angle: 0 }
        this.tween = new TWEEN.Tween(rotation)
            .on('update', ({angle}) => {
                this.sprite.rotation = angle;
            })
            .on('complete', () => {
                Resources.sounds.spin.play('shake');
            });

        const tweenBackward = new TWEEN.Tween(rotation)
            .easing(TWEEN.Easing.Quadratic.In)
            // backward time at least 2 frames @60 fps
            .to({angle: 0}, 35)
            .on('update', ({angle}) => {
                this.sprite.rotation = angle;
            });

        this.tween.chain(tweenBackward);
    }

    shake(deltaTime, deltaAngle) {
        // angle per wheel spoke, radians
        const len = 8.8 * (Math.PI / 180);
        // angular speed, radians per ms
        const omega = deltaAngle * (Math.PI / 180) / deltaTime;
        // arrow angle to pass spoke, radians
        const angle = 30.18 * (Math.PI / 180);
        // time, ms to pass one spoke with omega speed
        const time = len / omega;

        this.tween.to({angle: 0 - angle}, time).start();
    }
}

export default Arrow;
