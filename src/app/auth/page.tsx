"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Baby, Mail, Lock, User, Heart, AlertCircle } from "lucide-react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Digite seu email para reenviar a confirmação")
      return
    }

    if (!supabase) {
      setError("Supabase não configurado")
      return
    }

    setLoading(true)
    setError("")
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })
      
      if (error) throw error
      
      setSuccess("Email de confirmação reenviado! Verifique sua caixa de entrada.")
      setNeedsEmailConfirmation(false)
    } catch (err: any) {
      setError(err.message || "Erro ao reenviar email de confirmação")
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    setNeedsEmailConfirmation(false)

    // Validação do cliente Supabase
    if (!supabase) {
      setError("Erro: Supabase não configurado. Configure suas credenciais.")
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        if (data.user && data.session) {
          setSuccess("Login realizado com sucesso! Redirecionando...")
          // Redirecionamento imediato e forçado
          window.location.href = "/dashboard"
        }
      } else {
        // Cadastro
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        
        if (error) throw error
        
        if (data.user) {
          // Verificar se precisa confirmar email
          if (data.user.identities && data.user.identities.length === 0) {
            setError("Este email já está cadastrado. Faça login.")
            setLoading(false)
            return
          }

          // Criar perfil do usuário
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                nome: name,
                email: email,
              }
            ])
          
          if (profileError) {
            console.error('Erro ao criar perfil:', profileError)
          }
          
          // Verificar se o email foi confirmado automaticamente
          if (data.session) {
            setSuccess("Conta criada com sucesso! Redirecionando...")
            // Redirecionamento imediato e forçado
            window.location.href = "/dashboard"
          } else {
            setSuccess("Conta criada! Verifique seu email para confirmar o cadastro.")
            setNeedsEmailConfirmation(true)
          }
        }
      }
    } catch (err: any) {
      console.error('Erro de autenticação:', err)
      
      // Mensagens de erro mais amigáveis
      if (err.message.includes('Invalid login credentials')) {
        setError("Email ou senha incorretos. Tente novamente.")
      } else if (err.message.includes('User already registered')) {
        setError("Este email já está cadastrado. Faça login.")
      } else if (err.message.includes('Email not confirmed')) {
        setError("Seu email ainda não foi confirmado.")
        setNeedsEmailConfirmation(true)
      } else if (err.message.includes('Email link is invalid or has expired')) {
        setError("Link de confirmação expirado. Solicite um novo.")
        setNeedsEmailConfirmation(true)
      } else {
        setError(err.message || "Erro ao processar sua solicitação")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-blue-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7F7F] to-[#A3C4E0] rounded-2xl blur-md opacity-50"></div>
              <div className="relative bg-gradient-to-br from-[#FF7F7F] to-[#A3C4E0] p-3 rounded-2xl">
                <Baby className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] bg-clip-text text-transparent">
              MamyBaby
            </h1>
          </div>
          <p className="text-gray-600">
            {isLogin ? "Bem-vinda de volta!" : "Comece sua jornada conosco"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-pink-100">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsLogin(true)
                setError("")
                setSuccess("")
                setNeedsEmailConfirmation(false)
              }}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${
                isLogin
                  ? "bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError("")
                setSuccess("")
                setNeedsEmailConfirmation(false)
              }}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${
                !isLogin
                  ? "bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7F7F] focus:border-transparent transition-all"
                    placeholder="Seu nome"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7F7F] focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7F7F] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo de 6 caracteres
                </p>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-xl text-sm bg-red-50 text-red-700 border border-red-200 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p>{error}</p>
                  {needsEmailConfirmation && (
                    <button
                      type="button"
                      onClick={handleResendConfirmation}
                      className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 underline"
                    >
                      Reenviar email de confirmação
                    </button>
                  )}
                </div>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl text-sm bg-green-50 text-green-700 border border-green-200">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Processando..." : isLogin ? "Entrar" : "Criar Conta"}
            </button>
          </form>

          {isLogin && (
            <div className="mt-4 text-center">
              <button 
                type="button"
                onClick={async () => {
                  if (!email) {
                    setError("Digite seu email para recuperar a senha")
                    return
                  }
                  
                  if (!supabase) {
                    setError("Supabase não configurado")
                    return
                  }
                  
                  setLoading(true)
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/reset-password`,
                  })
                  setLoading(false)
                  
                  if (error) {
                    setError(error.message)
                  } else {
                    setSuccess("Email de recuperação enviado! Verifique sua caixa de entrada.")
                  }
                }}
                className="text-sm text-gray-600 hover:text-[#FF7F7F] transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>
          )}
        </div>

        {/* Trust Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <Heart className="w-4 h-4 text-[#FF7F7F]" />
            <span>Seus dados estão seguros conosco</span>
          </div>
        </div>

        {/* Informação sobre confirmação de email */}
        {!isLogin && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-700 text-center">
              💡 Após criar sua conta, você receberá um email de confirmação. Verifique sua caixa de entrada e spam.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
