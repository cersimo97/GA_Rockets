const N_POP = 1500;
const M_RATE = 0.015;

const DIAMETER = 8;

var start = {x: 150, y: 250};
var target = {x: 150, y: 40};
var obstacles = [
    /*
    new Obstacle(0, 90, 170, 20),
    new Obstacle(130, 180, 170, 20)
    */
   new Obstacle(70, 140, 160, 20)
];
/*
for(let i = 0; i < 2; i++) {
    obstacles.pop();
}
obstacles.push(new Obstacle(90, 0, 20, 300));
obstacles.push(new Obstacle(190, 0, 20, 300));
for(let i = 40; i < 230; i += 75) {
    obstacles.push(new Obstacle(110, i, 40, 5));
    obstacles.push(new Obstacle(150, i + 35, 40, 5));
}
*/
var bestElement;

var i = 0;
var endOfShow;
var canDraw = false;

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    myPop = new Population(N_POP, start, target);
    myPop.calculateFitness(obstacles);
    bestElement = myPop.elements[0];
    
}

function draw() {
    background(255);

    // while not reaching target,
    // show animation every 50 generations
    if(myPop.nGen % 50 === 0) {
        canDraw = true;
    } else {
        canDraw = false;
    }

    // DRAW OBSTACLES
    stroke(0, 0, 255);
    fill(0, 0, 255, 40);
    obstacles.forEach(function(ob) {
        rect(ob.x, ob.y, ob.w, ob.h);
    });

    // DRAW ORIGIN
    noFill();
    stroke(255,0,255);
    line(start.x - 4, start.y - 4, start.x + 4, start.y + 4);
    line(start.x - 4, start.y + 4, start.x + 4, start.y - 4);

    // DRAW TARGET
    stroke(255, 0, 0);
    ellipse(target.x, target.y, DIAMETER);

    // DRAW ELEMENTS
    noFill();
    if(bestElement.deadAt === -1) {
        endOfShow = bestElement.path.length;
    } else {
        endOfShow = bestElement.deadAt;
    }
    if(i < endOfShow && canDraw) {
        // draw others
        for(let k = 1; k < myPop.elements.length; k++) {
            stroke(200);
            if(myPop.elements[k].deadAt > i) {
                ellipse(myPop.elements[k].path[i][0], myPop.elements[k].path[i][1], DIAMETER);
            }
        }
        // draw best
        stroke(0);
        ellipse(bestElement.path[i][0], bestElement.path[i][1], DIAMETER);
        i++;
    } else {
        i = 0;
        // if(bestElement.fitness < 1) {
        // if(myPop.nGen < 100) {
            var matingPool = myPop.doSelection(false);
            myPop.evolve(matingPool);
            myPop.applyMutations(M_RATE);
            myPop.calculateFitness(obstacles);
            bestElement = myPop.elements[0];
        // }
    }

    // SHOW STATS
    noStroke();
    fill(0);
    textAlign(LEFT);
    text("gen: " + myPop.nGen, 10, 10);
    text("dist: " + Math.floor(1 / bestElement.fitness), 10, 20);
    if(bestElement.fitness === 1) {
        fill(0, 255, 0);
        text("TARGET REACHED!", 10, 30);
    }
    textAlign(RIGHT);
    text("deadAt: " + bestElement.deadAt, 290, 10);
}