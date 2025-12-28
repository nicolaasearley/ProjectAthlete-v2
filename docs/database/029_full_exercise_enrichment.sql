-- ============================================
-- ProjectAthlete v2 - Migration 029
-- Global Exercise Library Enrichment (Full Scope)
-- Professional Technique Cues & Muscle Tagging
-- ============================================

-- CARDIO
UPDATE public.exercises SET 
  description = 'Technical cues: Keep your chest high and maintain a rhythmic breathing pattern. Use both arms and legs for maximum power output.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Quads, Shoulders, Core}'
WHERE name = 'Assault Bike';

UPDATE public.exercises SET 
  description = 'Technical cues: Maintain a partial squat position. Focus on creating consistent waves with your arms while keeping your core braced.',
  primary_muscle_group = 'Shoulders',
  secondary_muscle_groups = '{Arms, Core, Quads}'
WHERE name = 'Battle Ropes';

UPDATE public.exercises SET 
  description = 'Technical cues: Land softly with your knees slightly bent. Stand up fully at the top to complete the rep.',
  primary_muscle_group = 'Quads',
  secondary_muscle_groups = '{Glutes, Calves, Core}'
WHERE name = 'Box Jump';

UPDATE public.exercises SET 
  description = 'Technical cues: Drop your chest to the floor and jump to full extension at the top with a clap above your head.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Chest, Quads, Core}'
WHERE name = 'Burpee';

UPDATE public.exercises SET 
  description = 'Technical cues: Maintain a light grip on the handles. Focus on a smooth, circular pedal stroke.',
  primary_muscle_group = 'Quads',
  secondary_muscle_groups = '{Glutes, Hamstrings, Calves}'
WHERE name = 'Cycling';

UPDATE public.exercises SET 
  description = 'Technical cues: Two rotations of the rope per one jump. Keep your elbows tucked and wrists relaxed.',
  primary_muscle_group = 'Calves',
  secondary_muscle_groups = '{Shoulders, Core, Forearms}'
WHERE name = 'Double Unders';

UPDATE public.exercises SET 
  description = 'Technical cues: Stay on the balls of your feet. Keep a consistent rhythm and minimize excessive jumping height.',
  primary_muscle_group = 'Calves',
  secondary_muscle_groups = '{Core, Shoulders}'
WHERE name = 'Jump Rope';

UPDATE public.exercises SET 
  description = 'Technical cues: Maintain a strong plank position. Drive your knees toward your chest alternating rapidly while keeping your hips low.',
  primary_muscle_group = 'Core',
  secondary_muscle_groups = '{Shoulders, Hip Flexors}'
WHERE name = 'Mountain Climber';

UPDATE public.exercises SET 
  description = 'Technical cues: Drive through the legs first, then lean back, then pull with the arms. Return in the opposite order.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Quads, Back, Biceps, Core}'
WHERE name = 'Rowing';

UPDATE public.exercises SET 
  description = 'Technical cues: Maintain an upright posture and mid-foot strike. Keep your breathing steady and shoulders relaxed.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Quads, Glutes, Calves, Hamstrings}'
WHERE name = 'Running';

UPDATE public.exercises SET 
  description = 'Technical cues: Reach high and drive the handles down using your core and lats. Finish with a slight knee bend.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Lats, Triceps, Core, Glutes}'
WHERE name = 'Ski Erg';

UPDATE public.exercises SET 
  description = 'Technical cues: Lean back and stay low. Take short, powerful steps and keep tension on the rope/straps.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Legs, Back, Grip}'
WHERE name = 'Sled Pull';

UPDATE public.exercises SET 
  description = 'Technical cues: Keep your arms locked and torso at a 45-degree angle. Drive through the balls of your feet.',
  primary_muscle_group = 'Quads',
  secondary_muscle_groups = '{Glutes, Calves, Core}'
WHERE name = 'Sled Push';

UPDATE public.exercises SET 
  description = 'Technical cues: Maintain an upright posture. Do not lean on the rails; focus on complete steps.',
  primary_muscle_group = 'Quads',
  secondary_muscle_groups = '{Glutes, Calves}'
WHERE name = 'Stair Climber';

UPDATE public.exercises SET 
  description = 'Technical cues: Focus on smooth strokes and consistent breathing. Engage your core to maintain a horizontal body position.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Lats, Shoulders, Core}'
WHERE name = 'Swimming';

