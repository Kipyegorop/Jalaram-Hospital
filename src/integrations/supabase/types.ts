export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          doctor_id: string
          id: string
          patient_email: string
          patient_name: string
          patient_phone: string
          reason: string | null
          status: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          doctor_id: string
          id?: string
          patient_email: string
          patient_name: string
          patient_phone: string
          reason?: string | null
          status?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          doctor_id?: string
          id?: string
          patient_email?: string
          patient_name?: string
          patient_phone?: string
          reason?: string | null
          status?: string | null
        }
      }
      availability: {
        Row: {
          created_at: string
          day_of_week: number
          doctor_id: string
          end_time: string
          id: string
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          doctor_id: string
          end_time: string
          id?: string
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          doctor_id?: string
          end_time?: string
          id?: string
          start_time?: string
        }
      }
      doctors: {
        Row: {
          contact_details: string | null
          created_at: string
          department: string
          email: string
          experience: string | null
          id: string
          is_profile_complete: boolean | null
          name: string
          specialization: string | null
        }
        Insert: {
          contact_details?: string | null
          created_at?: string
          department: string
          email: string
          experience?: string | null
          id?: string
          is_profile_complete?: boolean | null
          name: string
          specialization?: string | null
        }
        Update: {
          contact_details?: string | null
          created_at?: string
          department?: string
          email?: string
          experience?: string | null
          id?: string
          is_profile_complete?: boolean | null
          name?: string
          specialization?: string | null
        }
      }
    }
  }
}