const { range, filter, map } = rxjs;

const el = document.getElementById('ggb')

// hyperparams
const minA= -5;
const minB= -5;
const maxA= 5;
const maxB= 5;

// params
let alpha = 0;
let beta = 0;
let updateState = 0;
let score = 0;
let showPlane = false;
const planePointList = [];


// functions
const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

function getResolution() {
    const width = window.screen.availWidth;
    const height = window.screen.availHeight;
    return { width, height };
}

async function drawPlane() {
    let counter = 0;
    const refinement = 3;
    for (let i = -maxA * refinement; i <= maxA * refinement; i++) {
        for (let j = -maxB * refinement; j <= maxB * refinement; j++) {
            ggbApplet.evalCommand(`P${counter}=O + ${i / refinement}*a + ${j / refinement}*b`);
            ggbApplet.setAuxiliary(`P${counter}`, true);
            ggbApplet.setVisible(`P${counter}`, true);
            ggbApplet.setLabelVisible(`P${counter}`, false);
            ggbApplet.setPointSize(`P${counter}`, 1);
            await sleepNow(30 / refinement / refinement);

            planePointList.push(`P${counter}`);
            counter += 1;
        }
    }
}

function deletePlane() {
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

function calcRandomPoint() {
    // const a = parseGgbVectorString(ggbApplet.getValueString('a'));
    // const b = parseGgbVectorString(ggbApplet.getValueString('b'));
    let r = Math.floor((maxA - minA) * Math.random() + minA);
    let s = Math.floor((maxB - minB) * Math.random() + minB);
    while ((r === 0 && s === 0) || (r === alpha && s === beta)) {
        r = Math.floor((maxA - minA) * Math.random() + minA);
        s = Math.floor((maxB - minB) * Math.random() + minB);
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

    setScoreText(api);
    calcRandomPoint();
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
    ggbApplet.evalCommand('Current=(0,0,0)');
    ggbApplet.evalCommand('Last=(0,0,0)');
    calcRandomPoint();
    alpha = 0;
    beta = 0;
    updateState = 0;
    updateVectors();
}

function reset () {
    onRoundFinished();
    score = 0;
    setScoreText(ggbApplet);
    deletePlane();
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
        case 'e':
            togglePlaneVisibility();
            break;
        case 'r':
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
        case 'Enter':
            drawPlane();
            break;
    }

});

function createParams() {
    const resolution = getResolution();
    const relativeMargin = 0.09;
    return {
        appName: 'classic',
        showAlgebraInput: false,
        width: resolution.width,
        height: resolution.height * (1 - relativeMargin),
        material_id: 'kyvcqnyg'
    }
}
const ggb = new GGBApplet(createParams(), true);
ggb.inject(el);





