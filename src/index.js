"use strict";

import Resources from './resources.js';
import Main from './main.js';
import LoadingIndicator from "./loading.js";


PIXI.settings.RESOLUTION = window.devicePixelRatio;

window.WebFontConfig = {
    google: {
        families: ['Bevan'],
        text: '0123456789'
    },
    active: () => {
        Resources.load()
            .then(() => {
                return LoadingIndicator.hide();
            })
            .then(() => {
                new Main();
            });
    }
};

(function() {
    var wf = document.createElement('script');
    wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();

document.addEventListener("DOMContentLoaded", () => {
    // show loading after 150 ms
    LoadingIndicator.show(150);
});

