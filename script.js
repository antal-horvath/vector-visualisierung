// imports
const { range, filter, map, takeUntil, timer, flatMap, tap, delay, pipe, Subject, from, of, EMPTY } = rxjs;
const el = document.getElementById('ggb')

// hyperparams
const minI= -4;
const minJ= -4;
const maxI= 4;
const maxJ= 4;
const minPlaneDraw = -3;
const maxPlaneDraw = 3;
const minXYZ = -2;
const maxXYZ = 2;
const drawRefreshRate = 200;

// params
let alpha = 0;
let beta = 0;
let updateState = 0;
let score = 0;
let showPlane = false;
const planePointList = [];

// rxjs objects
const signal = new Subject();

const subscriptions = [];


function recursiveDrawAndWait(i, j) {

    if (i > maxPlaneDraw) {
        i = minPlaneDraw;
        j += 1;
    }
    if (j > maxPlaneDraw) {
        return EMPTY;
    }
    drawPoint(i,j);
    return timer(drawRefreshRate).pipe(
        takeUntil(signal),
        flatMap(() => recursiveDrawAndWait(i + 1, j))
    );
}

function createDrawStream1() {

    const refinement = 1;

    return of({i:minPlaneDraw,j:minPlaneDraw}).pipe(
        flatMap(obj => recursiveDrawAndWait(obj.i, obj.j)),
    )
}

// functions

function getResolution() {
    const width = window.screen.availWidth;
    const height = window.screen.availHeight;
    return { width, height };
}

function drawPoint(i, j) {
    const counter = planePointList.length;
    ggbApplet.evalCommand(`P${counter}=O + ${i}*a + ${j}*b`);
    ggbApplet.setAuxiliary(`P${counter}`, true);
    ggbApplet.setVisible(`P${counter}`, true);
    ggbApplet.setLabelVisible(`P${counter}`, false);
    ggbApplet.setPointSize(`P${counter}`, 6);
    planePointList.push(`P${counter}`);
}

function drawPlane() {
    subscriptions.push(createDrawStream1().subscribe());
}

function deletePlane() {
    subscriptions.forEach(sub => sub.unsubscribe());
    subscriptions.length = 0;
    planePointList.forEach(point => {
        ggbApplet.deleteObject(point);
    });
    planePointList.length = 0;
}

function togglePlaneVisibility() {
    showPlane = !showPlane;
    ggbApplet.setVisible('p', showPlane);
    console.log('Plane visibility toggled');
}

function parseGgbVectorString(s) {
    s = s.split('(')[1].split(')')[0];
    const [x, y, z] = s.split(',').map(parseFloat);
    return {x, y, z};
}

function calcRandomVector() {
    let x = Math.floor((maxXYZ - minXYZ) * Math.random() + minXYZ);
    let y = Math.floor((maxXYZ - minXYZ) * Math.random() + minXYZ);
    let z = Math.floor((maxXYZ - minXYZ) * Math.random() + minXYZ);
    while (x === 0 && y === 0 && z === 0) {
        x = Math.floor((maxXYZ - minXYZ) * Math.random() + minXYZ);
        y = Math.floor((maxXYZ - minXYZ) * Math.random() + minXYZ);
        z = Math.floor((maxXYZ - minXYZ) * Math.random() + minXYZ);
    }
    return {x, y, z};

}

function setRandomAandB() {
    let a = calcRandomVector();
    let b = calcRandomVector();

    let kx = a.x / b.x;
    let ky = a.y / b.y;
    let kz = a.z / b.z;

    let nanCounter = 0;
    if (isNaN(kx)) {
        nanCounter += 1;
        kx = ky;
    }
    if (isNaN(ky)) {
        nanCounter += 1;
        ky = kz;
    }
    if (isNaN(kz)) {
        nanCounter += 1;
        kz = kx;
    }

    if (kx === ky && ky === kz || nanCounter > 1) {
        b = calcRandomVector();
    }

    ggbApplet.evalCommand(`A=(${a.x},${a.y},${a.z})`);
    ggbApplet.evalCommand(`B=(${b.x},${b.y},${b.z})`);
}

function setRandomPoint() {
    // const a = parseGgbVectorString(ggbApplet.getValueString('a'));
    // const b = parseGgbVectorString(ggbApplet.getValueString('b'));
    let r = Math.floor((maxI - minI) * Math.random() + minI);
    let s = Math.floor((maxJ - minJ) * Math.random() + minJ);
    while ((r === 0 && s === 0) || (r === alpha && s === beta)) {
        r = Math.floor((maxI - minI) * Math.random() + minI);
        s = Math.floor((maxJ - minJ) * Math.random() + minJ);
    }
    // ggbApplet.evalCommand(`P=(${x},${y},${z})`);
    ggbApplet.evalCommand(`P=O + ${r}*a + ${s}*b`);
}


