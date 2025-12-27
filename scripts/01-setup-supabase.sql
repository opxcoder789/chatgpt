-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  api_key TEXT,
  haptic_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create chats table
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New Chat',
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES public.chats ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'model')),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Chats Policies
CREATE POLICY "Users can view their own chats" ON public.chats
  FOR SELECT USING (auth.uid() = user_id OR is_shared = TRUE);
CREATE POLICY "Users can insert their own chats" ON public.chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chats" ON public.chats
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own chats" ON public.chats
  FOR DELETE USING (auth.uid() = user_id);

-- Messages Policies
CREATE POLICY "Users can view messages of accessible chats" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chats 
      WHERE chats.id = messages.chat_id 
      AND (chats.user_id = auth.uid() OR chats.is_shared = TRUE)
    )
  );
CREATE POLICY "Users can insert messages to their chats" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = auth.uid()
    )
  );
