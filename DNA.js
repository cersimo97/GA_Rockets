const LIFE_DURATION = 2000;
const WINDOW_WIDTH = 300;
const WINDOW_HEIGHT = 300;

class DNA {
    constructor(startX, startY, targetX, targetY, cromosomes) {
        this.startX = startX;
        this.startY = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.deadAt = -1;
        if(cromosomes == undefined) {
            this.cromosomes = DNA.generateCode();
        } else {
            this.cromosomes = cromosomes;
        }
    }

    buildPath() {
        var path = [[this.startX, this.startY]];
        for(let i = 0; i < this.cromosomes.length; i++) {
            let moveX, moveY;
            let p = Math.floor(Math.random() * 5 + 1);  // p è il passo
            switch(this.cromosomes[i]) {
                case 0:
                    moveX = -p;
                    moveY = -p;
                    break;
                case 1:
                    moveX = 0;
                    moveY = -p;
                    break;
                case 2:
                    moveX = p;
                    moveY = -p;
                    break;
                case 3:
                    moveX = p;
                    moveY = 0;
                    break;
                case 4:
                    moveX = p;
                    moveY = p;
                    break;
                case 5:
                    moveX = 0;
                    moveY = p;
                    break;
                case 6:
                    moveX = -p;
                    moveY = p;
                    break;
                case 7:
                    moveX = -p;
                    moveY = 0;
                    break;
            }
            let newX = path[path.length - 1][0] + moveX;
            let newY = path[path.length - 1][1] + moveY;
            path.push([newX, newY]);
        }

        this.endX = path[path.length - 1][0];
        this.endY = path[path.length - 1][1];
        this.path = path;
        return path;
    }

    calcFit(obstacles) {
        var outOfBounds = false;
        var targetReached = false;
        var touchedObst = false;
        var i = 0;
        var minDist = Infinity;
        while(i < this.path.length && !outOfBounds && !targetReached && !touchedObst) {
            if(this.path[i][0] < 0 || this.path[i][0] > WINDOW_WIDTH
                || this.path[i][1] < 0 || this.path[i][1] > WINDOW_HEIGHT) {
                    outOfBounds = true;
            }
            if(Math.abs(this.path[i][0] - this.targetX) <= DIAMETER / 2 &&
                Math.abs(this.path[i][1] - this.targetY) <= DIAMETER / 2) {
                targetReached = true;
                this.deadAt = i;
            }
            for(let k = 0; k < obstacles.length; k++) {
                let ob = obstacles[k];
                if(this.path[i][0] + DIAMETER / 2 >= ob.x && this.path[i][0] - DIAMETER / 2 <= ob.x + ob.w
                    && this.path[i][1] + DIAMETER / 2 >= ob.y && this.path[i][1] - DIAMETER / 2 <= ob.y + ob.h) {
                        touchedObst = true;
                        this.deadAt = i;
                }
            }

            let pointDist = dist(this.path[i][0], this.path[i][1], this.targetX, this.targetY);
            if(pointDist < minDist) {
                minDist = pointDist;
            }
            i++;
        }
        if(outOfBounds) {
            this.fitness = 1 / minDist * 0.3;
        } else if(targetReached) {
            this.fitness = 1;
        } else if(touchedObst) {
            this.fitness = 1 / minDist * 0.5;
        } else {
            this.fitness = 1 / minDist;
        }
    }

    crossover(other) {
        var code_1 = [];
        var code_2 = [];
        var splitIndex = Math.floor(Math.random() * this.cromosomes.length);
        for(let i = 0; i < this.cromosomes.length; i++) {
            if(i < splitIndex) {
                code_1.push(this.cromosomes[i]);
                code_2.push(other.cromosomes[i]);
            } else {
                code_1.push(other.cromosomes[i]);
                code_2.push(this.cromosomes[i]);
            }
        }

        var child_1 = new DNA(this.startX, this.startY, this.targetX, this.targetY, code_1);
        var child_2 = new DNA(this.startX, this.startY, this.targetX, this.targetY, code_2);
        return [child_1, child_2];
    }

    mutate(mRate) {
        if(Math.random() <= mRate) {
            this.cromosomes = DNA.generateCode();
        }
    }

    static generateCode() {
        let code = [];
        for(let i = 0; i < LIFE_DURATION;i++) {
            /**
             * +---+---+---+
             * | 0 | 1 | 2 |    These are
             * +---+---+---+    possible
             * | 7 | x | 3 |    moves (cannot
             * +---+---+---+    stand on
             * | 6 | 5 | 4 |    same place)
             * +---+---+---+
             */
            code.push(Math.floor(Math.random() * 8));
        }
        return code;
    }
}