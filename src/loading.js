"use strict";

class LoadingIndicator {

    constructor() {
        this.elm = document.createElement('div');
        this.elm.innerText = "Loading... Please wait";
        Object.assign(this.elm.style, {
            position: 'fixed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Arial, sans-serif',
            width: '100%',
            height: '100%',
            color: '#ffffff',
            fontSize: '30px',
            textAlign: 'center',
            opacity: 0,
            transition: 'opacity 0.4s ease-in'
        });
    }

    show(delay) {
        this.timer = setTimeout(() => {
            this.timer = null;
            document.body.append(this.elm);
            // reflow
            this.elm.offsetWidth;
            this.elm.style.opacity = 1;
        }, delay);
    }

    hide() {
        return new Promise((resolve, reject) => {
            if (this.timer) {
                clearTimeout(this.timer);
                resolve();
            } else {
                this.elm.addEventListener('transitionend', () => {
                    document.body.removeChild(this.elm);
                    resolve();
                });
                this.elm.style.opacity = 0;
            }
        });
    }
}

export default (new LoadingIndicator());