-- CARRY
UPDATE public.exercises SET 
  description = 'Technical cues: Keep the kettlebell upside down with the handle in your palm. Keep your elbow at a 90-degree angle and your wrist straight.',
  primary_muscle_group = 'Forearms',
  secondary_muscle_groups = '{Shoulders, Core}'
WHERE name = 'Bottoms Up Carry';

UPDATE public.exercises SET 
  description = 'Technical cues: Hold heavy weights at your sides. Maintain an upright posture and take short, controlled steps.',
  primary_muscle_group = 'Forearms',
  secondary_muscle_groups = '{Traps, Core, Legs}'
WHERE name = 'Farmer Carry';

UPDATE public.exercises SET 
  description = 'Technical cues: Hold the weights at shoulder height in a rack position. Keep your elbows high and ribs tucked.',
  primary_muscle_group = 'Core',
  secondary_muscle_groups = '{Upper Back, Shoulders}'
WHERE name = 'Front Rack Carry';

UPDATE public.exercises SET 
  description = 'Technical cues: Lock the weights out directly overhead. Shoulder blades should be packed down while the weight stays stacked.',
  primary_muscle_group = 'Shoulders',
  secondary_muscle_groups = '{Core, Upper Back}'
WHERE name = 'Overhead Carry';

UPDATE public.exercises SET 
  description = 'Technical cues: Bear hug the sandbag tight to your chest. Lean slightly back and take small, steady steps.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Core, Upper Back, Legs}'
WHERE name = 'Sandbag Carry';

UPDATE public.exercises SET 
  description = 'Technical cues: Hold a heavy weight in one hand only. Resist the pull to lean sideways; stay perfectly vertical.',
  primary_muscle_group = 'Obliques',
  secondary_muscle_groups = '{Core, Forearms}'
WHERE name = 'Suitcase Carry';

UPDATE public.exercises SET 
  description = 'Technical cues: Balance the yoke on your upper back/traps. Maintain a rigid torso and take rapid, short steps.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Core, Legs, Back}'
WHERE name = 'Yoke Walk';

UPDATE public.exercises SET 
  description = 'Technical cues: Cradle the bar in the crook of your elbows. Keep your hands clasped and chest high.',
  primary_muscle_group = 'Core',
  secondary_muscle_groups = '{Upper Back, Biceps, Legs}'
WHERE name = 'Zercher Carry';

-- CORE
UPDATE public.exercises SET 
  description = 'Technical cues: Roll out slowly while keeping your back flat. Use your abs to pull yourself back to the starting position.',
  primary_muscle_group = 'Abs',
  secondary_muscle_groups = '{Lats, Shoulders, Lower Back}'
WHERE name = 'Ab Wheel Rollout';

UPDATE public.exercises SET 
  description = 'Technical cues: Extend the opposite arm and leg simultaneously while maintaining a neutral spine. Avoid arching your back.',
  primary_muscle_group = 'Core',
  secondary_muscle_groups = '{Glutes, Lower Back}'
WHERE name = 'Bird Dog';

UPDATE public.exercises SET 
  description = 'Technical cues: Kneel and pull the rope to the sides of your head. Crunch down toward your knees using your abs.',
  primary_muscle_group = 'Abs',
  secondary_muscle_groups = '{Obliques}'
WHERE name = 'Cable Crunch';

UPDATE public.exercises SET 
  description = 'Technical cues: Lie on your back and slowly lower the opposite arm and leg. Maintain lower back contact with the floor.',
  primary_muscle_group = 'Core',
  secondary_muscle_groups = '{Abs}'
WHERE name = 'Dead Bug';

UPDATE public.exercises SET 
  description = 'Technical cues: Fasten your feet and sit back until your torso is horizontal. Explode up to vertical.',
  primary_muscle_group = 'Abs',
  secondary_muscle_groups = '{Hip Flexors}'
WHERE name = 'GHD Sit-Up';

UPDATE public.exercises SET 
  description = 'Technical cues: Press your lower back into the floor and lift your legs and shoulders slightly. Maintain a rigid "banana" shape.',
  primary_muscle_group = 'Abs',
  secondary_muscle_groups = '{Core}'
WHERE name = 'Hollow Hold';

UPDATE public.exercises SET 
  description = 'Technical cues: Support yourself on parallel bars or the floor. Lift your legs to a parallel position and hold.',
  primary_muscle_group = 'Abs',
  secondary_muscle_groups = '{Hip Flexors, Triceps, Shoulders}'
WHERE name = 'L-Sit';

