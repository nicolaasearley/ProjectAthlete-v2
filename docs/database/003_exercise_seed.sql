-- ============================================
-- ProjectAthlete v2 - Database Migration 003
-- Exercise Seed Data
-- ============================================

-- Run this AFTER 002_exercises.sql

-- ============================================
-- SQUAT EXERCISES
-- ============================================
INSERT INTO public.exercises (name, category, is_global) VALUES
('Back Squat', 'squat', TRUE),
('Front Squat', 'squat', TRUE),
('Goblet Squat', 'squat', TRUE),
('Box Squat', 'squat', TRUE),
('Pause Squat', 'squat', TRUE),
('Safety Bar Squat', 'squat', TRUE),
('Zercher Squat', 'squat', TRUE),
('Bulgarian Split Squat', 'squat', TRUE),
('Leg Press', 'squat', TRUE),
('Hack Squat', 'squat', TRUE),
('Pistol Squat', 'squat', TRUE),
('Wall Sit', 'squat', TRUE);

-- Squat aliases
INSERT INTO public.exercise_aliases (exercise_id, alias)
SELECT id, 'High Bar Squat' FROM public.exercises WHERE name = 'Back Squat'
UNION ALL
SELECT id, 'Low Bar Squat' FROM public.exercises WHERE name = 'Back Squat'
UNION ALL
SELECT id, 'Barbell Back Squat' FROM public.exercises WHERE name = 'Back Squat'
UNION ALL
SELECT id, 'Barbell Front Squat' FROM public.exercises WHERE name = 'Front Squat'
UNION ALL
SELECT id, 'KB Goblet Squat' FROM public.exercises WHERE name = 'Goblet Squat'
UNION ALL
SELECT id, 'Kettlebell Goblet Squat' FROM public.exercises WHERE name = 'Goblet Squat';

-- ============================================
-- HINGE EXERCISES
-- ============================================
INSERT INTO public.exercises (name, category, is_global) VALUES
('Conventional Deadlift', 'hinge', TRUE),
('Sumo Deadlift', 'hinge', TRUE),
('Romanian Deadlift', 'hinge', TRUE),
('Stiff-Leg Deadlift', 'hinge', TRUE),
('Trap Bar Deadlift', 'hinge', TRUE),
('Deficit Deadlift', 'hinge', TRUE),
('Block Pull', 'hinge', TRUE),
('Good Morning', 'hinge', TRUE),
('Hip Thrust', 'hinge', TRUE),
('Barbell Hip Thrust', 'hinge', TRUE),
('Glute Bridge', 'hinge', TRUE),
('Cable Pull Through', 'hinge', TRUE),
('Kettlebell Swing', 'hinge', TRUE),
('Single Leg RDL', 'hinge', TRUE);

-- Hinge aliases
INSERT INTO public.exercise_aliases (exercise_id, alias)
SELECT id, 'Deadlift' FROM public.exercises WHERE name = 'Conventional Deadlift'
UNION ALL
SELECT id, 'DL' FROM public.exercises WHERE name = 'Conventional Deadlift'
UNION ALL
SELECT id, 'RDL' FROM public.exercises WHERE name = 'Romanian Deadlift'
UNION ALL
SELECT id, 'SLDL' FROM public.exercises WHERE name = 'Stiff-Leg Deadlift'
UNION ALL
SELECT id, 'Hex Bar Deadlift' FROM public.exercises WHERE name = 'Trap Bar Deadlift'
UNION ALL
SELECT id, 'KB Swing' FROM public.exercises WHERE name = 'Kettlebell Swing';

-- ============================================
-- PUSH EXERCISES
-- ============================================
INSERT INTO public.exercises (name, category, is_global) VALUES
('Bench Press', 'push', TRUE),
('Incline Bench Press', 'push', TRUE),
('Decline Bench Press', 'push', TRUE),
('Close Grip Bench Press', 'push', TRUE),
('Dumbbell Bench Press', 'push', TRUE),
('Dumbbell Incline Press', 'push', TRUE),
('Overhead Press', 'push', TRUE),
('Push Press', 'push', TRUE),
('Dumbbell Shoulder Press', 'push', TRUE),
('Arnold Press', 'push', TRUE),
('Landmine Press', 'push', TRUE),
('Dips', 'push', TRUE),
('Tricep Pushdown', 'push', TRUE),
('Skull Crushers', 'push', TRUE),
('Overhead Tricep Extension', 'push', TRUE),
('Push-Up', 'push', TRUE),
('Diamond Push-Up', 'push', TRUE),
('Lateral Raise', 'push', TRUE),
('Front Raise', 'push', TRUE),
('Cable Fly', 'push', TRUE),
('Pec Deck', 'push', TRUE);