function ggbOnInit(name, api){
    // console.log(api.getAllObjectNames());
    api.evalCommand('A=(2,0,1)');
    api.evalCommand('B=(0,2,1)');
    api.evalCommand('O=(0,0,0)');
    api.evalCommand('a=Vector(A)');
    api.setColor('a', 255, 0, 0);
    api.evalCommand('b=Vector(B)');
    api.setColor('b', 0, 0, 255);
    api.evalCommand('Current=(0,0,0)');
    api.evalCommand('Last=(0,0,0)');
    api.evalCommand('p=Plane(O,A,B)');
    api.evalCommand('t=Vector(Last,Current)');

    api.setLineStyle('t', 2);

    api.setVisible('p', showPlane);
    api.setVisible('A', false);
    api.setVisible('B', false);
    api.setVisible('O', false);

    api.setAuxiliary('A', true);
    api.setAuxiliary('B', true);
    api.setAuxiliary('O', true);
    api.setAuxiliary('Last', true);
    api.setAuxiliary('p', true);
    api.setAuxiliary('t', true);
    api.setAuxiliary('score', true);

    api.setLabelVisible('a', true);
    api.setLabelVisible('b', true);
    api.setLabelVisible('Current', false)
    api.setLabelVisible('Last', false)


    ggbApplet.evalCommand(`P=(0,0,0)`);
    ggbApplet.setPointSize(`P`, 9);

    setScoreText(api);
    setRandomPoint();
    api.setColor('P', 0, 175, 0);
    api.showAlgebraInput(false);
}

function checkFinished() {
    const current = parseGgbVectorString(ggbApplet.getValueString('Current'));
    const P = parseGgbVectorString(ggbApplet.getValueString('P'));
    return current.x === P.x && current.y === P.y && current.z === P.z;
}

function setScoreText(api) {
    api.setTextValue('score', 'Score: ' + score);
}


function gameFinished() {
    console.log('Game finished');
    score += 1;
    setScoreText(ggbApplet);
    onRoundFinished();
}


function onRoundFinished() {
    setCurrentPointToOrigin();
    setRandomPoint();
    updateVectors();
}

function reset() {
    onRoundFinished();
    // score = 0;
    // setScoreText(ggbApplet);
    deletePlane();
}

function setCurrentPointToOrigin() {
    alpha = 0;
    beta = 0;
    updateState = 0;
    ggbApplet.evalCommand('Current=(0,0,0)');
    ggbApplet.evalCommand('Last=(0,0,0)');
}

function updateVectors() {
    const current = parseGgbVectorString(ggbApplet.getValueString('Current'));
    ggbApplet.evalCommand(`Last=(${current.x},${current.y},${current.z})`);
    ggbApplet.evalCommand(`Current=O + ${alpha}*a + ${beta}*b`);
    ggbApplet.evalCommand('t=Vector(Last,Current)');

    if (updateState === "alpha") {
        ggbApplet.setColor('t', 255, 0, 0);
    } else if (updateState === "beta") {
        ggbApplet.setColor('t', 0, 0, 255);
    }

    updateState = 0;

    if (checkFinished()) {
        gameFinished();
    }
}

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'a':
            alpha -= 1;
            updateState = "alpha";
            updateVectors();
            break;
        case 'w':
            beta += 1;
            updateState = "beta";
            updateVectors();
            break;
        case 's':
            beta -= 1;
            updateState = "beta";
            updateVectors();
            break;
        case 'd':
            alpha += 1;
            updateState = "alpha";
            updateVectors();
            break;
        case '1':
            togglePlaneVisibility();
            break;
        case 'r':
            setCurrentPointToOrigin();
            break;
        case 'n':
            setRandomAandB();
            reset();
            break;
        case 'ArrowUp':
            beta += 1;
            updateState = "beta";
            updateVectors();
            break;
        case 'ArrowDown':
            beta -= 1;
            updateState = "beta";
            updateVectors();
            break;
        case 'ArrowRight':
            alpha += 1;
            updateState = "alpha";
            updateVectors();
            break;
        case 'ArrowLeft':
            alpha -= 1;
            updateState = "alpha";
            updateVectors();
            break;
        case '2':
            if (subscriptions.length > 0) {
                signal.next();
                deletePlane();
            } else {
                drawPlane();
            }
            break;
        case 'Enter':
            console.log("check");
            ggbApplet.setGridVisible(true);
            break;
    }

});

function createParams() {
    const resolution = getResolution();
    const relativeMargin = 0.09;
    return {
        appName: 'classic',
        showAlgebraInput: true,
        width: resolution.width,
        height: resolution.height * (1 - relativeMargin),
        material_id: 'kyvcqnyg'
    }
}
const ggb = new GGBApplet(createParams(), true);
ggb.inject(el);