UPDATE public.exercises SET 
  description = 'Technical cues: Resist the lateral pull of the cable. Stand perpendicular to the machine and press the handle away.',
  primary_muscle_group = 'Obliques',
  secondary_muscle_groups = '{Core, Shoulders}'
WHERE name = 'Pallof Press';

UPDATE public.exercises SET 
  description = 'Technical cues: Rotate your torso from side to side while sitting with feet elevated. Focus on using your obliques.',
  primary_muscle_group = 'Obliques',
  secondary_muscle_groups = '{Abs}'
WHERE name = 'Russian Twist';

UPDATE public.exercises SET 
  description = 'Technical cues: Prop yourself up on one forearm. Maintain a straight line from head to feet.',
  primary_muscle_group = 'Obliques',
  secondary_muscle_groups = '{Shoulders, Core}'
WHERE name = 'Side Plank';

UPDATE public.exercises SET 
  description = 'Technical cues: Use a full range of motion. Touch the floor behind your head and then touch your toes/feet.',
  primary_muscle_group = 'Abs',
  secondary_muscle_groups = '{Hip Flexors}'
WHERE name = 'Sit-Up';

UPDATE public.exercises SET 
  description = 'Technical cues: Hold a heavy weight in one hand. Maintain a perfectly vertical posture for the duration of the hold.',
  primary_muscle_group = 'Obliques',
  secondary_muscle_groups = '{Forearms, Core}'
WHERE name = 'Suitcase Hold';

UPDATE public.exercises SET 
  description = 'Technical cues: Hang from a bar and lift your feet until they touch the bar. Minimize swinging and use your core.',
  primary_muscle_group = 'Abs',
  secondary_muscle_groups = '{Hip Flexors, Grip, Lats}'
WHERE name = 'Toes to Bar';

UPDATE public.exercises SET 
  description = 'Technical cues: Lift your legs and torso simultaneously to form a "V" shape. Touch your toes at the top.',
  primary_muscle_group = 'Abs',
  secondary_muscle_groups = '{Hip Flexors}'
WHERE name = 'V-Up';

UPDATE public.exercises SET 
  description = 'Technical cues: Rotate your torso diagonally with the cable/band. Focus on using your core to drive the movement.',
  primary_muscle_group = 'Obliques',
  secondary_muscle_groups = '{Shoulders, Core}'
WHERE name = 'Woodchop';

-- HINGE
UPDATE public.exercises SET 
  description = 'Technical cues: Drive the barbell upward using your glutes. Squeeze hard at the peak and control the descent.',
  primary_muscle_group = 'Glutes',
  secondary_muscle_groups = '{Hamstrings, Core}'
WHERE name = 'Barbell Hip Thrust';

UPDATE public.exercises SET 
  description = 'Technical cues: Perform a deadlift from an elevated starting position (on blocks). Focus on power and lockout.',
  primary_muscle_group = 'Glutes',
  secondary_muscle_groups = '{Back, Hamstrings, Traps}'
WHERE name = 'Block Pull';

UPDATE public.exercises SET 
  description = 'Technical cues: Stand facing away from the cable machine. Hinge back to reach through your legs and snap your hips forward.',
  primary_muscle_group = 'Glutes',
  secondary_muscle_groups = '{Hamstrings, Lower Back}'
WHERE name = 'Cable Pull Through';

UPDATE public.exercises SET 
  description = 'Technical cues: Deadlift from a standing position on a plate or block. Increases the range of motion and hamstring stretch.',
  primary_muscle_group = 'Hamstrings',
  secondary_muscle_groups = '{Glutes, Lower Back}'
WHERE name = 'Deficit Deadlift';

UPDATE public.exercises SET 
  description = 'Technical cues: Lie on your back and drive your hips up. Focus on isolated glute contraction.',
  primary_muscle_group = 'Glutes',
  secondary_muscle_groups = '{Hamstrings}'
WHERE name = 'Glute Bridge';

UPDATE public.exercises SET 
  description = 'Technical cues: Hinge forward with the barbell on your upper back. Maintain a flat back and slight knee bend.',
  primary_muscle_group = 'Hamstrings',
  secondary_muscle_groups = '{Lower Back, Glutes}'
WHERE name = 'Good Morning';

UPDATE public.exercises SET 
  description = 'Technical cues: Hinge at the hips and "snap" them forward to drive the kettlebell to chest height. Do not use your arms to lift.',
  primary_muscle_group = 'Glutes',
  secondary_muscle_groups = '{Hamstrings, Core, Shoulders}'
WHERE name = 'Kettlebell Swing';

