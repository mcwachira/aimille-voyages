export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json
          entity_id: string | null
          entity_type: string
          id: string
          summary: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type: string
          id?: string
          summary?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string
          id?: string
          summary?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          accommodation_requirements: string | null
          adults: number | null
          archived: boolean
          arrival_date: string | null
          assigned_to: string | null
          booking_reference: string
          children: number | null
          created_at: string
          created_by: string | null
          customer_confirmed: boolean
          customer_id: string | null
          departure_date: string | null
          destination: string | null
          enquiry_id: string | null
          id: string
          service_category: string | null
          services: string[]
          status: string
          supplier_confirmation_status: string
          transport_requirements: string | null
          updated_at: string
        }
        Insert: {
          accommodation_requirements?: string | null
          adults?: number | null
          archived?: boolean
          arrival_date?: string | null
          assigned_to?: string | null
          booking_reference?: string
          children?: number | null
          created_at?: string
          created_by?: string | null
          customer_confirmed?: boolean
          customer_id?: string | null
          departure_date?: string | null
          destination?: string | null
          enquiry_id?: string | null
          id?: string
          service_category?: string | null
          services?: string[]
          status?: string
          supplier_confirmation_status?: string
          transport_requirements?: string | null
          updated_at?: string
        }
        Update: {
          accommodation_requirements?: string | null
          adults?: number | null
          archived?: boolean
          arrival_date?: string | null
          assigned_to?: string | null
          booking_reference?: string
          children?: number | null
          created_at?: string
          created_by?: string | null
          customer_confirmed?: boolean
          customer_id?: string | null
          departure_date?: string | null
          destination?: string | null
          enquiry_id?: string | null
          id?: string
          service_category?: string | null
          services?: string[]
          status?: string
          supplier_confirmation_status?: string
          transport_requirements?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          booking_id: string | null
          channel: string
          created_at: string
          customer_id: string | null
          enquiry_id: string | null
          id: string
          last_message_at: string
          status: string
          subject: string | null
          unread: boolean
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          channel?: string
          created_at?: string
          customer_id?: string | null
          enquiry_id?: string | null
          id?: string
          last_message_at?: string
          status?: string
          subject?: string | null
          unread?: boolean
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          channel?: string
          created_at?: string
          customer_id?: string | null
          enquiry_id?: string | null
          id?: string
          last_message_at?: string
          status?: string
          subject?: string | null
          unread?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          company: string | null
          country: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          country?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          adults: number | null
          arrival_date: string | null
          assigned_to: string | null
          budget: string | null
          category: string
          children: number | null
          client_name: string
          company: string | null
          country: string | null
          created_at: string
          currency: string | null
          customer_id: string | null
          dates_flexible: boolean
          departure_date: string | null
          destination: string | null
          details: Json
          email: string
          id: string
          notes: string | null
          phone: string | null
          preferences: string | null
          services: string[]
          source_page: string | null
          status: string
          updated_at: string
        }
        Insert: {
          adults?: number | null
          arrival_date?: string | null
          assigned_to?: string | null
          budget?: string | null
          category: string
          children?: number | null
          client_name: string
          company?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          dates_flexible?: boolean
          departure_date?: string | null
          destination?: string | null
          details?: Json
          email: string
          id?: string
          notes?: string | null
          phone?: string | null
          preferences?: string | null
          services?: string[]
          source_page?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          adults?: number | null
          arrival_date?: string | null
          assigned_to?: string | null
          budget?: string | null
          category?: string
          children?: number | null
          client_name?: string
          company?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          dates_flexible?: boolean
          departure_date?: string | null
          destination?: string | null
          details?: Json
          email?: string
          id?: string
          notes?: string | null
          phone?: string | null
          preferences?: string | null
          services?: string[]
          source_page?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_notes: {
        Row: {
          booking_id: string | null
          created_at: string
          created_by: string | null
          customer_id: string | null
          enquiry_id: string | null
          id: string
          note: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          enquiry_id?: string | null
          id?: string
          note: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          enquiry_id?: string | null
          id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "internal_notes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_notes_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          channel: string
          conversation_id: string
          created_at: string
          customer_id: string | null
          delivery_status: string
          direction: string
          external_message_id: string | null
          id: string
          message_body: string
          sender_type: string
          sent_by: string | null
        }
        Insert: {
          channel: string
          conversation_id: string
          created_at?: string
          customer_id?: string | null
          delivery_status?: string
          direction: string
          external_message_id?: string | null
          id?: string
          message_body: string
          sender_type: string
          sent_by?: string | null
        }
        Update: {
          channel?: string
          conversation_id?: string
          created_at?: string
          customer_id?: string | null
          delivery_status?: string
          direction?: string
          external_message_id?: string | null
          id?: string
          message_body?: string
          sender_type?: string
          sent_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          booking_id: string | null
          channel: string
          created_at: string
          enquiry_id: string | null
          error_message: string | null
          id: string
          recipient: string
          status: string
        }
        Insert: {
          booking_id?: string | null
          channel: string
          created_at?: string
          enquiry_id?: string | null
          error_message?: string | null
          id?: string
          recipient: string
          status: string
        }
        Update: {
          booking_id?: string | null
          channel?: string
          created_at?: string
          enquiry_id?: string | null
          error_message?: string | null
          id?: string
          recipient?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const
