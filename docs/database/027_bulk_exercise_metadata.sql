-- ============================================
-- ProjectAthlete v2 - Migration 027
-- Bulk Exercise Metadata Population (Phase 1)
-- ============================================

-- SQUATS
UPDATE public.exercises SET 
  description = 'Technical cues: Keep your chest up, brace your core, and drive through the mid-foot. Depth should be at or below parallel.',
  primary_muscle_group = 'Quads',
  secondary_muscle_groups = '{Glutes, Hamstrings, Lower Back, Core}'
WHERE name = 'Back Squat';

UPDATE public.exercises SET 
  description = 'Technical cues: Maintain a vertical torso and high elbow position. The bar should rest on your deltoids.',
  primary_muscle_group = 'Quads',
  secondary_muscle_groups = '{Glutes, Upper Back, Core}'
WHERE name = 'Front Squat';

UPDATE public.exercises SET 
  description = 'A great squat variation for learning depth and torso positioning. Hold the weight at chest height.',
  primary_muscle_group = 'Quads',
  secondary_muscle_groups = '{Glutes, Core, Forearms}'
WHERE name = 'Goblet Squat';

UPDATE public.exercises SET 
  description = 'Technical cues: Elevate your rear foot and keep your front shin vertical. Lean slightly forward for more glute emphasis.',
  primary_muscle_group = 'Quads',
  secondary_muscle_groups = '{Glutes, Adductors, Core}'
WHERE name = 'Bulgarian Split Squat';

-- HINGES
UPDATE public.exercises SET 
  description = 'Technical cues: Hinge at the hips, keep the bar close to your shins, and maintain a flat back throughout the pull.',
  primary_muscle_group = 'Hamstrings',
  secondary_muscle_groups = '{Glutes, Lower Back, Traps, Forearms, Core}'
WHERE name = 'Conventional Deadlift';

UPDATE public.exercises SET 
  description = 'Technical cues: Wide stance with toes pointed out. Keep your hips close to the bar and drive with your legs.',
  primary_muscle_group = 'Adductors',
  secondary_muscle_groups = '{Glutes, Hamstrings, Quads, Back}'
WHERE name = 'Sumo Deadlift';

UPDATE public.exercises SET 
  description = 'Technical cues: Focus on the stretch in the hamstrings. Hinge back until your torso is near parallel with a slight knee bend.',
  primary_muscle_group = 'Hamstrings',
  secondary_muscle_groups = '{Glutes, Lower Back}'
WHERE name = 'Romanian Deadlift';

UPDATE public.exercises SET 
  description = 'Technical cues: Drive your hips upward and squeeze your glutes hard at the top. Pause at the peak contraction.',
  primary_muscle_group = 'Glutes',
  secondary_muscle_groups = '{Hamstrings, Adductors}'
WHERE name = 'Hip Thrust';

-- PUSH
UPDATE public.exercises SET 
  description = 'Technical cues: Retract your shoulder blades, keep your feet planted, and lower the bar to your mid-chest.',
  primary_muscle_group = 'Chest',
  secondary_muscle_groups = '{Triceps, Front Delts}'
WHERE name = 'Bench Press';

UPDATE public.exercises SET 
  description = 'Technical cues: Target the upper pectorals. Set the bench to a 30-45 degree angle.',
  primary_muscle_group = 'Chest',
  secondary_muscle_groups = '{Front Delts, Triceps}'
WHERE name = 'Incline Bench Press';

UPDATE public.exercises SET 
  description = 'Technical cues: Press the weight directly overhead. Brace your core and glutes to prevent excessive arching.',
  primary_muscle_group = 'Shoulders',
  secondary_muscle_groups = '{Triceps, Upper Back, Core}'
WHERE name = 'Overhead Press';

UPDATE public.exercises SET 
  description = 'Technical cues: Maintain a slightly leans forward position and drive your elbows below the bar.',
  primary_muscle_group = 'Triceps',
  secondary_muscle_groups = '{Shoulders, Chest}'
WHERE name = 'Dips';

-- PULL
UPDATE public.exercises SET 
  description = 'Technical cues: Pull your chest to the bar. Focus on driving your elbows down and back.',
  primary_muscle_group = 'Lats',
  secondary_muscle_groups = '{Biceps, Rhomboids, Traps}'
WHERE name = 'Pull-Up';

UPDATE public.exercises SET 
  description = 'Technical cues: Pull the bar to your upper stomach. Maintain a flat back at roughly 45 degrees.',
  primary_muscle_group = 'Upper Back',
  secondary_muscle_groups = '{Lats, Biceps, Lower Back}'
WHERE name = 'Barbell Row';

UPDATE public.exercises SET 
  description = 'Technical cues: Pull the bar to your lower ribs. Focus on the stretch at the bottom and squeeze at the top.',
  primary_muscle_group = 'Lats',
  secondary_muscle_groups = '{Upper Back, Biceps}'
WHERE name = 'Lat Pulldown';

UPDATE public.exercises SET 
  description = 'Technical cues: Isolate the biceps by keeping your elbows glued to your sides. Avoid using momentum.',
  primary_muscle_group = 'Biceps',
  secondary_muscle_groups = '{Forearms}'
WHERE name = 'Barbell Curl';

-- CORE
UPDATE public.exercises SET 
  description = 'Technical cues: Maintain a straight line from head to heels. Squeeze your glutes and push away from the floor.',
  primary_muscle_group = 'Core',
  secondary_muscle_groups = '{Shoulders, Glutes}'
WHERE name = 'Plank';

UPDATE public.exercises SET 
  description = 'Technical cues: Drive your knees toward your chest while hanging. Control the descent to avoid swinging.',
  primary_muscle_group = 'Abs',
  secondary_muscle_groups = '{Hip Flexors, Forearms}'
WHERE name = 'Hanging Leg Raise';