UPDATE public.exercises SET 
  description = 'Technical cues: Balance on one leg and hinge forward while keeping your back flat. Keep the weight close to your leg.',
  primary_muscle_group = 'Hamstrings',
  secondary_muscle_groups = '{Glutes, Core, Ankle Stabilizers}'
WHERE name = 'Single Leg RDL';

UPDATE public.exercises SET 
  description = 'Technical cues: Similar to RDL but with straighter legs. Focus on the extreme hamstring stretch.',
  primary_muscle_group = 'Hamstrings',
  secondary_muscle_groups = '{Glutes, Lower Back}'
WHERE name = 'Stiff-Leg Deadlift';

UPDATE public.exercises SET 
  description = 'Technical cues: Stand inside the bar. Use a more upright torso than a conventional deadlift. Great for beginners.',
  primary_muscle_group = 'Quads',
  secondary_muscle_groups = '{Glutes, Hamstrings, Back}'
WHERE name = 'Trap Bar Deadlift';

-- OLYMPIC
UPDATE public.exercises SET 
  description = 'Technical cues: Explode the bar from floor to shoulders. Catch in a full squat and stand up.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Legs, Back, Shoulders, Core}'
WHERE name = 'Clean';

UPDATE public.exercises SET 
  description = 'Technical cues: The complete Olympic lift. From floor to shoulders, then overhead with a split or power jerk.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Legs, Shoulders, Back}'
WHERE name = 'Clean & Jerk';

UPDATE public.exercises SET 
  description = 'Technical cues: From above the knee, explode and catch the bar in a full squat position.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Back, Glutes, Legs}'
WHERE name = 'Hang Clean';

UPDATE public.exercises SET 
  description = 'Technical cues: From above the knee, explode and catch the bar in a partial squat position.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Back, Shoulders, Legs}'
WHERE name = 'Hang Power Clean';

UPDATE public.exercises SET 
  description = 'Technical cues: From above the knee, explode and catch the bar overhead in a partial squat.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Shoulders, Back, Legs}'
WHERE name = 'Hang Power Snatch';

UPDATE public.exercises SET 
  description = 'Technical cues: From above the knee, explode and catch the bar overhead in a full squat.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Full Body, Shoulders, Stability}'
WHERE name = 'Hang Snatch';

UPDATE public.exercises SET 
  description = 'Technical cues: Hold the bar overhead with a wide grip and squat to full depth. Requires extreme shoulder mobility.',
  primary_muscle_group = 'Shoulders',
  secondary_muscle_groups = '{Legs, Core, Upper Back}'
WHERE name = 'Overhead Squat';

UPDATE public.exercises SET 
  description = 'Technical cues: Explode the bar from floor to shoulders, catching in a partial squat.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Back, Legs, Shoulders}'
WHERE name = 'Power Clean';

UPDATE public.exercises SET 
  description = 'Technical cues: Explode the bar from floor to overhead in one fluid motion, catching in a partial squat.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Shoulders, Back, Legs}'
WHERE name = 'Power Snatch';

UPDATE public.exercises SET 
  description = 'Technical cues: Dip and drive the bar overhead, catching in a split position for maximum stability.',
  primary_muscle_group = 'Shoulders',
  secondary_muscle_groups = '{Triceps, Legs, Core}'
WHERE name = 'Split Jerk';

-- OTHER
UPDATE public.exercises SET 
  description = 'Technical cues: Reach over the bag/stone. Hinge back, pull to lap, then explode up to load onto a platform.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Back, Hips, Arms}'
WHERE name = 'Atlas Stone';

UPDATE public.exercises SET 
  description = 'Technical cues: Similar to overhead press but using a thicker axle bar. Challenges grip and stability.',
  primary_muscle_group = 'Shoulders',
  secondary_muscle_groups = '{Grip, Forearms, Triceps}'
WHERE name = 'Axle Bar Press';

UPDATE public.exercises SET 
  description = 'Technical cues: Hinge at the hips on a 45-degree bench. Squeeze your lower back and glutes at the top.',
  primary_muscle_group = 'Lower Back',
  secondary_muscle_groups = '{Glutes, Hamstrings}'
WHERE name = 'Back Extension';

UPDATE public.exercises SET 
  description = 'Technical cues: Reach high and slam the med ball into the floor using your entire core. Catch and repeat.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Core, Lats, Shoulders}'
WHERE name = 'Ball Slam';

UPDATE public.exercises SET 
  description = 'Technical cues: A high-skill gymnastics movement. Pull your chest over the bar and dip to lockout.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Lats, Biceps, Triceps, Core}'