-- Push aliases
INSERT INTO public.exercise_aliases (exercise_id, alias)
SELECT id, 'Flat Bench Press' FROM public.exercises WHERE name = 'Bench Press'
UNION ALL
SELECT id, 'Barbell Bench Press' FROM public.exercises WHERE name = 'Bench Press'
UNION ALL
SELECT id, 'BB Bench' FROM public.exercises WHERE name = 'Bench Press'
UNION ALL
SELECT id, 'OHP' FROM public.exercises WHERE name = 'Overhead Press'
UNION ALL
SELECT id, 'Standing Press' FROM public.exercises WHERE name = 'Overhead Press'
UNION ALL
SELECT id, 'Military Press' FROM public.exercises WHERE name = 'Overhead Press'
UNION ALL
SELECT id, 'Strict Press' FROM public.exercises WHERE name = 'Overhead Press'
UNION ALL
SELECT id, 'DB Shoulder Press' FROM public.exercises WHERE name = 'Dumbbell Shoulder Press'
UNION ALL
SELECT id, 'Seated Shoulder Press' FROM public.exercises WHERE name = 'Dumbbell Shoulder Press'
UNION ALL
SELECT id, 'Lying Tricep Extension' FROM public.exercises WHERE name = 'Skull Crushers'
UNION ALL
SELECT id, 'Pushup' FROM public.exercises WHERE name = 'Push-Up'
UNION ALL
SELECT id, 'Press-Up' FROM public.exercises WHERE name = 'Push-Up';

-- ============================================
-- PULL EXERCISES
-- ============================================
INSERT INTO public.exercises (name, category, is_global) VALUES
('Pull-Up', 'pull', TRUE),
('Chin-Up', 'pull', TRUE),
('Lat Pulldown', 'pull', TRUE),
('Barbell Row', 'pull', TRUE),
('Pendlay Row', 'pull', TRUE),
('Dumbbell Row', 'pull', TRUE),
('T-Bar Row', 'pull', TRUE),
('Seated Cable Row', 'pull', TRUE),
('Face Pull', 'pull', TRUE),
('Straight Arm Pulldown', 'pull', TRUE),
('Inverted Row', 'pull', TRUE),
('Meadows Row', 'pull', TRUE),
('Chest Supported Row', 'pull', TRUE),
('Barbell Curl', 'pull', TRUE),
('Dumbbell Curl', 'pull', TRUE),
('Hammer Curl', 'pull', TRUE),
('Preacher Curl', 'pull', TRUE),
('Cable Curl', 'pull', TRUE),
('Concentration Curl', 'pull', TRUE),
('Barbell Shrug', 'pull', TRUE),
('Dumbbell Shrug', 'pull', TRUE);

-- Pull aliases
INSERT INTO public.exercise_aliases (exercise_id, alias)
SELECT id, 'Pullup' FROM public.exercises WHERE name = 'Pull-Up'
UNION ALL
SELECT id, 'Wide Grip Pull-Up' FROM public.exercises WHERE name = 'Pull-Up'
UNION ALL
SELECT id, 'Chinup' FROM public.exercises WHERE name = 'Chin-Up'
UNION ALL
SELECT id, 'Supinated Pull-Up' FROM public.exercises WHERE name = 'Chin-Up'
UNION ALL
SELECT id, 'Bent Over Row' FROM public.exercises WHERE name = 'Barbell Row'
UNION ALL
SELECT id, 'BB Row' FROM public.exercises WHERE name = 'Barbell Row'
UNION ALL
SELECT id, 'One Arm Row' FROM public.exercises WHERE name = 'Dumbbell Row'
UNION ALL
SELECT id, 'DB Row' FROM public.exercises WHERE name = 'Dumbbell Row'
UNION ALL
SELECT id, 'Single Arm Row' FROM public.exercises WHERE name = 'Dumbbell Row'
UNION ALL
SELECT id, 'Bicep Curl' FROM public.exercises WHERE name = 'Barbell Curl'
UNION ALL
SELECT id, 'BB Curl' FROM public.exercises WHERE name = 'Barbell Curl'
UNION ALL
SELECT id, 'Shrugs' FROM public.exercises WHERE name = 'Barbell Shrug';

