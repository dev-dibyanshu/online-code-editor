import { supabase, CodeFile } from '../lib/supabase';

export const saveCodeFile = async (
  fileName: string,
  language: 'cpp' | 'python' | 'javascript',
  code: string
): Promise<{ data: CodeFile | null; error: any }> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('User not authenticated') };
  }

  const { data: existingFile } = await supabase
    .from('codefiles')
    .select('id')
    .eq('user_id', user.id)
    .eq('file_name', fileName)
    .maybeSingle();

  if (existingFile) {
    const { data, error } = await supabase
      .from('codefiles')
      .update({ code, language, updated_at: new Date().toISOString() })
      .eq('id', existingFile.id)
      .select()
      .single();

    return { data, error };
  }

  const { data, error } = await supabase
    .from('codefiles')
    .insert([
      {
        user_id: user.id,
        file_name: fileName,
        language,
        code,
      },
    ])
    .select()
    .single();

  return { data, error };
};

export const getCodeFiles = async (): Promise<{ data: CodeFile[] | null; error: any }> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('User not authenticated') };
  }

  const { data, error } = await supabase
    .from('codefiles')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return { data, error };
};

export const getCodeFileById = async (id: string): Promise<{ data: CodeFile | null; error: any }> => {
  const { data, error } = await supabase
    .from('codefiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  return { data, error };
};

export const deleteCodeFile = async (id: string): Promise<{ error: any }> => {
  const { error } = await supabase.from('codefiles').delete().eq('id', id);

  return { error };
};
