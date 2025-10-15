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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string | null
          description: string
          id: string
          shop_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          shop_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          shop_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_details: {
        Row: {
          account_holder: string
          account_number: string
          account_type: string
          bank_name: string
          branch_code: string | null
          created_at: string | null
          id: string
          shop_id: string
        }
        Insert: {
          account_holder: string
          account_number: string
          account_type: string
          bank_name: string
          branch_code?: string | null
          created_at?: string | null
          id?: string
          shop_id: string
        }
        Update: {
          account_holder?: string
          account_number?: string
          account_type?: string
          bank_name?: string
          branch_code?: string | null
          created_at?: string | null
          id?: string
          shop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_details_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: true
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_history: {
        Row: {
          calculated_at: string | null
          factors: Json | null
          id: string
          score: number
          shop_id: string
        }
        Insert: {
          calculated_at?: string | null
          factors?: Json | null
          id?: string
          score: number
          shop_id: string
        }
        Update: {
          calculated_at?: string | null
          factors?: Json | null
          id?: string
          score?: number
          shop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_history_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          expiry_date: string | null
          expiry_reminder_sent: boolean | null
          file_url: string | null
          id: string
          last_reminder_date: string | null
          name: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          shop_id: string
          status: string
          type: string
          uploaded_at: string | null
        }
        Insert: {
          expiry_date?: string | null
          expiry_reminder_sent?: boolean | null
          file_url?: string | null
          id?: string
          last_reminder_date?: string | null
          name: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          shop_id: string
          status?: string
          type: string
          uploaded_at?: string | null
        }
        Update: {
          expiry_date?: string | null
          expiry_reminder_sent?: boolean | null
          file_url?: string | null
          id?: string
          last_reminder_date?: string | null
          name?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          shop_id?: string
          status?: string
          type?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          shop_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          shop_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          shop_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          completed_date: string | null
          created_at: string | null
          id: string
          inspector_id: string | null
          issues: string[] | null
          notes: string | null
          reminder_sent: boolean | null
          report_url: string | null
          scheduled_date: string
          score: number | null
          shop_id: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string | null
          id?: string
          inspector_id?: string | null
          issues?: string[] | null
          notes?: string | null
          reminder_sent?: boolean | null
          report_url?: string | null
          scheduled_date: string
          score?: number | null
          shop_id: string
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string | null
          id?: string
          inspector_id?: string | null
          issues?: string[] | null
          notes?: string | null
          reminder_sent?: boolean | null
          report_url?: string | null
          scheduled_date?: string
          score?: number | null
          shop_id?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspections_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_log: {
        Row: {
          channel: string
          created_at: string | null
          error_message: string | null
          id: string
          notification_id: string | null
          recipient: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          channel: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          notification_id?: string | null
          recipient: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          notification_id?: string | null
          recipient?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_log_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          created_at: string | null
          email_body: string | null
          id: string
          name: string
          sms_body: string | null
          subject: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          email_body?: string | null
          id?: string
          name: string
          sms_body?: string | null
          subject?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          email_body?: string | null
          id?: string
          name?: string
          sms_body?: string | null
          subject?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          shop_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          shop_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          shop_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          full_name: string | null
          id: string
          phone: string | null
          position: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          position?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          shop_id: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          shop_id: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          shop_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          address: string
          business_name: string | null
          compliance_score: number | null
          compliance_status: string | null
          created_at: string | null
          email: string | null
          id: string
          last_compliance_check: string | null
          latitude: number | null
          longitude: number | null
          name: string
          next_inspection_date: string | null
          owner_id: string
          phone: string
          province: string
          registration_number: string | null
          status: string
          trading_hours: Json | null
          updated_at: string | null
        }
        Insert: {
          address: string
          business_name?: string | null
          compliance_score?: number | null
          compliance_status?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_compliance_check?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          next_inspection_date?: string | null
          owner_id: string
          phone: string
          province: string
          registration_number?: string | null
          status?: string
          trading_hours?: Json | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          business_name?: string | null
          compliance_score?: number | null
          compliance_status?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_compliance_check?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          next_inspection_date?: string | null
          owner_id?: string
          phone?: string
          province?: string
          registration_number?: string | null
          status?: string
          trading_hours?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