-- ============================================
-- OLYMPIC LIFTS
-- ============================================
INSERT INTO public.exercises (name, category, is_global) VALUES
('Clean', 'olympic', TRUE),
('Power Clean', 'olympic', TRUE),
('Hang Clean', 'olympic', TRUE),
('Clean Pull', 'olympic', TRUE),
('Snatch', 'olympic', TRUE),
('Power Snatch', 'olympic', TRUE),
('Hang Snatch', 'olympic', TRUE),
('Snatch Pull', 'olympic', TRUE),
('Clean & Jerk', 'olympic', TRUE),
('Split Jerk', 'olympic', TRUE),
('Push Jerk', 'olympic', TRUE),
('Muscle Clean', 'olympic', TRUE),
('Muscle Snatch', 'olympic', TRUE),
('Hang Power Clean', 'olympic', TRUE),
('Hang Power Snatch', 'olympic', TRUE),
('Snatch Grip Deadlift', 'olympic', TRUE),
('Clean Grip Deadlift', 'olympic', TRUE),
('Overhead Squat', 'olympic', TRUE);

-- Olympic aliases
INSERT INTO public.exercise_aliases (exercise_id, alias)
SELECT id, 'Full Clean' FROM public.exercises WHERE name = 'Clean'
UNION ALL
SELECT id, 'Squat Clean' FROM public.exercises WHERE name = 'Clean'
UNION ALL
SELECT id, 'Full Snatch' FROM public.exercises WHERE name = 'Snatch'
UNION ALL
SELECT id, 'Squat Snatch' FROM public.exercises WHERE name = 'Snatch'
UNION ALL
SELECT id, 'C&J' FROM public.exercises WHERE name = 'Clean & Jerk'
UNION ALL
SELECT id, 'CJ' FROM public.exercises WHERE name = 'Clean & Jerk'
UNION ALL
SELECT id, 'OHS' FROM public.exercises WHERE name = 'Overhead Squat';

-- ============================================
-- CARRY EXERCISES
-- ============================================
INSERT INTO public.exercises (name, category, is_global) VALUES
('Farmer Carry', 'carry', TRUE),
('Suitcase Carry', 'carry', TRUE),
('Overhead Carry', 'carry', TRUE),
('Yoke Walk', 'carry', TRUE),
('Sandbag Carry', 'carry', TRUE),
('Front Rack Carry', 'carry', TRUE),
('Zercher Carry', 'carry', TRUE),
('Bottoms Up Carry', 'carry', TRUE);

-- Carry aliases
INSERT INTO public.exercise_aliases (exercise_id, alias)
SELECT id, 'Farmers Walk' FROM public.exercises WHERE name = 'Farmer Carry'
UNION ALL
SELECT id, 'Farmer Walk' FROM public.exercises WHERE name = 'Farmer Carry'
UNION ALL
SELECT id, 'Farmers Carry' FROM public.exercises WHERE name = 'Farmer Carry';

-- ============================================
-- CORE EXERCISES
-- ============================================
INSERT INTO public.exercises (name, category, is_global) VALUES
('Plank', 'core', TRUE),
('Side Plank', 'core', TRUE),
('Dead Bug', 'core', TRUE),
('Bird Dog', 'core', TRUE),
('Hanging Leg Raise', 'core', TRUE),
('Toes to Bar', 'core', TRUE),
('Ab Wheel Rollout', 'core', TRUE),
('Cable Crunch', 'core', TRUE),
('Pallof Press', 'core', TRUE),
('Russian Twist', 'core', TRUE),
('Sit-Up', 'core', TRUE),
('GHD Sit-Up', 'core', TRUE),
('V-Up', 'core', TRUE),
('Hollow Hold', 'core', TRUE),
('L-Sit', 'core', TRUE),
('Woodchop', 'core', TRUE),
('Suitcase Hold', 'core', TRUE);

-- Core aliases
INSERT INTO public.exercise_aliases (exercise_id, alias)
SELECT id, 'Leg Raise' FROM public.exercises WHERE name = 'Hanging Leg Raise'
UNION ALL
SELECT id, 'HLR' FROM public.exercises WHERE name = 'Hanging Leg Raise'
UNION ALL
SELECT id, 'T2B' FROM public.exercises WHERE name = 'Toes to Bar'
UNION ALL
SELECT id, 'TTB' FROM public.exercises WHERE name = 'Toes to Bar'
UNION ALL
SELECT id, 'Situp' FROM public.exercises WHERE name = 'Sit-Up'
UNION ALL
SELECT id, 'Crunch' FROM public.exercises WHERE name = 'Sit-Up';

