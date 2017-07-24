"use strict";

import * as PIXI from 'pixi.js';
import * as TWEEN from 'es6-tween';

import Resources from './resources.js';

const {WHEEL_SIZE, NUMBERS, SECTORS} = {...Resources.settings}

class LuckyNumber {

    constructor(lucky_number) {

        this.value = null;

        const style = {
            fontFamily: 'Bevan',
            fontSize: WHEEL_SIZE * 0.5 + 'px',
            fill: ['#FF2F3F', '#FF2F3F', '#B32017'],
            stroke: '#ffffff',
            strokeThickness: 5,
        };

        const updatedStyle = {
            stroke: '#000000',
            strokeThickness: 10
        };

        this.sprite = new PIXI.Container();
        this.sprite.alpha = 0;

        this.sprite.addChild(
            new PIXI.Text('', Object.assign({}, style, updatedStyle)),
            new PIXI.Text('', style)
        );

        this.sprite.children.forEach((obj) => {
            obj.anchor.set(0.5);
        });


        let n = 0;
        const props = {scale: 0.9, alpha: 0};

        this.tween = new TWEEN.Tween(props)
            .easing(TWEEN.Easing.Cubic.In)
            .to({scale: 1, alpha: 1}, 100)
            .on('start', () => {
                this.sprite.children.forEach((sprite) => {
                    sprite.text = '0';
                });
            })
            .on('update', ({scale, alpha}) => {
                this.sprite.scale = {x: scale, y: scale};
                this.sprite.alpha = alpha;
            })
            .on('complete', () => {
                if (n == this.value) {
                    // reset the value
                    // to prevent repeated usage of same number
                    this.value = null;
                    n = 0;
                    Resources.sounds.win.play();
                    tweenOut.to({alpha: 0}, 400)
                        .on('complete', this.resolve)
                        .delay(2000)
                        .start()
                } else {
                    tweenOut.to({alpha: 0}, 50).delay(100).start();
                }
            });

        const tweenOut = new TWEEN.Tween({alpha: 1})
            .easing(TWEEN.Easing.Quadratic.Out)
            .on('update', ({scale, alpha}) => {
                this.sprite.alpha = alpha;
            })
            .on('complete', () => {
                if (n < this.value) {
                    n++;
                    this.sprite.children.forEach((sprite) => {
                        sprite.text = n.toString();
                    });
                    this.tween.start();
                }
            });
    }

    shuffle() {
        // assume we get lucky number from backend
        this.value = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    }

    getSector() {
        if (this.value) {
            // use unique numbers values for lucky number
            // instead of sectors indicies
            const indicies = SECTORS.reduce(
                (a, e, i) => (e === this.value) ? a.concat(i) : a, []
            );
            return indicies[Math.floor(Math.random() * indicies.length)];
        }

        throw "Call LuckyNumber.shuffle() first";
    }


    show() {
        this.sprite.alpha = 0;
        this.sprite.children.forEach((sprite) => {
            sprite.text = '0';
        });

        this.tween.start();

        return new Promise((resolve, reject) => {
            this.resolve = resolve;
        });
    }
}

export default LuckyNumber;
