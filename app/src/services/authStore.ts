import { create } from 'zustand';
import { Session, User as AuthUser } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { User } from '../types/database';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isOnboardingComplete: boolean;

  initialize: () => Promise<void>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<{ error: Error | null }>;
  completeOnboarding: (data: {
    language: string;
    motivation: string;
    daily_goal_minutes: number;
    reading_obstacles: string[];
    reading_reason: string;
    notifications_enabled: boolean;
    preferred_genre?: string;
    custom_preference?: string;
  }) => Promise<{ error: Error | null }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  isLoading: true,
  isOnboardingComplete: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session });

      if (session?.user) {
        await get().fetchUser();
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        set({ session });
        if (session?.user) {
          await get().fetchUser();
        } else {
          set({ user: null, isOnboardingComplete: false });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, password, username) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username: username || email.split('@')[0] }
        }
      });

      if (error) throw error;

      // Attendre que la session soit établie
      if (data.session) {
        set({ session: data.session });
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  signIn: async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isOnboardingComplete: false });
  },

  fetchUser: async () => {
    const { session } = get();
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      set({
        user: data,
        isOnboardingComplete: data?.onboarding_completed || false
      });
    } catch (error) {
      console.error('Fetch user error:', error);
    }
  },

  updateUser: async (updates) => {
    const { session } = get();
    if (!session?.user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', session.user.id);

      if (error) throw error;

      await get().fetchUser();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  completeOnboarding: async (data) => {
    try {
      // Récupérer la session actuelle
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        return { error: new Error('Not authenticated') };
      }

      // Vérifier si l'utilisateur existe dans la table users
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', session.user.id)
        .single();

      // Si l'utilisateur n'existe pas, le créer
      if (fetchError || !existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: session.user.id,
            email: session.user.email!,
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
            ...data,
            onboarding_completed: true,
          });

        if (insertError) throw insertError;
      } else {
        // Sinon, mettre à jour l'utilisateur existant
        const { error: updateError } = await supabase
          .from('users')
          .update({
            ...data,
            onboarding_completed: true,
          })
          .eq('id', session.user.id);

        if (updateError) throw updateError;
      }

      // Mettre à jour le store
      set({ session, isOnboardingComplete: true });
      await get().fetchUser();
      return { error: null };
    } catch (error) {
      console.error('Complete onboarding error:', error);
      return { error: error as Error };
    }
  },
}));
