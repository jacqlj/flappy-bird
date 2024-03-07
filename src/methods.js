import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

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

export function initCaches() {
    this.cache.canvasRect      = this.$refs.canvas.getBoundingClientRect();
    this.cache.baseRect        = this.$refs.base.getBoundingClientRect();
    this.cache.birdRect        = this.$refs.bird.getBoundingClientRect();
    // have to set this manually for some reason
    this.cache.birdRect.height = this.cache.birdRect.width / 17 * 12;
    this.cache.pipePartRect    = this.$refs.pipeUpper[0].getBoundingClientRect();
    this.cache.gapHeight       = this.$refs.pipe[0].clientHeight - 2 * this.cache.pipePartRect.height;
    this.cache.scoreNegSpc     = this.$refs.score.clientHeight / 10;
}

export function initElems() {
    // vertically center bird
    this.bird.top = (this.cache.canvasRect.height - this.cache.birdRect.height) / 2;

    // position and init pipes
    this.pipes.forEach((p) => p.left = this.cache.canvasRect.width + 100);
    this.pipes[0].vel = -3;
    this.pipes[1].vel = 0;
    this.pipes_0_mid = this.getRandomGapMid();

    // position base
    this.bases[0].left = 0;
    this.bases[1].left = this.cache.baseRect.width;
}

export function startGame() {
    if (this.show.gameOver) return this.restart();
    this.show.startMenu = false;
    this.show.game = true;
    this.onTick = setInterval(this.stepTime, this.state.dt * 1e3);
}

export async function stepTime() {
    // move bird
    if (this.bird.top < 0) {
        this.bird.vel = 0;
        this.bird.top = 0;
    } else {
        this.bird.vel += this.bird.accel * this.state.dt;
        this.bird.top += this.bird.vel * this.state.dt;
    }

    // move base to match pipes
    this.bases.forEach(b => b.left += this.pipes[0].vel);
    if (this.bases[0].left <= 0) this.bases[1].left = this.bases[0].left + this.cache.baseRect.width;
    if (this.bases[1].left <= 0) this.bases[0].left = this.bases[1].left + this.cache.baseRect.width;

    // move pipes
    this.pipes.forEach(p => p.left += p.vel);

    // if bird passes a pipe
    if (this.pipes_0.right <= this.cache.birdRect.left - this.cache.canvasRect.left) {
        // switch pipe positions
        this.pipes[1].left = this.pipes[0].left;
        this.pipes[0].left = this.cache.canvasRect.width;
        this.pipes_1_mid = this.pipes_0_mid;
        // get new gap position, try to make gaps at least 1⁄4 × gap height
        let tries = 0;
        while (Math.abs(this.pipes_0_mid - this.pipes_1_mid) < this.cache.gapHeight * 0.25) {
            this.pipes_0_mid = this.getRandomGapMid();
            if (++tries > 1000) break;
        }
        // update score, change background every 20 pipes
        this.state.score++;
        if (this.state.score % 20 === 0) this.show.night = !this.show.night;
        // scale speed to score
        this.pipes.forEach(p => p.vel = -3 - this.state.score * 0.05);
    }

    switch (collision(this)) {
        // don't do anything and exit function if no collision
        case '':
            return;

        // game over if collision
        // snap to corresponding position for visual effect
        case 'base':
            this.bird_bottom = this.cache.baseRect.top - this.cache.canvasRect.top;
            break;
        case 'pillar-upper':
            this.bird.top = this.pipes_0.bottom;
            break;
        case 'pillar-lower':
            this.bird_bottom = this.pipes_0.bottom + this.cache.gapHeight;
            break;
    }

    clearInterval(this.onTick);

    // retrieve and save best to firestore
    const docRef = doc(db, 'users', '5wCyDu8ynmOVwIWF7Lj3');
    if (this.state.score > this.state.best) {
        this.state.newBest = true;
        this.state.best = this.state.score;
        try {
            await setDoc(docRef, { best: this.state.score });
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    }
    this.show.gameOver = true;
}

function collision(app) {
    if (app.bird_bottom >= app.cache.baseRect.top - app.cache.canvasRect.top) return 'base';
    if (app.cache.birdRect.right - app.cache.canvasRect.left >= app.pipes[0].left) {
        if (app.pipes_0.bottom - app.bird.top >= 0) {
            return app.pipes_0.bottom - app.bird.top <= app.cache.birdRect.height * 0.5
                ? 'pillar-upper' : 'pillar-upper-side';
        }
        if (app.bird_bottom - app.pipes_0.bottom - app.cache.gapHeight >= 0) {
            return app.bird_bottom - app.pipes_0.bottom - app.cache.gapHeight <= app.cache.birdRect.height * 0.5
                ? 'pillar-lower' : 'pillar-lower-side';
        }
    }
    return '';
}

export function getRandomGapMid() {
    const max = this.cache.canvasRect.height - this.cache.baseRect.height - this.cache.gapHeight * 1.5;
    const min = this.cache.baseRect.height / 2 + this.cache.gapHeight;
    return Math.random() * (max - min) + min;
}

export function jumpBird() {
    this.bird.vel = -500;
}

export function restart() {
    this.show.startMenu = true;
    this.show.game = false;
    this.show.gameOver = false;
    this.initElems();
    this.bird.vel = -500;
    this.state.score = 0;
    this.state.newBest = false;
}