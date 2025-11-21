"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { 
  Heart, Baby, Moon, Bell, Camera, TrendingUp, 
  Calendar, BookOpen, Users, Menu, X, Check,
  Clock, Utensils, Activity, Shield, Sparkles, ChevronRight,
  LogOut, Plus, Edit, Scan
} from "lucide-react"

type Baby = {
  id: string
  nome: string
  data_nascimento: string
  foto_url?: string
}

type SleepRecord = {
  id: string
  data: string
  hora_inicio: string
  hora_fim?: string
  duracao_minutos?: number
  qualidade?: string
}

type FeedingRecord = {
  id: string
  data: string
  hora: string
  tipo?: string
  quantidade?: string
  observacoes?: string
}

type GrowthRecord = {
  id: string
  data: string
  peso?: number
  altura?: number
}

type DiaryEntry = {
  id: string
  data: string
  titulo: string
  conteudo?: string
  tipo?: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const [baby, setBaby] = useState<Baby | null>(null)
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([])
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>([])
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([])
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])

  // Estados para modais de adicionar
  const [showAddBaby, setShowAddBaby] = useState(false)
  const [showAddFeeding, setShowAddFeeding] = useState(false)
  const [showAddSleep, setShowAddSleep] = useState(false)
  const [showAddDiary, setShowAddDiary] = useState(false)

  // Estados para formulários
  const [babyForm, setBabyForm] = useState({ nome: "", data_nascimento: "" })
  const [feedingForm, setFeedingForm] = useState({ tipo: "breast", quantidade: "", observacoes: "" })
  const [sleepForm, setSleepForm] = useState({ hora_inicio: "", hora_fim: "", qualidade: "boa" })
  const [diaryForm, setDiaryForm] = useState({ titulo: "", conteudo: "", tipo: "momento" })

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user && baby) {
      loadData()
    }
  }, [user, baby])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth")
      return
    }
    setUser(user)
    await loadBaby(user.id)
    setLoading(false)
  }

  const loadBaby = async (userId: string) => {
    const { data, error } = await supabase
      .from('bebes')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (data) {
      setBaby(data)
    }
  }

  const loadData = async () => {
    if (!baby) return

    // Load sleep records
    const { data: sleepData } = await supabase
      .from('sono')
      .select('*')
      .eq('bebe_id', baby.id)
      .order('data', { ascending: false })
      .limit(10)
    if (sleepData) setSleepRecords(sleepData)

    // Load feeding records
    const { data: feedingData } = await supabase
      .from('refeicoes')
      .select('*')
      .eq('bebe_id', baby.id)
      .order('data', { ascending: false })
      .limit(10)
    if (feedingData) setFeedingRecords(feedingData)

    // Load growth records
    const { data: growthData } = await supabase
      .from('crescimento')
      .select('*')
      .eq('bebe_id', baby.id)
      .order('data', { ascending: false })
      .limit(5)
    if (growthData) setGrowthRecords(growthData)

    // Load diary entries
    const { data: diaryData } = await supabase
      .from('diario')
      .select('*')
      .eq('bebe_id', baby.id)
      .order('data', { ascending: false })
      .limit(10)
    if (diaryData) setDiaryEntries(diaryData)
  }

  const handleAddBaby = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const { data, error } = await supabase
      .from('bebes')
      .insert([{
        user_id: user.id,
        nome: babyForm.nome,
        data_nascimento: babyForm.data_nascimento
      }])
      .select()
      .single()

    if (data) {
      setBaby(data)
      setShowAddBaby(false)
      setBabyForm({ nome: "", data_nascimento: "" })
    }
  }

  const handleAddFeeding = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!baby) return

    const now = new Date()
    const { error } = await supabase
      .from('refeicoes')
      .insert([{
        bebe_id: baby.id,
        data: now.toISOString().split('T')[0],
        hora: now.toTimeString().split(' ')[0],
        tipo: feedingForm.tipo,
        quantidade: feedingForm.quantidade,
        observacoes: feedingForm.observacoes
      }])

    if (!error) {
      setShowAddFeeding(false)
      setFeedingForm({ tipo: "breast", quantidade: "", observacoes: "" })
      loadData()
    }
  }

  const handleAddSleep = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!baby) return

    const today = new Date().toISOString().split('T')[0]
    const { error } = await supabase
      .from('sono')
      .insert([{
        bebe_id: baby.id,
        data: today,
        hora_inicio: sleepForm.hora_inicio,
        hora_fim: sleepForm.hora_fim,
        qualidade: sleepForm.qualidade
      }])

    if (!error) {
      setShowAddSleep(false)
      setSleepForm({ hora_inicio: "", hora_fim: "", qualidade: "boa" })
      loadData()
    }
  }

  const handleAddDiary = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!baby) return

    const today = new Date().toISOString().split('T')[0]
    const { error } = await supabase
      .from('diario')
      .insert([{
        bebe_id: baby.id,
        data: today,
        titulo: diaryForm.titulo,
        conteudo: diaryForm.conteudo,
        tipo: diaryForm.tipo
      }])

    if (!error) {
      setShowAddDiary(false)
      setDiaryForm({ titulo: "", conteudo: "", tipo: "momento" })
      loadData()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  const calculateTodaySleep = () => {
    const today = new Date().toISOString().split('T')[0]
    const todaySleep = sleepRecords.filter(record => 
      record.data === today && record.duracao_minutos
    )
    const totalMinutes = todaySleep.reduce((sum, record) => sum + (record.duracao_minutos || 0), 0)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}min`
  }

  const calculateTodayFeedings = () => {
    const today = new Date().toISOString().split('T')[0]
    return feedingRecords.filter(record => record.data === today).length
  }

  const getLatestWeight = () => {
    return growthRecords[0]?.peso || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-6 bg-gradient-to-br from-[#FF7F7F] to-[#A3C4E0] rounded-3xl mb-4 animate-pulse">
            <Baby className="w-12 h-12 text-white" />
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-pink-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF7F7F] to-[#A3C4E0] rounded-2xl blur-md opacity-50"></div>
                <div className="relative bg-gradient-to-br from-[#FF7F7F] to-[#A3C4E0] p-2 rounded-2xl">
                  <Baby className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] bg-clip-text text-transparent">
                  MamyBaby
                </h1>
                <p className="text-xs text-gray-500">{baby?.nome || "Seu bebê"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#FF7F7F] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-[#FF7F7F] transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-2 border-t border-pink-100 pt-4">
              <button 
                onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#FF7F7F] hover:bg-pink-50 rounded-lg transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Sair
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!baby ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-pink-100 text-center">
              <Baby className="w-16 h-16 text-[#FF7F7F] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Adicione seu bebê
              </h2>
              <p className="text-gray-600 mb-6">
                Comece registrando as informações do seu bebê
              </p>
              <button 
                onClick={() => setShowAddBaby(true)}
                className="px-8 py-3 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Adicionar Bebê
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
                Olá, {user?.user_metadata?.name || "Mamãe"}!
              </h2>
              <p className="text-gray-600">Acompanhe o dia do {baby.nome}</p>
            </div>

            {/* Food Scanner Button - DESTAQUE */}
            <div className="bg-gradient-to-br from-[#FF7F7F] to-[#A3C4E0] rounded-3xl p-6 shadow-xl border-2 border-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Scan className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Análise de Alimentos
                    </h3>
                    <p className="text-white/90 text-sm">
                      Tire foto da refeição e veja os benefícios
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/food-scanner')}
                  className="px-6 py-3 bg-white text-[#FF7F7F] rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Abrir
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-[#A3C4E0]/20 to-[#A3C4E0]/10 rounded-2xl">
                    <Moon className="w-6 h-6 text-[#A3C4E0]" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Hoje</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{calculateTodaySleep()}</h3>
                <p className="text-sm text-gray-600">Tempo de sono</p>
              </div>

              <div className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-[#FF7F7F]/20 to-[#FF7F7F]/10 rounded-2xl">
                    <Utensils className="w-6 h-6 text-[#FF7F7F]" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Hoje</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{calculateTodayFeedings()} refeições</h3>
                <p className="text-sm text-gray-600">Alimentação</p>
              </div>

              <div className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-400/20 to-purple-400/10 rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Atual</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{getLatestWeight()} kg</h3>
                <p className="text-sm text-gray-600">Peso</p>
              </div>
            </div>

            {/* Recent Feedings */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Refeições Recentes</h3>
                <button 
                  onClick={() => setShowAddFeeding(true)}
                  className="p-2 hover:bg-pink-50 rounded-full transition-colors"
                >
                  <Plus className="w-5 h-5 text-[#FF7F7F]" />
                </button>
              </div>
              <div className="space-y-3">
                {feedingRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#FF7F7F] to-[#A3C4E0] rounded-full flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {record.tipo === 'breast' ? 'Amamentação' : record.tipo === 'bottle' ? 'Mamadeira' : 'Sólido'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {record.hora}
                        </p>
                      </div>
                    </div>
                    {record.quantidade && (
                      <span className="text-sm font-medium text-gray-600">{record.quantidade}</span>
                    )}
                  </div>
                ))}
                {feedingRecords.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Nenhuma refeição registrada hoje</p>
                )}
              </div>
            </div>

            {/* Diary Entries */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Diário</h3>
                <button 
                  onClick={() => setShowAddDiary(true)}
                  className="p-2 hover:bg-pink-50 rounded-full transition-colors"
                >
                  <Plus className="w-5 h-5 text-[#FF7F7F]" />
                </button>
              </div>
              <div className="space-y-3">
                {diaryEntries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="p-4 bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 mb-1">{entry.titulo}</h4>
                        {entry.conteudo && (
                          <p className="text-sm text-gray-600">{entry.conteudo}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(entry.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {diaryEntries.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Nenhuma memória registrada ainda</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Add Baby */}
      {showAddBaby && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Adicionar Bebê</h3>
            <form onSubmit={handleAddBaby} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={babyForm.nome}
                  onChange={(e) => setBabyForm({...babyForm, nome: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7F7F]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                <input
                  type="date"
                  value={babyForm.data_nascimento}
                  onChange={(e) => setBabyForm({...babyForm, data_nascimento: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7F7F]"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddBaby(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-xl font-medium"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Feeding */}
      {showAddFeeding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Adicionar Refeição</h3>
            <form onSubmit={handleAddFeeding} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={feedingForm.tipo}
                  onChange={(e) => setFeedingForm({...feedingForm, tipo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7F7F]"
                >
                  <option value="breast">Amamentação</option>
                  <option value="bottle">Mamadeira</option>
                  <option value="solid">Sólido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
                <input
                  type="text"
                  value={feedingForm.quantidade}
                  onChange={(e) => setFeedingForm({...feedingForm, quantidade: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7F7F]"
                  placeholder="Ex: 150ml, 1 pote"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  value={feedingForm.observacoes}
                  onChange={(e) => setFeedingForm({...feedingForm, observacoes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7F7F]"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddFeeding(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-xl font-medium"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Diary */}
      {showAddDiary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Nova Memória</h3>
            <form onSubmit={handleAddDiary} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={diaryForm.titulo}
                  onChange={(e) => setDiaryForm({...diaryForm, titulo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7F7F]"
                  placeholder="Ex: Primeira palavra"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={diaryForm.conteudo}
                  onChange={(e) => setDiaryForm({...diaryForm, conteudo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7F7F]"
                  rows={4}
                  placeholder="Conte sobre esse momento especial..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddDiary(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-xl font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
