"""Prompts für die Übungsvideos (Higgsfield): erst ein Startbild, dann ein 360-Grad-Video daraus.
Aufruf: python3 video_prompts.py bild|video [von] [bis]  -> JSON-Liste der Anfragen."""
import json, sys

STIL = ("3D anatomical fitness illustration render, clean textbook style. A smooth grey sculpted athletic male figure, "
        "like a grey anatomy model with clearly defined muscle shapes and fine muscle fiber lines, short dark hair, "
        "light grey athletic shorts, barefoot. ")
ENDE_BILD = (" Pure white seamless studio background, soft even light, faint soft shadow on the floor. Camera three-quarter "
             "view from slightly above, whole figure and equipment in frame with generous white margin. "
             "No text, no labels, no logos, no watermark.")
ENDE_VIDEO = (" The camera orbits a full 360 degrees around the figure at constant speed. The camera keeps exactly the same "
              "distance and height as in the image the whole time: never zoom in, never move closer, the whole figure and "
              "equipment always fully visible with white margin. The video ends exactly on the start image. "
              "Pure white background, soft light. No cuts, no text, no watermark.")

# name, datei, pose (Startbild), rot, hellrot, geräte, bewegung
U = [
("Kniebeugen","kniebeugen","He stands upright with a barbell resting on his upper back behind the neck, hands gripping the bar outside the shoulders, feet shoulder-width apart, toes slightly out.",
 "the quadriceps (front thighs) and glutes","hamstrings and lower back","Olympic barbell with black plates.",
 "He performs three slow controlled barbell back squats: hips back and down, knees over the toes, deep until the thighs are below parallel, chest up, back straight, heels stay on the floor, then he stands up fully."),
("Schrägbankdrücken","schraegbankdruecken","He lies on an incline bench set at about 40 degrees, top position: arms straight up, wide grip on the barbell above the upper chest, both feet flat on the floor.",
 "the upper chest","front shoulders and triceps","Adjustable incline bench with light grey metal frame and black pad, barbell with black plates.",
 "He performs three slow incline bench presses: the bar is lowered slowly to the upper chest below the collarbone, never near the face, then pressed straight up. Back and hips stay on the bench, feet stay on the floor."),
("Kurzhantel-Flys","kurzhantel-flys","He lies on a flat bench holding two dumbbells above the chest with arms extended, palms facing each other, elbows slightly bent, both feet flat on the floor.",
 "the chest","front shoulders","Flat bench with light grey metal frame and black pad, two black dumbbells.",
 "He performs three slow dumbbell flyes: the arms open wide in a big arc to the sides with a fixed slight elbow bend until the dumbbells are level with the chest, then come back together above the chest. The arms never bend into a press."),
("Liegestütze","liegestuetze","Push-up top position on the floor: hands slightly wider than the shoulders, arms straight, body in one straight line from head to heels, on the toes.",
 "the chest and triceps","front shoulders and abs","No equipment, plain floor.",
 "He performs three slow push-ups: the chest is lowered until almost touching the floor, elbows angled back about 45 degrees, the body stays perfectly straight, hips never sag, then he pushes back up."),
("Dips","dips","He is supported on parallel dip bars with straight arms, body upright with a slight forward lean, knees bent, feet crossed behind him and off the floor.",
 "the chest and triceps","front shoulders","Parallel dip bar station in light grey metal.",
 "He performs three slow dips: the elbows bend backwards and the body lowers until the upper arms are parallel to the floor, then he pushes back up to straight arms. The feet never touch the floor."),
("Schulterdrücken","schulterdruecken","He sits upright on a bench with a backrest, holding a barbell at upper chest height in front of the shoulders, elbows under the hands, feet flat on the floor.",
 "the shoulders (deltoids)","triceps and upper trapezius","Upright bench with backrest, light grey metal and black pad, barbell with black plates.",
 "He performs three slow overhead presses: the bar is pressed straight up until the arms are almost straight, then lowered back to chin height. His back stays against the backrest."),
("Seitheben","seitheben","He stands upright holding a dumbbell in each hand at his sides, elbows slightly bent.",
 "the side deltoids (outer shoulders)","upper trapezius","Two black dumbbells.",
 "He performs three slow lateral raises: both arms rise out to the sides with slightly bent elbows up to shoulder height, never forward, then lower slowly."),
("Frontheben","frontheben","He stands upright holding a dumbbell in each hand in front of his thighs, palms facing the body.",
 "the front deltoids (front shoulders)","upper chest","Two black dumbbells.",
 "He performs three slow front raises: both arms rise straight forward with slightly bent elbows to shoulder height, then lower slowly. The torso does not lean back."),
("Face Pulls","face-pulls","He stands one step in front of a cable tower, holding a rope attachment at face height with both hands, arms extended forward toward the machine.",
 "the rear shoulders and upper back","biceps","Cable tower in light grey metal with a black weight stack, rope handle on a cable.",
 "He performs three slow face pulls: the rope is pulled toward the face, elbows high and wide, hands end beside the ears, shoulder blades squeezed, then the arms extend again. The body stays upright."),
("Klimmzüge","klimmzuege","He hangs from a pull-up bar with an overhand grip slightly wider than the shoulders, arms almost straight, legs slightly bent, feet off the floor.",
 "the latissimus (wide back muscles)","biceps and upper back","Pull-up bar on a light grey metal frame.",
 "He performs three slow pull-ups: the body is pulled up until the chin is above the bar, without swinging, then slowly lowered to almost straight arms."),
("Latzug","latzug","He sits at a lat pulldown machine, thighs under the pads, holding a wide bar overhead with straight arms.",
 "the latissimus (wide back muscles)","biceps","Lat pulldown machine in light grey metal with black seat and pads, wide bar on a cable.",
 "He performs three slow lat pulldowns: the bar is pulled down to the upper chest, elbows down and back, torso leaning back slightly, then the bar rises slowly until the arms are straight."),
("Rudern mit Langhantel","rudern-langhantel","He stands bent over with a straight back at about 45 degrees, knees slightly bent, holding a barbell with straight arms below the shoulders, shoulder-width grip; the bar hangs in front of the knees, completely in front of both legs.",
 "the latissimus and upper back","biceps and lower back","Barbell with black plates.",
 "He performs three slow barbell rows: the bar is pulled to the lower belly, elbows close to the body, shoulder blades squeezed, then lowered to straight arms. The back angle stays the same."),
("Rudern mit Kurzhantel","rudern-kurzhantel","His left knee and left hand rest on a flat bench, back flat and parallel to the floor, the right foot stands on the floor beside the bench, the right hand holds a dumbbell hanging straight down beside the bench, clearly outside the bench, not under it.",
 "the latissimus (wide back muscles)","biceps and rear shoulder","Flat bench with light grey metal frame and black pad, one black dumbbell.",
 "He performs three slow one-arm rows: the dumbbell is pulled toward the hip, elbow close to the body, the torso does not rotate, then it is lowered to a straight arm."),
("Kreuzheben","kreuzheben","Deadlift start position: the barbell lies on the floor over the mid-foot, close to the shins, hips back, knees bent, straight back, chest up, hands gripping the bar just outside the knees.",
 "the lower back, glutes and hamstrings","quadriceps and trapezius","Barbell with black plates resting on the floor.",
 "He performs three slow deadlifts: pushing through the legs he lifts the bar close along the shins and thighs until standing fully upright, then lowers it back to the floor with a straight back. The bar always stays in front of the legs and never passes through the legs or feet; the plates rest on the floor at the bottom."),
("Rückenstrecken","rueckenstrecken","He is on a 45-degree back extension bench, hips on the pad, feet secured under the foot pads, body in one straight line from heels to head, arms crossed over the chest.",
 "the lower back (erector spinae)","glutes and hamstrings","45-degree back extension bench with light grey metal frame and black pads.",
 "He performs three slow back extensions: the upper body bends forward and down with a straight back, then rises until body and legs form one straight line, without overextending."),
("Beinpresse","beinpresse","He sits in a 45-degree leg press machine, back against the backrest, feet hip-width on the footplate, legs extended with soft knees, hands on the handles.",
 "the quadriceps (front thighs)","glutes","45-degree leg press machine with light grey frame, black seat and footplate.",
 "He performs three slow leg presses: the knees bend toward the chest until about 90 degrees, the hips stay on the seat, then the platform is pushed back up without locking the knees."),
("Ausfallschritte","ausfallschritte","He stands upright holding a dumbbell in each hand at his sides.",
 "the quadriceps and glutes","hamstrings","Two black dumbbells.",
 "He performs three slow forward lunges, alternating legs: one big step forward, both knees bend until the back knee is just above the floor, front knee above the ankle, torso upright, then he pushes back to standing."),
("Beinbeuger","beinbeuger","He lies face down on a lying leg curl machine, the roller pad on the back of the lower legs just above the heels, legs straight, hands holding the handles.",
 "the hamstrings (back of the thighs)","calves","Lying leg curl machine with light grey frame and black pads.",
 "He performs three slow leg curls: the heels curl toward the glutes, the hips stay pressed on the pad, then the legs lower slowly until straight."),
("Beinstrecker","beinstrecker","He sits on a leg extension machine, back against the backrest, the roller pad in front of the lower shins, knees bent 90 degrees, hands on the handles.",
 "the quadriceps (front thighs)","","Leg extension machine with light grey frame and black seat and pads.",
 "He performs three slow leg extensions: the legs extend until almost straight, hold briefly, then lower slowly back to 90 degrees."),
("Wadenheben","wadenheben","He stands with the balls of the feet on the edge of a low step platform, heels hanging off, body upright, one hand lightly on a support pole.",
 "the calves","","Low black step platform and a light grey support pole.",
 "He performs three slow calf raises: the heels lower below the step for a stretch, then rise as high as possible onto the toes, hold briefly, then lower."),
("Hip Thrust","hip-thrust","Hip thrust start: he sits on the floor in front of a flat bench, only his shoulder blades lean back against the long side edge of the bench, the bench runs crosswise behind his upper back, buttocks just above the floor, knees bent, feet flat on the floor, a padded barbell rests across his hip crease held with both hands.",
 "the glutes","hamstrings","Flat bench with light grey metal frame and black pad, barbell with black plates and a hip pad.",
 "He performs three slow hip thrusts: the hips drive up until thighs and torso form a straight line with vertical shins, glutes squeezed, then lower slowly."),
("Bizepscurls","bizepscurls","He stands upright holding a dumbbell in each hand, arms straight down, palms facing forward.",
 "the biceps","forearms","Two black dumbbells.",
 "He performs three slow biceps curls: the elbows stay close to the body, the dumbbells curl up to the shoulders, then lower slowly to straight arms. No swinging."),
("Hammercurls","hammercurls","He stands upright holding a dumbbell in each hand, arms straight down, palms facing the body (neutral hammer grip).",
 "the biceps and forearms","","Two black dumbbells.",
 "He performs three slow hammer curls with the palms facing each other: the elbows stay close to the body, the dumbbells curl up to the shoulders, then lower slowly."),
("Trizepsdrücken am Kabel","trizepsdruecken-kabel","He stands in front of a cable tower with a slight forward lean, elbows tucked at his sides, holding a short straight bar at chest height attached to the high cable.",
 "the triceps","","Cable tower in light grey metal with a black weight stack, short bar on a cable from the top pulley.",
 "He performs three slow triceps pushdowns: the forearms push down until the arms are straight, the elbows stay pinned to the sides, then the forearms return up to 90 degrees."),
("Trizeps-Kickbacks","trizeps-kickbacks","He is bent over with a flat back, one hand and the same-side knee on a flat bench, the other upper arm held tight alongside the torso, elbow bent 90 degrees, a dumbbell in that hand.",
 "the triceps","","Flat bench with light grey metal frame and black pad, one black dumbbell.",
 "He performs three slow kickbacks: the forearm extends back until the arm is straight, the upper arm stays still, then it returns to 90 degrees."),
("Unterarmcurls","unterarmcurls","He sits on a flat bench, forearms resting on the thighs, wrists just past the knees, holding a dumbbell in each hand with palms up.",
 "the forearms","","Flat bench with light grey metal frame and black pad, two black dumbbells.",
 "He performs three slow wrist curls: the wrists let the dumbbells roll down, then curl them up as high as possible. The forearms stay on the thighs."),
("Plank","plank","Forearm plank on the floor: elbows under the shoulders, forearms on the floor, on the toes, body in one straight line from head to heels.",
 "the abs","shoulders and front thighs","No equipment, plain floor.",
 "He holds the plank perfectly still with a straight body, only calm breathing; the hips never sag or rise."),
("Crunches","crunches","He lies on his back on the floor, knees bent, feet flat, fingertips lightly at the temples.",
 "the abs","","No equipment, plain floor.",
 "He performs three slow crunches: shoulders and upper back curl up off the floor, the lower back stays down, then he lowers slowly."),
("Beinheben","beinheben","He lies on his back on the floor, arms at his sides, legs straight and together, lifted slightly off the floor.",
 "the lower abs","hip flexors","No equipment, plain floor.",
 "He performs three slow leg raises: the straight legs rise until vertical, the lower back stays pressed to the floor, then the legs lower slowly until just above the floor."),
("Seitstütz","seitstuetz","Side plank on the forearm: he lies on his side, elbow under the shoulder, legs straight and stacked, hips lifted so the body forms one straight line, top hand on the hip.",
 "the side abs (obliques)","shoulder","No equipment, plain floor.",
 "He holds the side plank perfectly still with a straight body; the hips never drop, calm breathing."),
("Russian Twist","russian-twist","He sits on the floor, knees bent, heels on the floor, torso leaning back about 45 degrees with a straight back, holding a weight plate with both hands in front of the chest.",
 "the side abs (obliques) and abs","","One black weight plate.",
 "He performs slow Russian twists: the torso rotates to the left with the weight beside the left hip, then to the right side, controlled, with a straight back."),
("Kabelcrunch","kabelcrunch","He kneels in front of a cable tower facing it, holding a rope attachment from the high pulley beside his head, torso upright.",
 "the abs","side abs","Cable tower in light grey metal with a black weight stack, rope handle on a cable from the top pulley.",
 "He performs three slow cable crunches: the torso curls down bringing the elbows toward the thighs, the hips stay still, then he rises back slowly."),
]

def bild(u):
    n, d, pose, rot, hell, ger, _ = u
    farbe = f"Only {rot} colored saturated red" + (f", {hell} light red" if hell else "") + ", everything else grey."
    return STIL + pose + " " + farbe + " " + ger + ENDE_BILD

def video(u):
    n, d, pose, rot, hell, ger, mov = u
    return "Same grey anatomy figure, same style and colors as the image. " + mov + f" Only {rot} are red." + ENDE_VIDEO

if __name__ == "__main__":
    art = sys.argv[1]; a = int(sys.argv[2]) if len(sys.argv) > 2 else 0; b = int(sys.argv[3]) if len(sys.argv) > 3 else len(U)
    out = [{"index": i, "name": U[i][0], "datei": U[i][1], "prompt": (bild if art == "bild" else video)(U[i])} for i in range(a, min(b, len(U)))]
    print(json.dumps(out, ensure_ascii=False))
