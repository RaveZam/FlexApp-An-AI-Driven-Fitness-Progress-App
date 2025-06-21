import supabase from "@/scripts/SupabaseClient";

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
};
