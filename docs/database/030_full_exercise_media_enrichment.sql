-- ============================================
-- ProjectAthlete v2 - Migration 030
-- Automated Media Matching (Unsplash Premium)
-- ============================================

-- SQUATS
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400' WHERE category = 'squat' AND demo_url IS NULL;
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1541534741688-6078c64b52d3?auto=format&fit=crop&q=80&w=400' WHERE name ILIKE '%Barbell Squat%' OR name = 'Back Squat';

-- HINGES
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400' WHERE category = 'hinge' AND demo_url IS NULL;
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&q=80&w=400' WHERE name ILIKE '%Deadlift%';

-- PUSH
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1517838276537-c2251814e56f?auto=format&fit=crop&q=80&w=400' WHERE category = 'push' AND demo_url IS NULL;
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1534367507873-d2b7e2495ea9?auto=format&fit=crop&q=80&w=400' WHERE name ILIKE '%Bench Press%';

-- PULL
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1590239062391-7f37ec616abc?auto=format&fit=crop&q=80&w=400' WHERE category = 'pull' AND demo_url IS NULL;
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=400' WHERE name ILIKE '%Pull-Up%' OR name ILIKE '%Chin-Up%';

-- OLYMPIC
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1541534401786-2077ee879fe0?auto=format&fit=crop&q=80&w=400' WHERE category = 'olympic' AND demo_url IS NULL;

-- CORE
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400' WHERE category = 'core' AND demo_url IS NULL;

-- CARDIO
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1538388149343-8d9ed47bc565?auto=format&fit=crop&q=80&w=400' WHERE category = 'cardio' AND demo_url IS NULL;

-- OTHER / CROSSFIT / STRONGMAN
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1517963879430-6d9b40f6e52c?auto=format&fit=crop&q=80&w=400' WHERE category = 'other' AND demo_url IS NULL;

-- CARRY
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1517438476312-10d79c67750d?auto=format&fit=crop&q=80&w=400' WHERE category = 'carry' AND demo_url IS NULL;

-- Specific Polish for Premium Vibe
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&q=80&w=400' WHERE name = 'Assault Bike';
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1536922645426-5d658ab49b81?auto=format&fit=crop&q=80&w=400' WHERE name = 'Rowing';
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=400' WHERE name = 'Running';
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1594911773159-399c1f256222?auto=format&fit=crop&q=80&w=400' WHERE name = 'Box Jump';
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=400' WHERE name = 'Burpee';
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1590239062391-7f37ec616abc?auto=format&fit=crop&q=80&w=400' WHERE name = 'Dips';
UPDATE exercises SET demo_url = 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=400' WHERE name = 'Pull-Up';

-- Final verification check
-- SELECT name, category, demo_url FROM exercises WHERE demo_url IS NULL;
