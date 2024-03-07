import { bird_bottom, bird_flap, numArr, pipes_0, pipes_0_mid, pipes_1_mid, visible } from './computed.js';
import { getRandomGapMid, initCaches, initElems, jumpBird, restart, startGame, stepTime } from './methods.js';

import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const { createApp } = Vue;

const firebaseConfig = {
    apiKey: 'AIzaSyAnctBbeQKwMXnOsUUr_D9XJwJjevLboNE',
    authDomain: 'jxl6891cs421hw3.firebaseapp.com',
    projectId: 'jxl6891cs421hw3',
    storageBucket: 'jxl6891cs421hw3.appspot.com',
    messagingSenderId: '953709878274',
    appId: '1:953709878274:web:39ee403347d7985deadb1b',
    measurementId: 'G-LKTSGPQPHV'
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const data = () => ({
    bases: [
        { left: 0 },
        { left: 0 }
    ], bird: {
        top: 0, vel: -500, accel: 1300
    }, cache: {}, pipes: [
        { left: 0, top: 0, vel: -3 },
        { left: 0, top: 0, vel: 0 }
    ], show: {
        startMenu: true, game: false, gameOver: false, night: false
    }, state: {
        onTick: 0, dt: 0.02, score: 0, best: 0, newBest: false
    }
});

const computed = {
    bird_bottom, bird_flap, numArr, pipes_0, pipes_0_mid, pipes_1_mid, visible
};

const methods = {
    getRandomGapMid, initCaches, initElems, jumpBird, restart, startGame, stepTime
};

const mounted = async function() {
    this.initCaches();
    this.initElems();

    const docRef = doc(db, 'users', '5wCyDu8ynmOVwIWF7Lj3');
    const docSnap = await getDoc(docRef);
    this.state.best = docSnap.data().best;

    let app = this;
    window.addEventListener('keydown', (evt) => {
        if (evt.key !== ' ' && evt.key !== 'ArrowUp') return;
        if (app.show.startMenu) return app.startGame();
        if (!app.show.gameOver) return app.jumpBird();
    });

    let wait;
    window.addEventListener('resize', () => {
        clearTimeout(wait);
        wait = setTimeout(() => {
            app.initCaches();
            app.initElems();
        }, 200);
    });
};

createApp({
    data, computed, methods, mounted
}).mount('#app');