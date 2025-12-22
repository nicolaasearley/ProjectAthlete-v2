-- ============================================
-- ProjectAthlete v2 - Database Migration 018
-- Activity Feed: Include User Role
-- ============================================

CREATE OR REPLACE FUNCTION get_activity_feed(p_org_id UUID, p_limit INTEGER DEFAULT 50, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    display_name TEXT,
    avatar_url TEXT,
    user_role TEXT,
    post_type TEXT,
    content TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ,
    reaction_counts JSONB,
    user_reactions TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fp.id,
        fp.user_id,
        p.display_name,
        p.avatar_url,
        p.role as user_role,
        fp.post_type,
        fp.content,
        fp.metadata,
        fp.created_at,
        COALESCE(
            (SELECT jsonb_object_agg(reaction_type, count)
             FROM (
                SELECT fr.reaction_type, COUNT(*) as count
                FROM public.feed_reactions fr
                WHERE fr.post_id = fp.id
                GROUP BY fr.reaction_type
             ) r
            ), '{}'::jsonb
        ) as reaction_counts,
        COALESCE(
            (SELECT array_agg(fr.reaction_type)
             FROM public.feed_reactions fr
             WHERE fr.post_id = fp.id AND fr.user_id = auth.uid()
            ), ARRAY[]::TEXT[]
        ) as user_reactions
    FROM public.feed_posts fp
    JOIN public.profiles p ON p.id = fp.user_id
    WHERE fp.org_id = p_org_id
    ORDER BY fp.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

