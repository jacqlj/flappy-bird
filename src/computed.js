export const bird_bottom = {
    get() {
        return this.bird.top + this.cache.birdRect.height;
    }, set(bottom) {
        this.bird.top = bottom - this.cache.birdRect.height;
    }
};

export function bird_flap() {
    return this.bird.vel < -100 ? 'down' : this.bird.vel > 100 ? 'up' : 'mid';
}

export function pipes_0() {
    return {
        bottom: this.pipes[0].top + this.cache.pipePartRect.height,
        right: this.pipes[0].left + this.cache.pipePartRect.width
    };
}

export const pipes_0_mid = {
    get() {
        return this.pipes[0].top + this.cache.pipePartRect.height + this.cache.gapHeight / 2;
    }, set(gap_mid) {
        this.pipes[0].top = gap_mid - this.cache.pipePartRect.height - this.cache.gapHeight / 2;
    }
};

export const pipes_1_mid = {
    get() {
        return this.pipes[1].top + this.cache.pipePartRect.height + this.cache.gapHeight / 2;
    }, set(gap_mid) {
        this.pipes[1].top = gap_mid - this.cache.pipePartRect.height - this.cache.gapHeight / 2;
    }
};

export function numArr() {
    return {
        score: String(this.state.score).split(''),
        best:  String(this.state.best ).split('')
    }
}

export function scoreNumArr() {
    return String(this.state.score).split('');
}

export function bestNumArr() {
    return String(this.state.best).split('');
}

export function visible() {
    return {
        startMenu: this.show.startMenu                   ? 'visible' : 'hidden',
        game:      this.show.game                        ? 'visible' : 'hidden',
        score:     this.show.game && !this.show.gameOver ? 'visible' : 'hidden',
        gameOver:  this.show.gameOver                    ? 'visible' : 'hidden'
    };
}