import { createClient } from '@supabase/supabase-js'

// Configuração com valores padrão para evitar erros
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Cria cliente apenas se as credenciais estiverem disponíveis
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Tipos atualizados para corresponder ao banco de dados real
export type Database = {
  bebes: {
    id: string
    user_id: string
    nome: string
    data_nascimento: string
    sexo?: string
    peso_nascimento?: number
    altura_nascimento?: number
    foto_url?: string
    created_at: string
    updated_at: string
  }
  sono: {
    id: string
    bebe_id: string
    data: string
    hora_inicio: string
    hora_fim?: string
    duracao_minutos?: number
    qualidade?: string
    observacoes?: string
    created_at: string
  }
  refeicoes: {
    id: string
    bebe_id: string
    data: string
    hora: string
    tipo?: string
    alimento_id?: string
    quantidade?: string
    observacoes?: string
    created_at: string
  }
  crescimento: {
    id: string
    bebe_id: string
    data: string
    peso?: number
    altura?: number
    perimetro_cefalico?: number
    observacoes?: string
    created_at: string
  }
  diario: {
    id: string
    bebe_id: string
    data: string
    titulo: string
    conteudo?: string
    tipo?: string
    fotos?: string[]
    created_at: string
  }
  vacinas: {
    id: string
    bebe_id: string
    nome: string
    data_aplicacao: string
    dose?: string
    proxima_dose?: string
    local_aplicacao?: string
    lote?: string
    observacoes?: string
    created_at: string
  }
  alimentos: {
    id: string
    nome: string
    categoria: string
    idade_minima_meses: number
    descricao?: string
    beneficios?: string
    alergenos?: string[]
    created_at: string
  }
  receitas: {
    id: string
    titulo: string
    ingredientes: string[]
    modo_preparo: string
    tempo_preparo?: number
    idade_minima_meses: number
    categoria?: string
    foto_url?: string
    created_at: string
  }
  dicas: {
    id: string
    titulo: string
    conteudo: string
    categoria: string
    autor?: string
    curtidas?: number
    created_at: string
  }
  profiles: {
    id: string
    nome?: string
    email?: string
    avatar_url?: string
    created_at: string
    updated_at: string
  }
}
