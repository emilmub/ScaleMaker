let tones = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const numberOfTones = 12;

let scalesPromise = fetch("scales.json").then(r => r.json()) // Makes promise for reading scale data in json

async function getRandomScale() {
    let scales = await scalesPromise;

    let numberOfScales = scales["Scales"].length;
    let scaleIndex = Math.floor(Math.random() * numberOfScales);

    let randomScale = scales["Scales"][scaleIndex]; // Chooses a scale

    let toneIndex = Math.floor(Math.random() * numberOfTones); // Chooses a tone for the scale
    let h2 = document.querySelector('h2');
    h2.innerText = `${tones[toneIndex]}, ${randomScale["name"]}`
    console.log(`Chosen scale: ${tones[toneIndex]}, ${randomScale["name"]}`);
    let scaleTones = [tones[toneIndex]];
    let scaleChords = [];
    for (let index = 0; index < randomScale["tones"].length; ++index) {
        scaleChords.push(randomScale["triads"][index]);
        toneIndex += randomScale["tones"][index];
        toneIndex %= numberOfTones;
        scaleTones.push(tones[toneIndex]);
    }

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

const randomize_btn = document.querySelector("#randomize");

randomize_btn.onclick = getRandomScale;