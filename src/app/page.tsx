"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { 
  Heart, Baby, Moon, Sun, Bell, Camera, TrendingUp, 
  Calendar, BookOpen, Users, Menu, X, Check, Star,
  Clock, Utensils, Activity, Shield, Sparkles, ChevronRight, Scan
} from "lucide-react"
import { PWAInstaller } from "@/components/pwa-installer"

export default function MamyBaby() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("pricing")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      if (!supabase) {
        setCheckingAuth(false)
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push("/dashboard")
      } else {
        setCheckingAuth(false)
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      setCheckingAuth(false)
    }
  }

  if (checkingAuth) {
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
    <>
      <PWAInstaller />
      <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-blue-50/30">
        {/* Header Premium */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-pink-100 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
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
                  <p className="text-xs text-gray-500">Com amor e carinho 💕</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => setActiveTab("features")}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === "features" 
                      ? "text-[#FF7F7F]" 
                      : "text-gray-600 hover:text-[#FF7F7F]"
                  }`}
                >
                  Recursos
                </button>
                <button 
                  onClick={() => setActiveTab("pricing")}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === "pricing" 
                      ? "text-[#FF7F7F]" 
                      : "text-gray-600 hover:text-[#FF7F7F]"
                  }`}
                >
                  Planos
                </button>
                <button 
                  onClick={() => router.push("/auth")}
                  className="px-6 py-2 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Entrar
                </button>
              </nav>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-[#FF7F7F] transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <nav className="md:hidden mt-4 pb-4 space-y-2 border-t border-pink-100 pt-4">
                <button 
                  onClick={() => { setActiveTab("features"); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#FF7F7F] hover:bg-pink-50 rounded-lg transition-colors"
                >
                  Recursos
                </button>
                <button 
                  onClick={() => { setActiveTab("pricing"); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#FF7F7F] hover:bg-pink-50 rounded-lg transition-colors"
                >
                  Planos
                </button>
                <button 
                  onClick={() => router.push("/auth")}
                  className="block w-full text-left px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-lg"
                >
                  Entrar
                </button>
              </nav>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section com Imagens Inspiradoras - SEMPRE VISÍVEL */}
          <div className="mb-16 space-y-8">
            {/* Título Principal */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] bg-clip-text text-transparent">
                Cada momento é único e especial
              </h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
                Acompanhe o desenvolvimento do seu bebê com amor, carinho e tecnologia
              </p>
            </div>

            {/* Grid de Imagens Inspiradoras */}
            <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Imagem 1 - Mãe e Bebê */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=800&fit=crop" 
                  alt="Mãe segurando bebê com amor"
                  className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                  <p className="text-white text-xl font-semibold leading-relaxed">
                    "O amor de mãe é o combustível que permite ao ser humano fazer o impossível"
                  </p>
                </div>
              </div>

              {/* Imagem 2 - Bebê Sorrindo */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=800&fit=crop" 
                  alt="Bebê saudável sorrindo"
                  className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                  <p className="text-white text-xl font-semibold leading-relaxed">
                    "Cada sorriso do seu bebê é uma conquista que merece ser celebrada"
                  </p>
                </div>
              </div>

              {/* Imagem 3 - Scanner de Alimentos */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=800&fit=crop" 
                  alt="Alimentos saudáveis"
                  className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Scan className="w-6 h-6 text-white" />
                      <span className="text-white font-bold text-lg">Scanner de Alimentos</span>
                    </div>
                    <p className="text-white text-lg font-semibold leading-relaxed">
                      "Tire foto e descubra os benefícios nutricionais para seu bebê"
                    </p>
                  </div>
                </div>
              </div>

              {/* Imagem 4 - Família Feliz */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&h=800&fit=crop" 
                  alt="Família feliz com bebê"
                  className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                  <p className="text-white text-xl font-semibold leading-relaxed">
                    "Juntos, criamos memórias que durarão para sempre"
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Principal */}
            <div className="text-center mt-12">
              <button 
                onClick={() => router.push("/auth")}
                className="px-10 py-5 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-full text-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-110 inline-flex items-center gap-3"
              >
                Começar 3 dias grátis
                <ChevronRight className="w-6 h-6" />
              </button>
              <p className="text-gray-600 mt-4 text-sm">
                Sem compromisso • Cancele quando quiser
              </p>
            </div>
          </div>

          {/* Features Tab */}
          {activeTab === "features" && (
            <div className="space-y-12 animate-in fade-in duration-500">
              {/* Hero Section */}
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] bg-clip-text text-transparent">
                  Acompanhe cada momento especial
                </h2>
                <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-8">
                  O app completo para pais modernos que querem registrar e acompanhar 
                  o desenvolvimento do seu bebê com carinho e tecnologia
                </p>
                <button 
                  onClick={() => router.push("/auth")}
                  className="px-8 py-4 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-full text-lg font-medium hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Começar 3 dias grátis
                </button>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#A3C4E0]/20 to-[#A3C4E0]/10 rounded-2xl flex items-center justify-center mb-4">
                    <Moon className="w-7 h-7 text-[#A3C4E0]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Rotina de Sono</h3>
                  <p className="text-gray-600">
                    Registre e acompanhe padrões de sono com gráficos detalhados e alertas inteligentes
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FF7F7F]/20 to-[#FF7F7F]/10 rounded-2xl flex items-center justify-center mb-4">
                    <Utensils className="w-7 h-7 text-[#FF7F7F]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Alimentação</h3>
                  <p className="text-gray-600">
                    Tire fotos dos alimentos e descubra benefícios nutricionais com IA
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400/20 to-purple-400/10 rounded-2xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-7 h-7 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Crescimento</h3>
                  <p className="text-gray-600">
                    Monitore peso, altura e marcos de desenvolvimento do seu bebê
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400/20 to-green-400/10 rounded-2xl flex items-center justify-center mb-4">
                    <Shield className="w-7 h-7 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Vacinas</h3>
                  <p className="text-gray-600">
                    Calendário completo de vacinação com lembretes automáticos
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FF7F7F]/20 to-[#A3C4E0]/10 rounded-2xl flex items-center justify-center mb-4">
                    <BookOpen className="w-7 h-7 text-[#FF7F7F]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Diário do Bebê</h3>
                  <p className="text-gray-600">
                    Registre momentos especiais e conquistas para guardar para sempre
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#A3C4E0]/20 to-[#A3C4E0]/10 rounded-2xl flex items-center justify-center mb-4">
                    <Users className="w-7 h-7 text-[#A3C4E0]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Modo Compartilhado</h3>
                  <p className="text-gray-600">
                    Convide pai, avós e cuidadores para acompanhar juntos
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === "pricing" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] bg-clip-text text-transparent">
                  Escolha seu Plano
                </h2>
                <p className="text-gray-600 text-lg mb-2">
                  Comece com 3 dias grátis e cancele quando quiser
                </p>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF7F7F]/10 to-[#A3C4E0]/10 px-6 py-3 rounded-full border border-pink-200">
                  <Sparkles className="w-5 h-5 text-[#FF7F7F]" />
                  <span className="text-sm font-medium text-gray-700">Sem compromisso • Cancele a qualquer momento</span>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Monthly Plan */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-100 hover:border-[#FF7F7F] transition-all duration-300 hover:scale-105">
                  <div className="text-center mb-6">
                    <div className="inline-flex p-4 bg-gradient-to-br from-[#FF7F7F]/20 to-[#FF7F7F]/10 rounded-2xl mb-4">
                      <Heart className="w-8 h-8 text-[#FF7F7F]" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Mensal</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-gray-800">$25</span>
                      <span className="text-gray-600">/mês</span>
                    </div>
                    <p className="text-sm text-gray-600">Perfeito para começar</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#FF7F7F] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Acesso completo ao app</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#FF7F7F] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Gráficos e relatórios</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#FF7F7F] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Alertas inteligentes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#FF7F7F] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Suporte por email</span>
                    </li>
                  </ul>

                  <button 
                    onClick={() => router.push("/auth")}
                    className="w-full py-4 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Começar 3 dias grátis
                  </button>
                </div>

                {/* 5 Months Plan - Popular */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#FF7F7F] relative hover:scale-105 transition-all duration-300">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <Star className="w-4 h-4 fill-white" />
                      MAIS POPULAR
                    </span>
                  </div>

                  <div className="text-center mb-6 mt-4">
                    <div className="inline-flex p-4 bg-gradient-to-br from-[#FF7F7F] to-[#A3C4E0] rounded-2xl mb-4">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">5 Meses</h3>
                    <div className="mb-2">
                      <span className="text-5xl font-bold text-gray-800">$75</span>
                    </div>
                    <p className="text-sm text-[#FF7F7F] font-bold">Economize $50!</p>
                    <p className="text-sm text-gray-600">Apenas $15/mês</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#FF7F7F] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">Tudo do plano Mensal</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#FF7F7F] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Modo compartilhado</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#FF7F7F] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Backup na nuvem</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#FF7F7F] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Análise de fotos com IA</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#FF7F7F] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Suporte prioritário</span>
                    </li>
                  </ul>

                  <button 
                    onClick={() => router.push("/auth")}
                    className="w-full py-4 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-2xl font-medium hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Começar 3 dias grátis
                  </button>
                </div>

                {/* Annual Plan */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-100 hover:border-[#A3C4E0] transition-all duration-300 hover:scale-105">
                  <div className="text-center mb-6">
                    <div className="inline-flex p-4 bg-gradient-to-br from-[#A3C4E0]/20 to-[#A3C4E0]/10 rounded-2xl mb-4">
                      <Sparkles className="w-8 h-8 text-[#A3C4E0]" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">12 Meses</h3>
                    <div className="mb-2">
                      <span className="text-5xl font-bold text-gray-800">$230</span>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 mb-2">
                      <p className="text-sm font-bold text-green-700">💰 PIX: R$199</p>
                      <p className="text-xs text-green-600">Economize ainda mais!</p>
                    </div>
                    <p className="text-sm text-[#A3C4E0] font-bold">Economize $70!</p>
                    <p className="text-sm text-gray-600">Apenas $19/mês</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#A3C4E0] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">Tudo dos planos anteriores</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#A3C4E0] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Acesso vitalício ao diário</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#A3C4E0] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Relatórios personalizados</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#A3C4E0] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Consultoria com especialistas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#A3C4E0] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Suporte VIP 24/7</span>
                    </li>
                  </ul>

                  <button 
                    onClick={() => router.push("/auth")}
                    className="w-full py-4 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Começar 3 dias grátis
                  </button>
                </div>
              </div>

              {/* Trust Section */}
              <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#FF7F7F]/10 to-[#A3C4E0]/10 rounded-3xl p-8 md:p-12 text-center border border-pink-100">
                <Shield className="w-12 h-12 text-[#FF7F7F] mx-auto mb-6" />
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Sem compromisso. Cancele quando quiser.
                </h3>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
                  Experimente por 3 dias completamente grátis. Se não gostar, cancele sem custo algum. 
                  Seu cartão só será cobrado após o período de teste.
                </p>
                <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-700">
                  <span className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#FF7F7F]" />
                    Sem taxas ocultas
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#FF7F7F]" />
                    Cancele a qualquer momento
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#FF7F7F]" />
                    Dados 100% seguros
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#FF7F7F]" />
                    Suporte dedicado
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-pink-100 mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Baby className="w-6 h-6 text-[#FF7F7F]" />
                <span className="text-xl font-bold bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] bg-clip-text text-transparent">
                  MamyBaby
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Acompanhando cada momento especial com amor e tecnologia 💕
              </p>
              <p className="text-xs text-gray-500">
                © 2024 MamyBaby. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
