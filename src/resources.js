"use strict";

import * as PIXI from 'pixi.js';
import * as sound from 'pixi-sound';


const WHEEL_SIZE = 400;
const IDLE_TURNS = 2;

// sector numbers on wheel counter,
// starting from 3 o'clock, counterclockwise
const SECTORS = [4, 2, 6, 3, 7, 5, 3, 5, 2, 15, 3, 2, 5, 7, 3, 2];
// degrees per wheel sector
const DPS = 360 / SECTORS.length;
// unique numbers on wheel
const NUMBERS =  [...new Set(SECTORS)];

class Resources {

	constructor() {
	    let path = 'assets/images/';
	    path += PIXI.settings.RESOLUTION === 2 ? 'wheel@x2.png' : 'wheel.png';
	    PIXI.loader
	        .add('wheel', path)
	        .add('arrow', 'assets/images/arrow.png')
	        .add('win', 'assets/sounds/win.mp3')
	        .add('spin', 'assets/sounds/prize-wheel.wav');

	    this.sprites = {};
	    this.sounds = {};
	    this.settings = {
			WHEEL_SIZE,
			IDLE_TURNS,
			DPS,
			NUMBERS,
			SECTORS
		}
	}

	load() {
		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			try {
				PIXI.loader.load(this.onAssetsLoaded.bind(this));
			} catch (e) {
				reject(e);
			}
		});
	}

	onAssetsLoaded(loader, resources) {
	    resources.wheel.texture.baseTexture.mipmap = true;
	    resources.arrow.texture.baseTexture.mipmap = true;
	    this.sprites.wheel = new PIXI.Sprite(resources.wheel.texture);
	    this.sprites.arrow = new PIXI.Sprite(resources.arrow.texture);
	    this.sounds.win = resources.win.sound;
	    this.sounds.spin = resources.spin.sound;
	    this.sounds.spin.addSprites('shake', {
	        start: 8.71,
	        end: 8.89
	        // or start: 0.2, end: 0.7
	    });
	    this.resolve();
	}
}

export default (new Resources());
