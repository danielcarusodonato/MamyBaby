import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Necessário para uso no cliente
})

export interface FoodAnalysisResult {
  alimentos: Array<{
    nome: string
    quantidade_estimada: string
    calorias: number
    proteinas: number
    carboidratos: number
    gorduras: number
    fibras?: number
    vitaminas?: string[]
    minerais?: string[]
  }>
  analise_nutricional: {
    total_calorias: number
    total_proteinas: number
    total_carboidratos: number
    total_gorduras: number
    equilibrio: 'excelente' | 'bom' | 'regular' | 'precisa_melhorar'
  }
  beneficios_bebe: {
    desenvolvimento_cerebral: string[]
    sistema_imunologico: string[]
    crescimento_ossos: string[]
    digestao: string[]
    energia: string[]
  }
  recomendacoes: string[]
  alertas?: string[]
}

export async function analyzeFood(imageBase64: string): Promise<FoodAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é um nutricionista especializado em alimentação infantil e materna. 
          Analise a imagem da refeição e forneça informações nutricionais detalhadas.
          Foque em como cada alimento contribui para o desenvolvimento saudável do bebê.
          Retorne APENAS um JSON válido, sem texto adicional.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analise esta refeição e retorne um JSON com a seguinte estrutura:
              {
                "alimentos": [
                  {
                    "nome": "nome do alimento",
                    "quantidade_estimada": "quantidade aproximada",
                    "calorias": número,
                    "proteinas": número em gramas,
                    "carboidratos": número em gramas,
                    "gorduras": número em gramas,
                    "fibras": número em gramas (opcional),
                    "vitaminas": ["lista de vitaminas principais"],
                    "minerais": ["lista de minerais principais"]
                  }
                ],
                "analise_nutricional": {
                  "total_calorias": soma total,
                  "total_proteinas": soma total,
                  "total_carboidratos": soma total,
                  "total_gorduras": soma total,
                  "equilibrio": "excelente" | "bom" | "regular" | "precisa_melhorar"
                },
                "beneficios_bebe": {
                  "desenvolvimento_cerebral": ["benefícios específicos"],
                  "sistema_imunologico": ["benefícios específicos"],
                  "crescimento_ossos": ["benefícios específicos"],
                  "digestao": ["benefícios específicos"],
                  "energia": ["benefícios específicos"]
                },
                "recomendacoes": ["sugestões para melhorar a refeição"],
                "alertas": ["avisos sobre alergênicos ou cuidados"] (opcional)
              }`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error('Resposta vazia da OpenAI')
    }

    // Remove possíveis marcadores de código markdown
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const result = JSON.parse(cleanContent) as FoodAnalysisResult
    return result
  } catch (error) {
    console.error('Erro ao analisar alimento:', error)
    throw new Error('Não foi possível analisar a imagem. Tente novamente.')
  }
}

export function getEquilibrioColor(equilibrio: string): string {
  switch (equilibrio) {
    case 'excelente':
      return 'text-green-600'
    case 'bom':
      return 'text-blue-600'
    case 'regular':
      return 'text-yellow-600'
    case 'precisa_melhorar':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

export function getEquilibrioLabel(equilibrio: string): string {
  switch (equilibrio) {
    case 'excelente':
      return 'Excelente equilíbrio nutricional! 🌟'
    case 'bom':
      return 'Boa refeição nutritiva! 👍'
    case 'regular':
      return 'Refeição adequada, mas pode melhorar 💡'
    case 'precisa_melhorar':
      return 'Considere adicionar mais nutrientes ⚠️'
    default:
      return 'Análise em andamento...'
  }
}
