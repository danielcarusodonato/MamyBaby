"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { analyzeFood, FoodAnalysisResult, getEquilibrioColor, getEquilibrioLabel } from "@/lib/openai"
import { 
  Camera, ArrowLeft, Loader2, CheckCircle, AlertCircle,
  Utensils, TrendingUp, Heart, Brain, Shield, Zap, Baby
} from "lucide-react"

export default function FoodScanner() {
  const router = useRouter()
  const [analyzing, setAnalyzing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<FoodAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraActive, setCameraActive] = useState(false)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error('Erro ao acessar câmera:', err)
      setError('Não foi possível acessar a câmera')
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      setCameraActive(false)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg')
        setCapturedImage(imageData)
        stopCamera()
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCapturedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!capturedImage) return

    setAnalyzing(true)
    setError(null)

    try {
      // Remove o prefixo data:image/jpeg;base64,
      const base64Image = capturedImage.split(',')[1]
      const result = await analyzeFood(base64Image)
      setAnalysis(result)
    } catch (err: any) {
      setError(err.message || 'Erro ao analisar imagem')
    } finally {
      setAnalyzing(false)
    }
  }

  const resetScanner = () => {
    setCapturedImage(null)
    setAnalysis(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-pink-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-pink-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Análise de Alimentos</h1>
              <p className="text-sm text-gray-600">Tire uma foto da refeição</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!capturedImage && !cameraActive && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-pink-100 text-center">
              <div className="inline-flex p-6 bg-gradient-to-br from-[#FF7F7F] to-[#A3C4E0] rounded-3xl mb-6">
                <Camera className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Reconhecimento de Alimentos
              </h2>
              <p className="text-gray-600 mb-8">
                Tire uma foto da refeição e descubra informações nutricionais detalhadas
                e como cada alimento beneficia o desenvolvimento do seu bebê.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={startCamera}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Camera className="w-5 h-5" />
                  Abrir Câmera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#FF7F7F] text-[#FF7F7F] rounded-full font-medium hover:bg-pink-50 transition-all duration-300"
                >
                  <Utensils className="w-5 h-5" />
                  Escolher Foto
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Benefícios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                <Brain className="w-8 h-8 text-purple-500 mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">Desenvolvimento Cerebral</h3>
                <p className="text-sm text-gray-600">
                  Identifica nutrientes essenciais para o cérebro do bebê
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                <Shield className="w-8 h-8 text-blue-500 mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">Sistema Imunológico</h3>
                <p className="text-sm text-gray-600">
                  Mostra como fortalecer as defesas naturais
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">Crescimento Saudável</h3>
                <p className="text-sm text-gray-600">
                  Analisa nutrientes para ossos e músculos fortes
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                <Zap className="w-8 h-8 text-yellow-500 mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">Energia e Vitalidade</h3>
                <p className="text-sm text-gray-600">
                  Avalia fontes de energia para o dia a dia
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Câmera Ativa */}
        {cameraActive && (
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-2xl mb-4"
            />
            <div className="flex gap-4">
              <button
                onClick={capturePhoto}
                className="flex-1 py-4 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-full font-medium hover:shadow-lg transition-all"
              >
                Capturar Foto
              </button>
              <button
                onClick={stopCamera}
                className="px-6 py-4 border-2 border-gray-300 text-gray-600 rounded-full font-medium hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Imagem Capturada */}
        {capturedImage && !analysis && (
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
            <img
              src={capturedImage}
              alt="Refeição capturada"
              className="w-full rounded-2xl mb-4"
            />
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex gap-4">
              <button
                onClick={analyzeImage}
                disabled={analyzing}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Analisar Refeição
                  </>
                )}
              </button>
              <button
                onClick={resetScanner}
                disabled={analyzing}
                className="px-6 py-4 border-2 border-gray-300 text-gray-600 rounded-full font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Nova Foto
              </button>
            </div>
          </div>
        )}

        {/* Resultados da Análise */}
        {analysis && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Imagem Analisada */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
              <img
                src={capturedImage!}
                alt="Refeição analisada"
                className="w-full rounded-2xl mb-4"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="font-medium text-gray-800">Análise Completa</span>
                </div>
                <button
                  onClick={resetScanner}
                  className="px-4 py-2 text-sm text-[#FF7F7F] hover:bg-pink-50 rounded-full transition-colors"
                >
                  Nova Análise
                </button>
              </div>
            </div>

            {/* Equilíbrio Nutricional */}
            <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-3xl p-6 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Equilíbrio Nutricional</h3>
              <div className="bg-white rounded-2xl p-6">
                <p className={`text-2xl font-bold mb-4 ${getEquilibrioColor(analysis.analise_nutricional.equilibrio)}`}>
                  {getEquilibrioLabel(analysis.analise_nutricional.equilibrio)}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Calorias</p>
                    <p className="text-2xl font-bold text-gray-800">{analysis.analise_nutricional.total_calorias}</p>
                    <p className="text-xs text-gray-500">kcal</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Proteínas</p>
                    <p className="text-2xl font-bold text-gray-800">{analysis.analise_nutricional.total_proteinas}g</p>
                    <p className="text-xs text-gray-500">gramas</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Carboidratos</p>
                    <p className="text-2xl font-bold text-gray-800">{analysis.analise_nutricional.total_carboidratos}g</p>
                    <p className="text-xs text-gray-500">gramas</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Gorduras</p>
                    <p className="text-2xl font-bold text-gray-800">{analysis.analise_nutricional.total_gorduras}g</p>
                    <p className="text-xs text-gray-500">gramas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alimentos Identificados */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Alimentos Identificados</h3>
              <div className="space-y-4">
                {analysis.alimentos.map((alimento, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">{alimento.nome}</h4>
                        <p className="text-sm text-gray-600">{alimento.quantidade_estimada}</p>
                      </div>
                      <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">
                        {alimento.calorias} kcal
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-xs text-gray-600">Proteínas</p>
                        <p className="font-bold text-gray-800">{alimento.proteinas}g</p>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-xs text-gray-600">Carboidratos</p>
                        <p className="font-bold text-gray-800">{alimento.carboidratos}g</p>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-xs text-gray-600">Gorduras</p>
                        <p className="font-bold text-gray-800">{alimento.gorduras}g</p>
                      </div>
                    </div>
                    {alimento.vitaminas && alimento.vitaminas.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-600 mb-2">Vitaminas e Minerais:</p>
                        <div className="flex flex-wrap gap-2">
                          {[...alimento.vitaminas, ...(alimento.minerais || [])].map((nutriente, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                              {nutriente}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Benefícios para o Bebê */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-6 shadow-lg border border-pink-100">
              <div className="flex items-center gap-3 mb-6">
                <Baby className="w-8 h-8 text-[#FF7F7F]" />
                <h3 className="text-xl font-bold text-gray-800">Benefícios para o Bebê</h3>
              </div>
              <div className="space-y-4">
                {analysis.beneficios_bebe.desenvolvimento_cerebral.length > 0 && (
                  <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-purple-500" />
                      <h4 className="font-bold text-gray-800">Desenvolvimento Cerebral</h4>
                    </div>
                    <ul className="space-y-1">
                      {analysis.beneficios_bebe.desenvolvimento_cerebral.map((beneficio, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.beneficios_bebe.sistema_imunologico.length > 0 && (
                  <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-500" />
                      <h4 className="font-bold text-gray-800">Sistema Imunológico</h4>
                    </div>
                    <ul className="space-y-1">
                      {analysis.beneficios_bebe.sistema_imunologico.map((beneficio, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.beneficios_bebe.crescimento_ossos.length > 0 && (
                  <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <h4 className="font-bold text-gray-800">Crescimento e Ossos</h4>
                    </div>
                    <ul className="space-y-1">
                      {analysis.beneficios_bebe.crescimento_ossos.map((beneficio, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.beneficios_bebe.energia.length > 0 && (
                  <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <h4 className="font-bold text-gray-800">Energia e Vitalidade</h4>
                    </div>
                    <ul className="space-y-1">
                      {analysis.beneficios_bebe.energia.map((beneficio, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-yellow-500 mt-1">•</span>
                          <span>{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Recomendações */}
            {analysis.recomendacoes.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-6 h-6 text-[#FF7F7F]" />
                  <h3 className="text-xl font-bold text-gray-800">Recomendações</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.recomendacoes.map((recomendacao, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{recomendacao}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Alertas */}
            {analysis.alertas && analysis.alertas.length > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-6 shadow-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-gray-800">Alertas Importantes</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.alertas.map((alerta, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl">
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{alerta}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Botão Voltar */}
            <button
              onClick={() => router.push('/')}
              className="w-full py-4 bg-gradient-to-r from-[#FF7F7F] to-[#A3C4E0] text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Voltar ao Início
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
