
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDoctorAuth = () => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: doctorData, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Error",
            description: "You are not authorized as a doctor.",
          });
          return;
        }

        if (doctorData && !doctorData.is_profile_complete) {
          setShowProfileForm(true);
        } else if (doctorData && doctorData.is_profile_complete) {
          navigate('/doctor-dashboard');
        }
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: doctorData, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Error",
            description: "You are not authorized as a doctor.",
          });
          return;
        }

        if (doctorData && !doctorData.is_profile_complete) {
          setShowProfileForm(true);
        } else if (doctorData && doctorData.is_profile_complete) {
          navigate('/doctor-dashboard');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return { showProfileForm, setShowProfileForm };
};
