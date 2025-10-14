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
      agents: {
        Row: {
          agent: string | null
          id: number
          prompt: string | null
        }
        Insert: {
          agent?: string | null
          id?: number
          prompt?: string | null
        }
        Update: {
          agent?: string | null
          id?: number
          prompt?: string | null
        }
        Relationships: []
      }
      calc_activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calc_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "calc_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calc_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calc_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      calc_role_permissions: {
        Row: {
          category: string
          created_at: string | null
          id: string
          permission_level: Database["public"]["Enums"]["permission_level"]
          permission_name: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          permission_level?: Database["public"]["Enums"]["permission_level"]
          permission_name: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          permission_level?: Database["public"]["Enums"]["permission_level"]
          permission_name?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      calc_user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_roles__profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "calc_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_roles__profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_roles_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "calc_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_roles_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_profiles_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "calc_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_profiles_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calculator_data: {
        Row: {
          addons: Json | null
          complexidade: string | null
          created_at: string
          custo_consulta_primeira_vez: number | null
          custo_consulta_retorno: number | null
          custo_consulta_simples: number | null
          custo_instalacao: number | null
          custo_mensalidade: number | null
          duracao_meses: number | null
          entregaveis_comerciais: Json | null
          fonte_consulta_primeira_vez: number | null
          fonte_consulta_retorno: number | null
          fonte_consulta_simples: number | null
          fonte_instalacao: number | null
          fonte_mensalidade: number | null
          id: string
          num_consultas_mes: number | null
          num_profissionais: number | null
          percentual_primeira_vez: number | null
          percentual_retorno: number | null
          preco_consulta_primeira_vez: number | null
          preco_consulta_retorno: number | null
          preco_consulta_simples: number | null
          preco_instalacao: number | null
          preco_mensalidade: number | null
          project_id: string
          updated_at: string
        }
        Insert: {
          addons?: Json | null
          complexidade?: string | null
          created_at?: string
          custo_consulta_primeira_vez?: number | null
          custo_consulta_retorno?: number | null
          custo_consulta_simples?: number | null
          custo_instalacao?: number | null
          custo_mensalidade?: number | null
          duracao_meses?: number | null
          entregaveis_comerciais?: Json | null
          fonte_consulta_primeira_vez?: number | null
          fonte_consulta_retorno?: number | null
          fonte_consulta_simples?: number | null
          fonte_instalacao?: number | null
          fonte_mensalidade?: number | null
          id?: string
          num_consultas_mes?: number | null
          num_profissionais?: number | null
          percentual_primeira_vez?: number | null
          percentual_retorno?: number | null
          preco_consulta_primeira_vez?: number | null
          preco_consulta_retorno?: number | null
          preco_consulta_simples?: number | null
          preco_instalacao?: number | null
          preco_mensalidade?: number | null
          project_id: string
          updated_at?: string
        }
        Update: {
          addons?: Json | null
          complexidade?: string | null
          created_at?: string
          custo_consulta_primeira_vez?: number | null
          custo_consulta_retorno?: number | null
          custo_consulta_simples?: number | null
          custo_instalacao?: number | null
          custo_mensalidade?: number | null
          duracao_meses?: number | null
          entregaveis_comerciais?: Json | null
          fonte_consulta_primeira_vez?: number | null
          fonte_consulta_retorno?: number | null
          fonte_consulta_simples?: number | null
          fonte_instalacao?: number | null
          fonte_mensalidade?: number | null
          id?: string
          num_consultas_mes?: number | null
          num_profissionais?: number | null
          percentual_primeira_vez?: number | null
          percentual_retorno?: number | null
          preco_consulta_primeira_vez?: number | null
          preco_consulta_retorno?: number | null
          preco_consulta_simples?: number | null
          preco_instalacao?: number | null
          preco_mensalidade?: number | null
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculator_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      Canal: {
        Row: {
          canal: string | null
          id: number
        }
        Insert: {
          canal?: string | null
          id?: number
        }
        Update: {
          canal?: string | null
          id?: number
        }
        Relationships: []
      }
      canal_keywords: {
        Row: {
          canal: string | null
          created_at: string
          id: number
          keyword: string | null
        }
        Insert: {
          canal?: string | null
          created_at?: string
          id?: number
          keyword?: string | null
        }
        Update: {
          canal?: string | null
          created_at?: string
          id?: number
          keyword?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canal_keywords_canal_fkey"
            columns: ["canal"]
            isOneToOne: false
            referencedRelation: "Canal"
            referencedColumns: ["canal"]
          },
        ]
      }
      canal_topics: {
        Row: {
          canal: string | null
          contact_id: string | null
          created_at: string
          id: number
          nome: string | null
          theme: string | null
          topic: string | null
        }
        Insert: {
          canal?: string | null
          contact_id?: string | null
          created_at?: string
          id?: number
          nome?: string | null
          theme?: string | null
          topic?: string | null
        }
        Update: {
          canal?: string | null
          contact_id?: string | null
          created_at?: string
          id?: number
          nome?: string | null
          theme?: string | null
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canal_topics_canal_fkey"
            columns: ["canal"]
            isOneToOne: false
            referencedRelation: "Canal"
            referencedColumns: ["canal"]
          },
        ]
      }
      carrinho_dashboard: {
        Row: {
          acao_tomada: string | null
          created_at: string | null
          id_carrinho: number | null
          id_evento: number
          metodo_pagamento: string | null
          nome: string | null
          numero: number | null
          tipo_evento: string | null
          total: number | null
          url: string | null
        }
        Insert: {
          acao_tomada?: string | null
          created_at?: string | null
          id_carrinho?: number | null
          id_evento: number
          metodo_pagamento?: string | null
          nome?: string | null
          numero?: number | null
          tipo_evento?: string | null
          total?: number | null
          url?: string | null
        }
        Update: {
          acao_tomada?: string | null
          created_at?: string | null
          id_carrinho?: number | null
          id_evento?: number
          metodo_pagamento?: string | null
          nome?: string | null
          numero?: number | null
          tipo_evento?: string | null
          total?: number | null
          url?: string | null
        }
        Relationships: []
      }
      chamada_dinamica: {
        Row: {
          id: number
          id_fk: number | null
          keywords: Json | null
          nome: string | null
          table: string | null
        }
        Insert: {
          id?: number
          id_fk?: number | null
          keywords?: Json | null
          nome?: string | null
          table?: string | null
        }
        Update: {
          id?: number
          id_fk?: number | null
          keywords?: Json | null
          nome?: string | null
          table?: string | null
        }
        Relationships: []
      }
      collabs: {
        Row: {
          created_at: string
          descricao_produto: string | null
          id: number
          instrucao: string | null
          link_produto: string | null
          mensagem_ia: string | null
          nome_produto: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao_produto?: string | null
          id?: number
          instrucao?: string | null
          link_produto?: string | null
          mensagem_ia?: string | null
          nome_produto: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao_produto?: string | null
          id?: number
          instrucao?: string | null
          link_produto?: string | null
          mensagem_ia?: string | null
          nome_produto?: string
          updated_at?: string
        }
        Relationships: []
      }
      consol_orders_snaps: {
        Row: {
          before_purchase_date: string | null
          created_at: string
          customer_id: number
          customer_visit_created_at: string | null
          desconto_price: number
          email: string | null
          endereco_bairro: string | null
          endereco_cep: string | null
          endereco_cidade: string | null
          endereco_pais: string | null
          endereco_uf: string | null
          entrega: string | null
          first_purchase_date: string | null
          installment_preference_medium_counter: number | null
          loja: string
          lt_avg_ticket: number | null
          lt_order_counter: number | null
          lt_product_counter: Json | null
          ltv_price_counter: number | null
          moment_visit_date: string | null
          nome: string | null
          order_id: string
          order_placed_at: string | null
          parcelas: number | null
          parentesco: string | null
          parentesco_padrao: string | null
          produtos: Json | null
          status: string | null
          subtotal_price: number
          telefone: string | null
          tipo_pagamento: Database["public"]["Enums"]["payment_type"]
          total_paid_price: number
          utm_campaign_source: string | null
          utm_parameters: Json | null
          utm_visit_source: string | null
          visit_landing_page: string | null
        }
        Insert: {
          before_purchase_date?: string | null
          created_at?: string
          customer_id: number
          customer_visit_created_at?: string | null
          desconto_price: number
          email?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_pais?: string | null
          endereco_uf?: string | null
          entrega?: string | null
          first_purchase_date?: string | null
          installment_preference_medium_counter?: number | null
          loja: string
          lt_avg_ticket?: number | null
          lt_order_counter?: number | null
          lt_product_counter?: Json | null
          ltv_price_counter?: number | null
          moment_visit_date?: string | null
          nome?: string | null
          order_id: string
          order_placed_at?: string | null
          parcelas?: number | null
          parentesco?: string | null
          parentesco_padrao?: string | null
          produtos?: Json | null
          status?: string | null
          subtotal_price: number
          telefone?: string | null
          tipo_pagamento: Database["public"]["Enums"]["payment_type"]
          total_paid_price: number
          utm_campaign_source?: string | null
          utm_parameters?: Json | null
          utm_visit_source?: string | null
          visit_landing_page?: string | null
        }
        Update: {
          before_purchase_date?: string | null
          created_at?: string
          customer_id?: number
          customer_visit_created_at?: string | null
          desconto_price?: number
          email?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_pais?: string | null
          endereco_uf?: string | null
          entrega?: string | null
          first_purchase_date?: string | null
          installment_preference_medium_counter?: number | null
          loja?: string
          lt_avg_ticket?: number | null
          lt_order_counter?: number | null
          lt_product_counter?: Json | null
          ltv_price_counter?: number | null
          moment_visit_date?: string | null
          nome?: string | null
          order_id?: string
          order_placed_at?: string | null
          parcelas?: number | null
          parentesco?: string | null
          parentesco_padrao?: string | null
          produtos?: Json | null
          status?: string | null
          subtotal_price?: number
          telefone?: string | null
          tipo_pagamento?: Database["public"]["Enums"]["payment_type"]
          total_paid_price?: number
          utm_campaign_source?: string | null
          utm_parameters?: Json | null
          utm_visit_source?: string | null
          visit_landing_page?: string | null
        }
        Relationships: []
      }
      conversa_bot: {
        Row: {
          arquivo: string | null
          created_at: string
          id: number
          mensagem: string | null
          produto_escolhido: string | null
          session_id: string
          status: number | null
        }
        Insert: {
          arquivo?: string | null
          created_at?: string
          id?: number
          mensagem?: string | null
          produto_escolhido?: string | null
          session_id: string
          status?: number | null
        }
        Update: {
          arquivo?: string | null
          created_at?: string
          id?: number
          mensagem?: string | null
          produto_escolhido?: string | null
          session_id?: string
          status?: number | null
        }
        Relationships: []
      }
      conversa_ia: {
        Row: {
          contact_id: string | null
          created_at: string
          id: number
          imagem_reference: string | null
          joia_reference: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          id?: number
          imagem_reference?: string | null
          joia_reference?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          id?: number
          imagem_reference?: string | null
          joia_reference?: string | null
        }
        Relationships: []
      }
      Cupons: {
        Row: {
          cupom: string
          desconto: number | null
          fim: string | null
          id: number
          inicio: string | null
          Regras: string | null
          tipo: string | null
        }
        Insert: {
          cupom: string
          desconto?: number | null
          fim?: string | null
          id?: number
          inicio?: string | null
          Regras?: string | null
          tipo?: string | null
        }
        Update: {
          cupom?: string
          desconto?: number | null
          fim?: string | null
          id?: number
          inicio?: string | null
          Regras?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      customer_orders_metrics: {
        Row: {
          actual_purchase_date: string | null
          anterior_purchase_data: string | null
          average_order_value: number | null
          customer_id: number
          first_purchase_date: string | null
          horario_pagamento: string | null
          id: number
          lt_product_counter: Json | null
          ltv_counter: number | null
          media_parcelas: number | null
          order_counter: number | null
          ultima_atualizacao_banco_de_dados: string | null
          visit_date: string | null
          visit_source: string | null
        }
        Insert: {
          actual_purchase_date?: string | null
          anterior_purchase_data?: string | null
          average_order_value?: number | null
          customer_id: number
          first_purchase_date?: string | null
          horario_pagamento?: string | null
          id?: number
          lt_product_counter?: Json | null
          ltv_counter?: number | null
          media_parcelas?: number | null
          order_counter?: number | null
          ultima_atualizacao_banco_de_dados?: string | null
          visit_date?: string | null
          visit_source?: string | null
        }
        Update: {
          actual_purchase_date?: string | null
          anterior_purchase_data?: string | null
          average_order_value?: number | null
          customer_id?: number
          first_purchase_date?: string | null
          horario_pagamento?: string | null
          id?: number
          lt_product_counter?: Json | null
          ltv_counter?: number | null
          media_parcelas?: number | null
          order_counter?: number | null
          ultima_atualizacao_banco_de_dados?: string | null
          visit_date?: string | null
          visit_source?: string | null
        }
        Relationships: []
      }
      dashboard_permissions: {
        Row: {
          created_at: string | null
          dashboard_id: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          dashboard_id: string
          id?: string
          role: string
        }
        Update: {
          created_at?: string | null
          dashboard_id?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      data_access_audit: {
        Row: {
          accessed_at: string | null
          additional_info: Json | null
          id: string
          ip_address: unknown | null
          operation: string
          query_hash: string | null
          row_count: number | null
          table_name: string
          user_agent: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          accessed_at?: string | null
          additional_info?: Json | null
          id?: string
          ip_address?: unknown | null
          operation: string
          query_hash?: string | null
          row_count?: number | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          accessed_at?: string | null
          additional_info?: Json | null
          id?: string
          ip_address?: unknown | null
          operation?: string
          query_hash?: string | null
          row_count?: number | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      feature_permissions: {
        Row: {
          created_at: string
          feature_id: string
          feature_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          feature_id: string
          feature_name: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          feature_id?: string
          feature_name?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      ordens_consolidada: {
        Row: {
          desconto: string | null
          email: string | null
          endereco: string | null
          endereco_bairro: string | null
          endereco_cep: string | null
          endereco_cidade: string | null
          endereco_estado: string | null
          endereco_numero: string | null
          endereco_pais: string | null
          endereco_tipo: string | null
          entrega: Json | null
          horario_pedido: string | null
          id: number
          loja: string | null
          nome: string | null
          parcelas: string | null
          produtos: Json | null
          status: string | null
          subtotal: string | null
          telefone: string | null
          tipo_pagamento: string | null
          tipo_pessoa: string | null
          total: string | null
        }
        Insert: {
          desconto?: string | null
          email?: string | null
          endereco?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_estado?: string | null
          endereco_numero?: string | null
          endereco_pais?: string | null
          endereco_tipo?: string | null
          entrega?: Json | null
          horario_pedido?: string | null
          id?: number
          loja?: string | null
          nome?: string | null
          parcelas?: string | null
          produtos?: Json | null
          status?: string | null
          subtotal?: string | null
          telefone?: string | null
          tipo_pagamento?: string | null
          tipo_pessoa?: string | null
          total?: string | null
        }
        Update: {
          desconto?: string | null
          email?: string | null
          endereco?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_estado?: string | null
          endereco_numero?: string | null
          endereco_pais?: string | null
          endereco_tipo?: string | null
          entrega?: Json | null
          horario_pedido?: string | null
          id?: number
          loja?: string | null
          nome?: string | null
          parcelas?: string | null
          produtos?: Json | null
          status?: string | null
          subtotal?: string | null
          telefone?: string | null
          tipo_pagamento?: string | null
          tipo_pessoa?: string | null
          total?: string | null
        }
        Relationships: []
      }
      personagens: {
        Row: {
          created_at: string
          descricao_personagem: string | null
          id: number
          nome_personagem: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao_personagem?: string | null
          id?: number
          nome_personagem: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao_personagem?: string | null
          id?: number
          nome_personagem?: string
          updated_at?: string
        }
        Relationships: []
      }
      produtos_joalheria: {
        Row: {
          image_url: string | null
          name: string | null
          product_url: string | null
          source_listing: string | null
        }
        Insert: {
          image_url?: string | null
          name?: string | null
          product_url?: string | null
          source_listing?: string | null
        }
        Update: {
          image_url?: string | null
          name?: string | null
          product_url?: string | null
          source_listing?: string | null
        }
        Relationships: []
      }
      produtos_rag: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      produtos_turmatube: {
        Row: {
          criado_em: string | null
          descricao: string | null
          id: number | null
          preco: number | null
          preco_promocional: number | null
          produto: string | null
          qtd: number | null
          sku: string | null
          tamanho: string | null
          ultima_atualização: string | null
          Url: string | null
        }
        Insert: {
          criado_em?: string | null
          descricao?: string | null
          id?: number | null
          preco?: number | null
          preco_promocional?: number | null
          produto?: string | null
          qtd?: number | null
          sku?: string | null
          tamanho?: string | null
          ultima_atualização?: string | null
          Url?: string | null
        }
        Update: {
          criado_em?: string | null
          descricao?: string | null
          id?: number | null
          preco?: number | null
          preco_promocional?: number | null
          produto?: string | null
          qtd?: number | null
          sku?: string | null
          tamanho?: string | null
          ultima_atualização?: string | null
          Url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_name: string | null
          created_at: string
          description: string | null
          id: string
          last_accessed_at: string
          name: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_accessed_at?: string
          name: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_accessed_at?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      proximos_lancamentos: {
        Row: {
          created_at: string
          data_lancamento: string | null
          descricao_produto: string | null
          id: number
          mensagem_ia: string | null
          nome_produto: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_lancamento?: string | null
          descricao_produto?: string | null
          id?: number
          mensagem_ia?: string | null
          nome_produto: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_lancamento?: string | null
          descricao_produto?: string | null
          id?: number
          mensagem_ia?: string | null
          nome_produto?: string
          updated_at?: string
        }
        Relationships: []
      }
      roupas_live: {
        Row: {
          blusa: string | null
          calca: string | null
          created_at: string
          data_live: string | null
          id: number
          link_blusa: string | null
          link_calca: string | null
          link_sapatos: string | null
          nome: string
          processo: string | null
          produtos: Json | null
          sapatos: string | null
          updated_at: string
        }
        Insert: {
          blusa?: string | null
          calca?: string | null
          created_at?: string
          data_live?: string | null
          id?: number
          link_blusa?: string | null
          link_calca?: string | null
          link_sapatos?: string | null
          nome: string
          processo?: string | null
          produtos?: Json | null
          sapatos?: string | null
          updated_at?: string
        }
        Update: {
          blusa?: string | null
          calca?: string | null
          created_at?: string
          data_live?: string | null
          id?: number
          link_blusa?: string | null
          link_calca?: string | null
          link_sapatos?: string | null
          nome?: string
          processo?: string | null
          produtos?: Json | null
          sapatos?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      shows: {
        Row: {
          atualizacao: string
          cidade: string | null
          data: string | null
          endereco: string | null
          estado: string | null
          id: number
        }
        Insert: {
          atualizacao?: string
          cidade?: string | null
          data?: string | null
          endereco?: string | null
          estado?: string | null
          id?: number
        }
        Update: {
          atualizacao?: string
          cidade?: string | null
          data?: string | null
          endereco?: string | null
          estado?: string | null
          id?: number
        }
        Relationships: []
      }
      status_bot: {
        Row: {
          mensagem_padrao: string | null
          status: number
        }
        Insert: {
          mensagem_padrao?: string | null
          status?: number
        }
        Update: {
          mensagem_padrao?: string | null
          status?: number
        }
        Relationships: []
      }
      temas_conversas: {
        Row: {
          created_at: string
          descricao: string | null
          id: number
          nome: string
          topico: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: never
          nome: string
          topico?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: never
          nome?: string
          topico?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ticket_obj: {
        Row: {
          canal: string | null
          certeza_ia: boolean | null
          contact_id: string | null
          contato: string | null
          conversa_historico: Json[] | null
          created_at: string
          data_encerramento_consolidado: string | null
          fim_atendente: string | null
          fim_cliente: string | null
          fim_ia: string | null
          horario_abertura: string | null
          horario_encerramento: string | null
          horario_transferencia: string | null
          id: number
          inicio_atendimento: string | null
          inicio_cliente: string | null
          inicio_ia: string | null
          nome: string | null
          "palavras-chave_conversa": Json[] | null
          service_id: string | null
          tem_transferencia: boolean
          tema: string | null
          ticket_id: string | null
          topico: string | null
        }
        Insert: {
          canal?: string | null
          certeza_ia?: boolean | null
          contact_id?: string | null
          contato?: string | null
          conversa_historico?: Json[] | null
          created_at?: string
          data_encerramento_consolidado?: string | null
          fim_atendente?: string | null
          fim_cliente?: string | null
          fim_ia?: string | null
          horario_abertura?: string | null
          horario_encerramento?: string | null
          horario_transferencia?: string | null
          id?: number
          inicio_atendimento?: string | null
          inicio_cliente?: string | null
          inicio_ia?: string | null
          nome?: string | null
          "palavras-chave_conversa"?: Json[] | null
          service_id?: string | null
          tem_transferencia?: boolean
          tema?: string | null
          ticket_id?: string | null
          topico?: string | null
        }
        Update: {
          canal?: string | null
          certeza_ia?: boolean | null
          contact_id?: string | null
          contato?: string | null
          conversa_historico?: Json[] | null
          created_at?: string
          data_encerramento_consolidado?: string | null
          fim_atendente?: string | null
          fim_cliente?: string | null
          fim_ia?: string | null
          horario_abertura?: string | null
          horario_encerramento?: string | null
          horario_transferencia?: string | null
          id?: number
          inicio_atendimento?: string | null
          inicio_cliente?: string | null
          inicio_ia?: string | null
          nome?: string | null
          "palavras-chave_conversa"?: Json[] | null
          service_id?: string | null
          tem_transferencia?: boolean
          tema?: string | null
          ticket_id?: string | null
          topico?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      activity_logs: {
        Row: {
          action: string | null
          created_at: string | null
          details: Json | null
          id: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calc_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "calc_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calc_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dev_users: {
        Row: {
          user_id: string | null
        }
        Insert: {
          user_id?: string | null
        }
        Update: {
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_roles__profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "calc_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_roles__profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_roles_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "calc_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_roles_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_profiles_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "calc_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_profiles_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          category: string | null
          created_at: string | null
          id: string | null
          permission_level:
            | Database["public"]["Enums"]["permission_level"]
            | null
          permission_name: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string | null
          permission_level?:
            | Database["public"]["Enums"]["permission_level"]
            | null
          permission_name?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string | null
          permission_level?:
            | Database["public"]["Enums"]["permission_level"]
            | null
          permission_name?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_roles__profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "calc_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_roles__profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_roles_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "calc_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_roles_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_profiles_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "calc_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_profiles_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_snap_consol_orders_produtos: {
        Row: {
          mes: string | null
          order_id: string | null
          produto_nome: string | null
          sku: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _detect_parentesco_from_text: {
        Args: { txt: string }
        Returns: string
      }
      check_bulk_access_pattern: {
        Args: {
          threshold_count?: number
          time_window_minutes?: number
          user_check_id?: string
        }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_keywords_for_product: {
        Args: { product_id: number; table_name: string }
        Returns: {
          keywords: Json
        }[]
      }
      get_masked_order_data: {
        Args: { limit_rows?: number; offset_rows?: number }
        Returns: {
          before_purchase_date: string
          created_at: string
          customer_id: number
          customer_visit_created_at: string
          desconto_price: number
          email: string
          endereco_bairro: string
          endereco_cep: string
          endereco_cidade: string
          endereco_pais: string
          endereco_uf: string
          entrega: string
          first_purchase_date: string
          installment_preference_medium_counter: number
          loja: string
          lt_avg_ticket: number
          lt_order_counter: number
          lt_product_counter: Json
          ltv_price_counter: number
          moment_visit_date: string
          nome: string
          order_id: string
          order_placed_at: string
          parcelas: number
          produtos: Json
          status: string
          subtotal_price: number
          telefone: string
          tipo_pagamento: string
          total_paid_price: number
          utm_campaign_source: string
          utm_parameters: Json
          utm_visit_source: string
          visit_landing_page: string
        }[]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_dev_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_dev: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_dev_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_sensitive_select: {
        Args: { query_info?: Json; row_count?: number; table_name: string }
        Returns: undefined
      }
      mask_sensitive_data: {
        Args: { mask_char?: string; original_text: string }
        Returns: string
      }
      match_products: {
        Args:
          | { filter?: Json; match_count?: number; query_embedding?: string }
          | { match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
      user_has_feature_access: {
        Args: { _feature_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "basic"
        | "viewer"
        | "dev"
        | "gestor"
        | "comercial"
        | "usuario"
      order_status:
        | "open"
        | "paid"
        | "cancelled"
        | "refunded"
        | "delivered"
        | "shipping"
        | "other"
      payment_type:
        | "pix"
        | "boleto"
        | "credit_card"
        | "debit_card"
        | "cash"
        | "other"
      permission_level: "none" | "view" | "edit"
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
    Enums: {
      app_role: [
        "admin",
        "basic",
        "viewer",
        "dev",
        "gestor",
        "comercial",
        "usuario",
      ],
      order_status: [
        "open",
        "paid",
        "cancelled",
        "refunded",
        "delivered",
        "shipping",
        "other",
      ],
      payment_type: [
        "pix",
        "boleto",
        "credit_card",
        "debit_card",
        "cash",
        "other",
      ],
      permission_level: ["none", "view", "edit"],
    },
  },
} as const
