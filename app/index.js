import { useEffect } from "react";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function IndexPage() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/(tabs)/");
      } else {
        console.log("No active session");
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/(tabs)/");
      } else {
        router.replace("/(auth)/login");
      }
    });
  }, []);
}
