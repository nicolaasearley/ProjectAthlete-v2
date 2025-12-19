export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          org_id: string
          role: 'athlete' | 'coach' | 'admin'
          display_name: string | null
          avatar_url: string | null
          is_anonymous_on_leaderboards: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          org_id: string
          role?: 'athlete' | 'coach' | 'admin'
          display_name?: string | null
          avatar_url?: string | null
          is_anonymous_on_leaderboards?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          role?: 'athlete' | 'coach' | 'admin'
          display_name?: string | null
          avatar_url?: string | null
          is_anonymous_on_leaderboards?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          category: 'squat' | 'hinge' | 'push' | 'pull' | 'carry' | 'core' | 'olympic' | 'cardio' | 'other'
          is_global: boolean
          org_id: string | null
          created_at: string
          default_metric: 'weight_reps' | 'time' | 'distance' | 'calories' | 'time_distance' | 'time_calories'
        }
        Insert: {
          id?: string
          name: string
          category: 'squat' | 'hinge' | 'push' | 'pull' | 'carry' | 'core' | 'olympic' | 'cardio' | 'other'
          is_global?: boolean
          org_id?: string | null
          created_at?: string
          default_metric?: 'weight_reps' | 'time' | 'distance' | 'calories' | 'time_distance' | 'time_calories'
        }
        Update: {
          id?: string
          name?: string
          category?: 'squat' | 'hinge' | 'push' | 'pull' | 'carry' | 'core' | 'olympic' | 'cardio' | 'other'
          is_global?: boolean
          org_id?: string | null
          created_at?: string
          default_metric?: 'weight_reps' | 'time' | 'distance' | 'calories' | 'time_distance' | 'time_calories'
        }
      }
      exercise_aliases: {
        Row: {
          id: string
          exercise_id: string
          alias: string
        }
        Insert: {
          id?: string
          exercise_id: string
          alias: string
        }
        Update: {
          id?: string
          exercise_id?: string
          alias?: string
        }
      }
      workout_sessions: {
        Row: {
          id: string
          user_id: string
          org_id: string
          date: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          org_id: string
          date: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          org_id?: string
          date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_exercises: {
        Row: {
          id: string
          session_id: string
          exercise_id: string
          order_index: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          exercise_id: string
          order_index?: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          exercise_id?: string
          order_index?: number
          notes?: string | null
          created_at?: string
        }
      }
      workout_sets: {
        Row: {
          id: string
          workout_exercise_id: string
          set_number: number
          weight: number
          reps: number
          created_at: string
          distance_meters: number | null
          time_seconds: number | null
          calories: number | null
        }
        Insert: {
          id?: string
          workout_exercise_id: string
          set_number: number
          weight?: number
          reps?: number
          created_at?: string
          distance_meters?: number | null
          time_seconds?: number | null
          calories?: number | null
        }
        Update: {
          id?: string
          workout_exercise_id?: string
          set_number?: number
          weight?: number
          reps?: number
          created_at?: string
          distance_meters?: number | null
          time_seconds?: number | null
          calories?: number | null
        }
      }
      community_workouts: {
        Row: {
          id: string
          org_id: string
          author_id: string
          title: string
          description: string
          workout_type: 'amrap' | 'for_time' | 'emom' | 'other'
          time_cap_minutes: number | null
          status: 'pending' | 'approved' | 'rejected'
          is_featured: boolean
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          author_id: string
          title: string
          description: string
          workout_type: 'amrap' | 'for_time' | 'emom' | 'other'
          time_cap_minutes?: number | null
          status?: 'pending' | 'approved' | 'rejected'
          is_featured?: boolean
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          author_id?: string
          title?: string
          description?: string
          workout_type?: 'amrap' | 'for_time' | 'emom' | 'other'
          time_cap_minutes?: number | null
          status?: 'pending' | 'approved' | 'rejected'
          is_featured?: boolean
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_comments: {
        Row: {
          id: string
          workout_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      workout_reactions: {
        Row: {
          id: string
          workout_id: string
          user_id: string
          reaction_type: 'like' | 'fire' | 'strong' | 'respect'
          created_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          user_id: string
          reaction_type: 'like' | 'fire' | 'strong' | 'respect'
          created_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          user_id?: string
          reaction_type?: 'like' | 'fire' | 'strong' | 'respect'
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          org_id: string
          name: string
          description: string | null
          metric: string
          metric_unit: string
          start_date: string
          end_date: string
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
          badge_image_url: string | null
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          description?: string | null
          metric: string
          metric_unit: string
          start_date: string
          end_date: string
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
          badge_image_url?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          description?: string | null
          metric?: string
          metric_unit?: string
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
          badge_image_url?: string | null
        }
      }
      challenge_logs: {
        Row: {
          id: string
          challenge_id: string
          user_id: string
          value: number
          logged_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          challenge_id: string
          user_id: string
          value: number
          logged_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          challenge_id?: string
          user_id?: string
          value?: number
          logged_at?: string
          notes?: string | null
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string
          badge_type: 'challenge_participation' | 'challenge_winner' | 'milestone' | 'special'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon: string
          badge_type: 'challenge_participation' | 'challenge_winner' | 'milestone' | 'special'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string
          badge_type?: 'challenge_participation' | 'challenge_winner' | 'milestone' | 'special'
          created_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          challenge_id: string | null
          awarded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          challenge_id?: string | null
          awarded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          challenge_id?: string | null
          awarded_at?: string
        }
      }
    }
    Functions: {
      get_user_org_id: {
        Args: Record<string, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<string, never>
        Returns: string
      }
      is_coach_or_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      search_exercises: {
        Args: { search_term: string }
        Returns: {
          id: string
          name: string
          category: string
          match_type: string
        }[]
      }
      get_exercise_stats: {
        Args: { p_exercise_id: string; p_user_id?: string }
        Returns: {
          max_weight: number
          estimated_1rm: number
          max_session_volume: number
          total_sets: number
          total_reps: number
          total_volume: number
          first_logged: string
          last_logged: string
          session_count: number
        }[]
      }
      get_exercise_history: {
        Args: { p_exercise_id: string; p_user_id?: string; p_limit?: number }
        Returns: {
          session_id: string
          date: string
          set_count: number
          total_reps: number
          total_volume: number
          best_set_weight: number
          best_set_reps: number
          best_e1rm: number
        }[]
      }
      get_best_performances: {
        Args: { p_exercise_id: string; p_user_id?: string; p_limit?: number }
        Returns: {
          set_id: string
          date: string
          weight: number
          reps: number
          estimated_1rm: number
          volume: number
        }[]
      }
      get_workout_reaction_counts: {
        Args: { p_workout_id: string }
        Returns: {
          reaction_type: string
          count: number
        }[]
      }
      get_user_workout_reactions: {
        Args: { p_workout_id: string }
        Returns: string[]
      }
      get_challenge_leaderboard: {
        Args: { p_challenge_id: string }
        Returns: {
          rank: number
          user_id: string
          display_name: string
          is_anonymous: boolean
          total_value: number
          log_count: number
        }[]
      }
      get_user_challenge_progress: {
        Args: { p_challenge_id: string; p_user_id?: string }
        Returns: {
          total_value: number
          log_count: number
          last_logged: string
          rank: number
        }[]
      }
    }
  }
}

// Convenience types
export type Organization = Database['public']['Tables']['organizations']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type UserRole = Profile['role']

export type Exercise = Database['public']['Tables']['exercises']['Row']
export type ExerciseAlias = Database['public']['Tables']['exercise_aliases']['Row']
export type ExerciseCategory = Exercise['category']

export type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row']
export type WorkoutExercise = Database['public']['Tables']['workout_exercises']['Row']
export type WorkoutSet = Database['public']['Tables']['workout_sets']['Row']

export type CommunityWorkout = Database['public']['Tables']['community_workouts']['Row']
export type WorkoutComment = Database['public']['Tables']['workout_comments']['Row']
export type WorkoutReaction = Database['public']['Tables']['workout_reactions']['Row']
export type WorkoutType = CommunityWorkout['workout_type']

export type Challenge = Database['public']['Tables']['challenges']['Row']
export type ChallengeLog = Database['public']['Tables']['challenge_logs']['Row']
export type Badge = Database['public']['Tables']['badges']['Row']
export type UserBadge = Database['public']['Tables']['user_badges']['Row']

// Form types
export interface WorkoutSetInput {
  id?: string
  weight?: number
  reps?: number
  distance_meters?: number
  time_seconds?: number
  calories?: number
}

export interface WorkoutExerciseInput {
  id?: string
  exercise_id: string
  exercise_name?: string
  default_metric?: string
  sets: WorkoutSetInput[]
}

export interface WorkoutFormData {
  date: string
  notes?: string
  exercises: WorkoutExerciseInput[]
}

export interface CommunityWorkoutFormData {
  title: string
  description: string
  workout_type: WorkoutType
  time_cap_minutes?: number | null
}

export interface ChallengeFormData {
  name: string
  description?: string
  metric: string
  metric_unit: string
  start_date: string
  end_date: string
}

export const EXERCISE_CATEGORIES: { value: ExerciseCategory; label: string }[] = [
  { value: 'squat', label: 'Squat' },
  { value: 'hinge', label: 'Hinge' },
  { value: 'push', label: 'Push' },
  { value: 'pull', label: 'Pull' },
  { value: 'carry', label: 'Carry' },
  { value: 'core', label: 'Core' },
  { value: 'olympic', label: 'Olympic' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'other', label: 'Other' },
]

