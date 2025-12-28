-- Update Back Squat
UPDATE public.exercises 
SET 
  description = 'A staple strength movement. Keep your chest up, brace your core, and squat until your hips are below your knees. Push through your mid-foot.',
  primary_muscle_group = 'Quads',
  secondary_muscle_groups = '{Glutes, Hamstrings, Core}',
  demo_url = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400'
WHERE name = 'Back Squat';

-- Update Bench Press
UPDATE public.exercises 
SET 
  description = 'The classic chest movement. Keep your shoulder blades retracted, plant your feet firmly, and lower the bar to your mid-chest.',
  primary_muscle_group = 'Chest',
  secondary_muscle_groups = '{Triceps, Shoulders}',
  demo_url = 'https://images.unsplash.com/photo-1541534741688-6078c64b52d3?auto=format&fit=crop&q=80&w=400'
WHERE name = 'Bench Press';

-- Update Conventional Deadlift
UPDATE public.exercises 
SET 
  description = 'A full-body hinge movement. Hinge at the hips, keep your back flat, and pull the bar up your shins while driving through the floor.',
  primary_muscle_group = 'Hamstrings',
  secondary_muscle_groups = '{Glutes, Back, Core, Forearms}',
  demo_url = 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&q=80&w=400'
WHERE name = 'Conventional Deadlift';
