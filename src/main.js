"use strict";

import * as PIXI from 'pixi.js';
import * as TWEEN from 'es6-tween';

import Resources from './resources.js';
import Arrow from './arrow.js';
import PrizeWheel from './wheel.js';
import LuckyNumber from './lucky-number.js';


const {WHEEL_SIZE, IDLE_TURNS, DPS} = {...Resources.settings};

class Main {

    constructor() {
        var renderOptions = {
            resolution: PIXI.settings.RESOLUTION,
            autoResize: true
        };

        // enable or disable user interactions
        this.interactive = false;

        this.app = new PIXI.Application(WHEEL_SIZE, WHEEL_SIZE, renderOptions);
        this.app.view.style.opacity = 0;
        document.body.appendChild(this.app.view);

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.wheel = new PrizeWheel();
        this.arrow = new Arrow();
        const winningNumber = new LuckyNumber();

        this.container.addChild(
            this.wheel.sprite, this.arrow.sprite, winningNumber.sprite
        );

        this.resized = false;
        window.addEventListener('resize', () => {
            this.resized = true;
        });
        this.updateResize();

        new TWEEN.Tween({opacity: 0})
            .to({opacity: 1}, 400)
            .on('update', ({opacity}) => {
                this.app.view.style.opacity = opacity;
            })
            .on('complete', () => {
                this.interactive = true;
            })
            .start();

        document.addEventListener('click', () => {
            if (this.interactive) {
                let min = 2000;
                let max = 4000;
                const duration = Math.floor(Math.random() * (max - min)) + min;

                winningNumber.shuffle();
                let theta = 360 * IDLE_TURNS + winningNumber.getSector() * DPS;

                // update to minimal wheel turns
                while (theta - this.wheel.getAngle() < 360 * IDLE_TURNS) {
                    theta += 360;
                }

                // the last spoke passed
                this.spoke = 0;

                this.interactive = false;
                this.wheel
                    .rotate(theta, duration)
                    .then(winningNumber.show.bind(winningNumber))
                    .then(() => {
                        this.interactive = true;
                    });
            }
        });

        this.app.ticker.add(this.enterFrame, this);
    }

    updateResize() {
        const width = Math.min(
            window.innerWidth, document.documentElement.clientWidth
        );
        const height = Math.min(
            window.innerHeight, document.documentElement.clientHeight
        );
        this.app.renderer.resize(width, height);

        const wheelSize = Math.min(width, height) * 0.8 / WHEEL_SIZE;

        this.container.x = width / 2;
        this.container.y = height / 2;

        this.container.scale.x = wheelSize;
        this.container.scale.y = wheelSize;
    }

    /**
     * Main enterFrame loop.
     */
    enterFrame(delta) {

        if (this.resized) {
            // prevent flickering, will update on next vsync
            requestAnimationFrame(
               this.updateResize.bind(this)
            )
        }

        let angle = this.wheel.getAngle();

        // update tweens before spoke detection
        TWEEN.update();

        if (false === this.interactive) {
            // angular distance on which arrow touches the wheel spokes
            // half sector (11.5°) plus angular length of spoke (2.28°)
            let currentAngle = this.wheel.getAngle();
            let k = ((currentAngle + 11.5 + 2.28) / DPS) >> 0;
            // prevent multiple shakes on same spoke
            if (k > this.spoke) {
                this.spoke = k;
                const deltaAngle = Math.abs(currentAngle - angle);
                this.arrow.shake(this.app.ticker.elapsedMS, deltaAngle);
            }
        }
    }
}

export default Main;