WHERE name = 'Bar Muscle-Up';

UPDATE public.exercises SET 
  description = 'Technical cues: Stand on the edge of a block. Lower your heels and explode onto your toes.',
  primary_muscle_group = 'Calves',
  secondary_muscle_groups = '{Feet}'
WHERE name = 'Calf Raise';

UPDATE public.exercises SET 
  description = 'Technical cues: A squat clean followed by a thruster. A high-intensity full body movement.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Legs, Back, Shoulders}'
WHERE name = 'Cluster';

UPDATE public.exercises SET 
  description = 'Technical cues: Secure your feet and hinge at the knees. Maintain a rigid torso throughout the movement.',
  primary_muscle_group = 'Hamstrings',
  secondary_muscle_groups = '{Glutes}'
WHERE name = 'Glute Ham Raise';

UPDATE public.exercises SET 
  description = 'Technical cues: Perform a vertical push-up while in a handstand against a wall. Requires immense shoulder strength.',
  primary_muscle_group = 'Shoulders',
  secondary_muscle_groups = '{Triceps, Core}'
WHERE name = 'Handstand Push-Up';

UPDATE public.exercises SET 
  description = 'Technical cues: Use a machine or leg curl station. Focus on isolated hamstring contraction.',
  primary_muscle_group = 'Hamstrings',
  secondary_muscle_groups = '{Calves}'
WHERE name = 'Leg Curl';

UPDATE public.exercises SET 
  description = 'Technical cues: Sit on a machine and straighten your legs against resistance. Isolate the quads.',
  primary_muscle_group = 'Quads',
  secondary_muscle_groups = '{None}'
WHERE name = 'Leg Extension';

UPDATE public.exercises SET 
  description = 'Technical cues: Support yourself on gymnastic rings. Dip and then pull your torso over the rings.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Lats, Triceps, Shoulders, Core}'
WHERE name = 'Ring Muscle-Up';

UPDATE public.exercises SET 
  description = 'Technical cues: Climb a vertical rope using your hands and feet (or just hands for legless). Full body strength and grip.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Back, Biceps, Core, Grip}'
WHERE name = 'Rope Climb';

UPDATE public.exercises SET 
  description = 'Technical cues: Deep squat and transition directly into an overhead press in one fluid motion.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Legs, Shoulders, Core}'
WHERE name = 'Thruster';

UPDATE public.exercises SET 
  description = 'Technical cues: A complex movement moving from lying to standing while holding a weight overhead. Challenges total body stability.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Shoulders, Core, Hips}'
WHERE name = 'Turkish Get-Up';

UPDATE public.exercises SET 
  description = 'Technical cues: Squat and throw a medicine ball against a target on the wall. Catch and repeat in rhythm.',
  primary_muscle_group = 'Full Body',
  secondary_muscle_groups = '{Legs, Shoulders, Core}'
WHERE name = 'Wall Ball';

-- PULL
UPDATE public.exercises SET 
  description = 'Technical cues: Support your chest on an incline bench. Pull the dumbbells or barbell toward your waist.',
  primary_muscle_group = 'Upper Back',
  secondary_muscle_groups = '{Lats, Biceps}'
WHERE name = 'Chest Supported Row';

UPDATE public.exercises SET 
  description = 'Technical cues: Pull your chest to the bar with an underhand grip. Emphasizes the biceps more than pull-ups.',
  primary_muscle_group = 'Lats',
  secondary_muscle_groups = '{Biceps, Rhomboids}'
WHERE name = 'Chin-Up';

UPDATE public.exercises SET 
  description = 'Technical cues: Isolate the biceps by keeping your upper arm fixed. Squeeze hard at the peak of the curl.',
  primary_muscle_group = 'Biceps',
  secondary_muscle_groups = '{Forearms}'
WHERE name = 'Concentration Curl';

UPDATE public.exercises SET 
  description = 'Technical cues: Standard dumbbell curl. Rotate your palms toward you as you lift.',
  primary_muscle_group = 'Biceps',
  secondary_muscle_groups = '{Forearms}'
WHERE name = 'Dumbbell Curl';

UPDATE public.exercises SET 
  description = 'Technical cues: Pull a dumbbell toward your hip while supporting yourself with the other hand/knee.',
  primary_muscle_group = 'Lats',
  secondary_muscle_groups = '{Upper Back, Biceps}'
WHERE name = 'Dumbbell Row';

