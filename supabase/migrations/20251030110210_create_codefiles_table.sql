/*
  # Create codefiles table for code editor

  1. New Tables
    - `codefiles`
      - `id` (uuid, primary key) - Unique identifier for each code file
      - `user_id` (uuid, foreign key to auth.users) - Owner of the code file
      - `file_name` (text) - Name of the saved code file
      - `language` (text) - Programming language (cpp, python, javascript)
      - `code` (text) - The actual code content
      - `created_at` (timestamptz) - When the file was created
      - `updated_at` (timestamptz) - When the file was last modified

  2. Security
    - Enable RLS on `codefiles` table
    - Add policy for authenticated users to read their own code files
    - Add policy for authenticated users to insert their own code files
    - Add policy for authenticated users to update their own code files
    - Add policy for authenticated users to delete their own code files

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on created_at for sorting
*/

-- Create codefiles table
CREATE TABLE IF NOT EXISTS codefiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  language text NOT NULL CHECK (language IN ('cpp', 'python', 'javascript')),
  code text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_codefiles_user_id ON codefiles(user_id);
CREATE INDEX IF NOT EXISTS idx_codefiles_created_at ON codefiles(created_at DESC);

-- Enable Row Level Security
ALTER TABLE codefiles ENABLE ROW LEVEL SECURITY;

-- Create policies for codefiles
CREATE POLICY "Users can view their own code files"
  ON codefiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own code files"
  ON codefiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own code files"
  ON codefiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own code files"
  ON codefiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_codefiles_updated_at
  BEFORE UPDATE ON codefiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();