let tones = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let toneFreqOct4 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.3, 440, 466.16, 493.88]
let toneFreqOct5 = [523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880, 932.33, 987.77]

const numberOfTones = 12;

let scalesPromise = fetch("scales.json").then(r => r.json()) // Makes promise for reading scale data in json

let scaleNames = [];
let numberOfScales = 0;

let scaleTones = ["C", "D", "E", "F", "G", "A", "B", "C"]

async function populateScales() {
    let scales = await scalesPromise;

    numberOfScales = scales["Scales"].length;

    let name = "";
    let scaleSelect = document.querySelector("#scale-select");
    for (let scale of scales["Scales"]) {
        name = scale["name"];
        scaleNames.push(name);
        let opt = document.createElement("option");
        opt.value = name;
        opt.innerText = name;
        scaleSelect.appendChild(opt);
    }
}

function selectScale() {

    let scaleSelect = document.querySelector("#scale-select");
    let toneSelect = document.querySelector("#tone-select");

    let scaleIndex = scaleNames.indexOf(scaleSelect.value);
    let toneIndex = tones.indexOf(toneSelect.value);

    return [scaleIndex, toneIndex];
}

function getRandomScale() {

    let scaleIndex = Math.floor(Math.random() * numberOfScales);
    let toneIndex = Math.floor(Math.random() * numberOfTones); // Chooses a tone for the scale

    return [scaleIndex, toneIndex];
}

async function buildScale(scaleIndex, toneIndex) {
    let scales = await scalesPromise;

    let scale = scales["Scales"][scaleIndex];

    let h2 = document.querySelector('h2');
    h2.innerText = `${tones[toneIndex]} ${scale["name"]}`

    let scaleSelect = document.querySelector('#scale-select');
    scaleSelect.value = scale["name"];

    let toneSelect = document.querySelector('#tone-select');
    toneSelect.value = tones[toneIndex];

    let scaleChords = [];
    let scaleTones = [tones[toneIndex]];
    for (let index = 0; index < scale["tones"].length; ++index) {
        scaleChords.push(scale["triads"][index]);
        toneIndex += scale["tones"][index];
        toneIndex %= numberOfTones;
        scaleTones.push(tones[toneIndex])
    }

    return { scaleTones, scaleChords };
}

function showScale(scaleTones, scaleChords) {
    let toneDivs = document.querySelectorAll(".tone");
    let chordQualityDivs = document.querySelectorAll(".chord-quality");
    let accidentalsQualityDivs = document.querySelectorAll(".accidentals");
    for (let divIndex = 0; divIndex < chordQualityDivs.length - 1; ++divIndex) {
        if (scaleTones[divIndex].endsWith("#")) {
            toneDivs[divIndex].innerText = scaleTones[divIndex][0];
            accidentalsQualityDivs[divIndex].innerText = scaleTones[divIndex][1];
        }
        else {
            toneDivs[divIndex].innerText = scaleTones[divIndex];
            accidentalsQualityDivs[divIndex].innerText = "";
        }

        if (scaleChords[divIndex] == "Major") {
            chordQualityDivs[divIndex].innerText = "";
        }
        else if (scaleChords[divIndex] == "Minor") {
            chordQualityDivs[divIndex].innerText = `m`;
        }
        else if (scaleChords[divIndex] == "Diminished") {
            chordQualityDivs[divIndex].innerText = `dim`;
        }
        else if (scaleChords[divIndex] == "Augmented") {
            chordQualityDivs[divIndex].innerText = `+`;
        }
        else {
            console.error("Missed a type of chord.")
        }
    }
    toneDivs[toneDivs.length - 1].innerText = toneDivs[0].innerText;
    chordQualityDivs[chordQualityDivs.length - 1].innerText = chordQualityDivs[0].innerText;
    accidentalsQualityDivs[accidentalsQualityDivs.length - 1].innerText = accidentalsQualityDivs[0].innerText;
}

async function buttonRandomize() {
    let [scaleIndex, toneIndex] = getRandomScale();
    let scaleObject = await buildScale(scaleIndex, toneIndex);
    showScale(scaleObject.scaleTones, scaleObject.scaleChords);
    scaleTones = scaleObject.scaleTones;
}

async function buttonSelection() {
    let [scaleIndex, toneIndex] = selectScale();
    let scaleObject = await buildScale(scaleIndex, toneIndex);
    showScale(scaleObject.scaleTones, scaleObject.scaleChords);
    scaleTones = scaleObject.scaleTones;
}

function buttonPlayScale() {
    const noteDuration = 0.5;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.value = 0.1;

    let frequencies = toneFreqOct4;

    let toneIndex = 0;

    let freqToPlay = [];

    for (let tone of scaleTones) {
        if (toneIndex > tones.indexOf(tone)) {
            frequencies = toneFreqOct5;
        }
        toneIndex = tones.indexOf(tone);
        freqToPlay.push(frequencies[toneIndex]);
    }

    const startTime = audioContext.currentTime;

    freqToPlay.forEach((freq, index) => {
        oscillator.frequency.setValueAtTime(freq, startTime + index * noteDuration
        );
    });

    oscillator.start(startTime);
    oscillator.stop(startTime + freqToPlay.length * noteDuration);
}

function playChord() {
    const oscillators = [audioContext.createOscillator(), audioContext.createOscillator(), audioContext.createOscillator()];
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1;

    let tone = this.querySelector(".tone").innerText;
    let toneIndex = tones.indexOf(tone);

    gainNode.connect(audioContext.destination);

    for (oscillator of oscillators) {
        oscillator.connect(gainNode);
        if (toneIndex < 12) {
            oscillator.frequency.value = toneFreqOct4[toneIndex];
        }
        else {
            oscillator.frequency.value = toneFreqOct5[toneIndex % 12];
        }

        toneIndex += 2;

        oscillator.start();

    }
    activeOscillators.set(this, oscillators);
}

function stopChord() {
    const oscillators = activeOscillators.get(this);

    if (typeof oscillators !== 'undefined') {
        for (oscillator of oscillators) {
            oscillator.stop();
        }

        activeOscillators.delete(this);
    }

}

populateScales();
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let activeOscillators = new Map();

const select_btn = document.querySelector("#select-button");
select_btn.onclick = buttonSelection;

const randomize_btn = document.querySelector("#randomize");
randomize_btn.onclick = buttonRandomize;

const play_btn = document.querySelector("#play-scale");
play_btn.addEventListener("click", buttonPlayScale);

const chordDivs = document.querySelectorAll(".chord");
chordDivs.forEach(chord => {
    chord.addEventListener("pointerdown", playChord);
    chord.addEventListener("pointerup", stopChord);
    chord.addEventListener("pointerleave", stopChord);
});