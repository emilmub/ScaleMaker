import json
import random

tones = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]

with open("scales.json") as file:
    scales_info = json.load(file)["Scales"]

while True:
    random_scale = scales_info[random.randrange(len(scales_info))]
    if "triads" in random_scale:
        break

number_of_tones = len(tones)
tone_index = random.randrange(number_of_tones)
print(f"Scale: {tones[tone_index]} in {random_scale["name"]}")
scale_tones = [tones[tone_index]]
scale_chords = []
for interval, chord in zip(random_scale["tones"], random_scale["triads"]):
    scale_chords.append(chord)
    tone_index += interval
    tone_index %= number_of_tones
    scale_tones.append(tones[tone_index])

chords_to_print = "Chords: "
for i in range(len(scale_chords)):
    chords_to_print += f"{scale_tones[i]}"
    if scale_chords[i] == "Major":
        chords_to_print += " "
    elif scale_chords[i] == "Minor":
        chords_to_print += "m "
    elif scale_chords[i] == "Diminished":
        chords_to_print += "dim "
    elif scale_chords[i] == "Augmented":
        chords_to_print += "+ "
    else:
        raise TypeError("Missed a type of chord.")
    
print(chords_to_print)

print("Emotion of this scale", random_scale["emotion"])

progression = random.sample(chords_to_print.split()[1:], 4)
print("Possible progression", progression)
