let tones = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const numberOfTones = 12;

let scalesPromise = fetch("scales.json").then(r => r.json()) // Makes promise for reading scale data in json

async function getRandomScale() {
    let scales = await scalesPromise;

    let numberOfScales = scales["Scales"].length;
    let scaleIndex = Math.floor(Math.random() * numberOfScales);

    let randomScale = scales["Scales"][scaleIndex]; // Chooses a scale

    let toneIndex = Math.floor(Math.random() * numberOfTones); // Chooses a tone for the scale
    console.log(`Chosen scale: ${tones[toneIndex]}, ${randomScale["name"]}`);
    let scaleTones = [tones[toneIndex]];
    let scaleChords = [];
    for (let index = 0; index < randomScale["tones"].length; ++index) {
        scaleChords.push(randomScale["triads"][index]);
        toneIndex += randomScale["tones"][index];
        toneIndex %= numberOfTones;
        scaleTones.push(tones[toneIndex]);
    }

    let strToPrint = `Chords: `;
    for (let i = 0; i < scaleChords.length; ++i) {
        strToPrint += `${scaleTones[i]}`;
        if (scaleChords[i] == "Major") {
            strToPrint += ` `;
        }
        else if (scaleChords[i] == "Minor") {
            strToPrint += `m `;
        }
        else if (scaleChords[i] == "Diminished") {
            strToPrint += `dim `;
        }
        else if (scaleChords[i] == "Augmented") {
            strToPrint += `+ `;
        }
        else {
            console.error("Missed a type of chord.")
        }
    }

    console.log(strToPrint);
}

const randomize_btn = document.querySelector("#randomize");

randomize_btn.onclick = getRandomScale;