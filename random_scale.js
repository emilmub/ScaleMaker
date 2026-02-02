let tones = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const numberOfTones = 12;

let scalesPromise = fetch("scales.json").then(r => r.json()) // Makes promise for reading scale data in json

let scaleNames = [];
let numberOfScales = 0;

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
}

async function buttonSelection() {
    let [scaleIndex, toneIndex] = selectScale();
    let scaleObject = await buildScale(scaleIndex, toneIndex);
    showScale(scaleObject.scaleTones, scaleObject.scaleChords);
}

populateScales();

const select_btn = document.querySelector("#select-button");
select_btn.onclick = buttonSelection;

const randomize_btn = document.querySelector("#randomize");
randomize_btn.onclick = buttonRandomize;