-- ============================================
-- CARDIO EXERCISES
-- ============================================
INSERT INTO public.exercises (name, category, is_global) VALUES
('Running', 'cardio', TRUE),
('Rowing', 'cardio', TRUE),
('Assault Bike', 'cardio', TRUE),
('Ski Erg', 'cardio', TRUE),
('Jump Rope', 'cardio', TRUE),
('Double Unders', 'cardio', TRUE),
('Box Jump', 'cardio', TRUE),
('Burpee', 'cardio', TRUE),
('Mountain Climber', 'cardio', TRUE),
('Battle Ropes', 'cardio', TRUE),
('Sled Push', 'cardio', TRUE),
('Sled Pull', 'cardio', TRUE),
('Stair Climber', 'cardio', TRUE),
('Cycling', 'cardio', TRUE),
('Swimming', 'cardio', TRUE);

-- Cardio aliases
INSERT INTO public.exercise_aliases (exercise_id, alias)
SELECT id, 'Run' FROM public.exercises WHERE name = 'Running'
UNION ALL
SELECT id, 'Row' FROM public.exercises WHERE name = 'Rowing'
UNION ALL
SELECT id, 'Erg' FROM public.exercises WHERE name = 'Rowing'
UNION ALL
SELECT id, 'Concept 2' FROM public.exercises WHERE name = 'Rowing'
UNION ALL
SELECT id, 'C2' FROM public.exercises WHERE name = 'Rowing'
UNION ALL
SELECT id, 'Air Bike' FROM public.exercises WHERE name = 'Assault Bike'
UNION ALL
SELECT id, 'Echo Bike' FROM public.exercises WHERE name = 'Assault Bike'
UNION ALL
SELECT id, 'DU' FROM public.exercises WHERE name = 'Double Unders'
UNION ALL
SELECT id, 'DUs' FROM public.exercises WHERE name = 'Double Unders'
UNION ALL
SELECT id, 'Burpees' FROM public.exercises WHERE name = 'Burpee';

-- ============================================
-- OTHER EXERCISES
-- ============================================
INSERT INTO public.exercises (name, category, is_global) VALUES
('Wall Ball', 'other', TRUE),
('Thruster', 'other', TRUE),
('Cluster', 'other', TRUE),
('Man Maker', 'other', TRUE),
('Turkish Get-Up', 'other', TRUE),
('Muscle-Up', 'other', TRUE),
('Bar Muscle-Up', 'other', TRUE),
('Ring Muscle-Up', 'other', TRUE),
('Handstand Push-Up', 'other', TRUE),
('Strict Handstand Push-Up', 'other', TRUE),
('Kipping Handstand Push-Up', 'other', TRUE),
('Ring Dip', 'other', TRUE),
('Rope Climb', 'other', TRUE),
('Legless Rope Climb', 'other', TRUE),
('Ball Slam', 'other', TRUE),
('Sandbag Clean', 'other', TRUE),
('Atlas Stone', 'other', TRUE),
('Log Press', 'other', TRUE),
('Axle Bar Press', 'other', TRUE),
('Calf Raise', 'other', TRUE),
('Leg Curl', 'other', TRUE),
('Leg Extension', 'other', TRUE),
('Glute Ham Raise', 'other', TRUE),
('Nordic Curl', 'other', TRUE),
('Reverse Hyper', 'other', TRUE),
('Back Extension', 'other', TRUE);

-- Other aliases
INSERT INTO public.exercise_aliases (exercise_id, alias)
SELECT id, 'TGU' FROM public.exercises WHERE name = 'Turkish Get-Up'
UNION ALL
SELECT id, 'MU' FROM public.exercises WHERE name = 'Muscle-Up'
UNION ALL
SELECT id, 'BMU' FROM public.exercises WHERE name = 'Bar Muscle-Up'
UNION ALL
SELECT id, 'RMU' FROM public.exercises WHERE name = 'Ring Muscle-Up'
UNION ALL
SELECT id, 'HSPU' FROM public.exercises WHERE name = 'Handstand Push-Up'
UNION ALL
SELECT id, 'Strict HSPU' FROM public.exercises WHERE name = 'Strict Handstand Push-Up'
UNION ALL
SELECT id, 'Kipping HSPU' FROM public.exercises WHERE name = 'Kipping Handstand Push-Up'
UNION ALL
SELECT id, 'GHR' FROM public.exercises WHERE name = 'Glute Ham Raise'
UNION ALL
SELECT id, 'GHD' FROM public.exercises WHERE name = 'Glute Ham Raise'
UNION ALL
SELECT id, 'Nordic Hamstring Curl' FROM public.exercises WHERE name = 'Nordic Curl'
UNION ALL
SELECT id, 'Hyperextension' FROM public.exercises WHERE name = 'Back Extension';

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this to verify seed data:
-- SELECT category, COUNT(*) FROM exercises GROUP BY category ORDER BY category;
-- SELECT COUNT(*) FROM exercise_aliases;