UPDATE public.exercises SET 
  description = 'Technical cues: Pull a rope attachment toward your forehead while separating the ends. Targets the rear delts.',
  primary_muscle_group = 'Rear Delts',
  secondary_muscle_groups = '{Upper Back, Traps}'
WHERE name = 'Face Pull';

UPDATE public.exercises SET 
  description = 'Technical cues: Keep your palms facing each other (neutral grip). Targets the brachialis and forearms.',
  primary_muscle_group = 'Biceps',
  secondary_muscle_groups = '{Forearms}'
WHERE name = 'Hammer Curl';

UPDATE public.exercises SET 
  description = 'Technical cues: Bodyweight row using a bar or rings. Keep your body in a straight line.',
  primary_muscle_group = 'Upper Back',
  secondary_muscle_groups = '{Lats, Biceps, Core}'
WHERE name = 'Inverted Row';

UPDATE public.exercises SET 
  description = 'Technical cues: Barbell row starting from the floor each time. Focus on explosive pull to the upper stomach.',
  primary_muscle_group = 'Upper Back',
  secondary_muscle_groups = '{Lats, Biceps}'
WHERE name = 'Pendlay Row';

UPDATE public.exercises SET 
  description = 'Technical cues: Standard seated cable row. Pull toward your lower stomach and squeeze your back.',
  primary_muscle_group = 'Upper Back',
  secondary_muscle_groups = '{Lats, Biceps}'
WHERE name = 'Seated Cable Row';

-- PUSH
UPDATE public.exercises SET 
  description = 'Technical cues: Shoulder press that starts with palms facing you and rotates to facing away at the top.',
  primary_muscle_group = 'Shoulders',
  secondary_muscle_groups = '{Triceps, Upper Back}'
WHERE name = 'Arnold Press';

UPDATE public.exercises SET 
  description = 'Technical cues: Keep your elbows closer to your body than a standard bench press. Focus on tricep engagement.',
  primary_muscle_group = 'Triceps',
  secondary_muscle_groups = '{Chest, Shoulders}'
WHERE name = 'Close Grip Bench Press';

UPDATE public.exercises SET 
  description = 'Technical cues: Standard push-up with hands close together forming a diamond. Heavy tricep emphasis.',
  primary_muscle_group = 'Triceps',
  secondary_muscle_groups = '{Chest, Shoulders}'
WHERE name = 'Diamond Push-Up';

UPDATE public.exercises SET 
  description = 'Technical cues: Lower the dumbbells to the sides of your chest. Focus on a deep stretch and controlled press.',
  primary_muscle_group = 'Chest',
  secondary_muscle_groups = '{Shoulders, Triceps}'
WHERE name = 'Dumbbell Bench Press';

UPDATE public.exercises SET 
  description = 'Technical cues: Raise dumbbells directly to the front to shoulder height. Focus on moving only the arms.',
  primary_muscle_group = 'Front Delts',
  secondary_muscle_groups = '{Upper Back}'
WHERE name = 'Front Raise';

UPDATE public.exercises SET 
  description = 'Technical cues: Raise dumbbells out to the sides. Keep a slight bend in your elbows and lead with them.',
  primary_muscle_group = 'Side Delts',
  secondary_muscle_groups = '{Traps}'
WHERE name = 'Lateral Raise';

UPDATE public.exercises SET 
  description = 'Technical cues: Standard tricep pushdown using a cable machine. Keep your elbows pinned to your sides.',
  primary_muscle_group = 'Triceps',
  secondary_muscle_groups = '{None}'
WHERE name = 'Tricep Pushdown';

-- SQUAT
UPDATE public.exercises SET 
  description = 'Technical cues: Use a machine for a fixed-path squat. Great for quad isolation and heavy loading.',
  primary_muscle_group = 'Quads',
  secondary_muscle_groups = '{Glutes}'
WHERE name = 'Leg Press';

UPDATE public.exercises SET 
  description = 'Technical cues: Single leg squat to full depth. Requires extreme balance, mobility, and leg strength.',
  primary_muscle_group = 'Quads',
  secondary_muscle_groups = '{Glutes, Core, Ankle Stabilizers}'
WHERE name = 'Pistol Squat';

UPDATE public.exercises SET 
  description = 'Technical cues: Similar to a front rack carry but with a squat. Heavy core and upper back demand.',
  primary_muscle_group = 'Quads',
  secondary_muscle_groups = '{Glutes, Core, Upper Back}'
WHERE name = 'Zercher Squat';

-- Verify update count matches total exercises
-- SELECT count(*) FROM public.exercises WHERE description IS NOT NULL;
