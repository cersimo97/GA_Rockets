/**
 * ASSIGNMENT 06 - Population.js
 * solved through meta-Heuristic (GA Algorithm)
 * written by Simone Cernuschi - matr. 816225
 * January 2019
 */

class Population {
    constructor(nPop, start, target) {
        var elements = [];
        for(let i = 0; i < nPop; i++) {
            elements.push(new DNA(start.x, start.y, target.x, target.y));
        }
        this.elements = elements;
        this.nGen = 0;
    }

    calculateFitness(obstacles) {
        this.elements.forEach(function(e) {
            e.buildPath();
            e.calcFit(obstacles);
        });
        
        this.elements.sort(function(a,b) {
            if(a.fitness > b.fitness) {
                return -1;
            } else if(a.fitness < b.fitness) {
                return 1;
            } else {
                if(a.deadAt < b.deadAt) {
                    return -1;
                } else if(a.deadAt > b.deadAt) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
    }

    doSelection(printStats) {
        

        var stats = this.fitnessStatistic();
        this.min = 1/stats[1];
        this.max = 1/stats[2];
        this.mean = 1/stats[3];

        if(printStats) {
            let str = "Max fitness: " + 1 / stats[2] + " - Mean: " + stats[3];
            console.log(str);
        }
        
        // probList contains all the prob ranges for every element
        // to be choosen in the mating pool
        var probList = [[0, true]];
        
        this.elements.forEach(function(el) {
            let m = el.fitness / stats[0];
            el.prob = m;
            if(el.fitness > 0) {
                probList.push([probList[probList.length - 1][0] + m, true]);
            } else {
                probList.push([probList[probList.length - 1][0] + m, false]);
            }
        });

        probList.shift();

        // Build Mating-Pool
        var matingPool = [];
        let i = 0;
        while(i < N_POP / 2) {
            let randomN = Math.random();
            let foundElement = false;
            let j = 0;
            while(!foundElement && j <= probList.length) {
                if(randomN < probList[j][0] && probList[j][1]) {
                    foundElement = true;
                    matingPool.push(this.elements[j]);
                } else {
                    j++;
                }
            }
            i++;
        }

        return matingPool;
    }

    evolve(matingPool) {
        /**
         * best element of previous generation added
         * (elitism of 1 element per population)
         */
        let newElements = [this.elements[0]];

        while(newElements.length <= N_POP - 1) {
            let nRand1 = Math.floor(Math.random() * matingPool.length);
            let nRand2 = Math.floor(Math.random() * matingPool.length);

            let childs = matingPool[nRand1].crossover(matingPool[nRand2]);
            newElements.push(childs[0]);
            newElements.push(childs[1]);
        }

        this.elements = newElements;
        this.nGen++;
    }

    applyMutations(mRate) {
        this.elements.forEach(function(el) {
            el.mutate(mRate);
        });
    }

    /**
     * Return [sum, min, max, mean] fitness
     */
    fitnessStatistic() {
        var min = Infinity;
        var max = 0;
        var sum = 0;
        var mean;

        this.elements.forEach(function(el) {
            sum += el.fitness;
            if(el.fitness < min) {
                min = el.fitness;
            }
            if(el.fitness > max) {
                max = el.fitness;
            }
        });

        mean = sum / this.elements.length;

        return [sum, min, max, mean];
    }

    printElements() {
        this.elements.forEach(function(el) {
            console.log(el.code);
        });
    }
}