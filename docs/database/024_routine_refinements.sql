-- ============================================
-- ProjectAthlete v2 - Database Migration 024
-- Update Routine Refinements
-- ============================================

-- 1. Update check constraint for routine_blocks.block_type
-- We need to drop the existing constraint and add a new one with the expanded list

ALTER TABLE public.routine_blocks 
DROP CONSTRAINT IF EXISTS routine_blocks_block_type_check;

ALTER TABLE public.routine_blocks 
ADD CONSTRAINT routine_blocks_block_type_check 
CHECK (block_type IN (
    'warm_up', 
    'plyometrics', 
    'main_lift', 
    'accessory', 
    'calisthenics', 
    'general_cardio', 
    'running', 
    'engine_work', 
    'yoga_mobility', 
    'hyrox', 
    'wod',       -- NEW
    'skills',    -- NEW
    'recovery',  -- NEW
    'other'
));
