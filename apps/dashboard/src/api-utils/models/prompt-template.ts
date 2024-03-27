import { ChatPromptTemplate } from '@langchain/core/prompts'
import { BrandVoiceType } from '@/database'

type CompletionType = 'generate-brand-voice' | 'generate-product' | 'general'

export const convertTypeCompletionPrompt = (type_of_completion: CompletionType, brandVoices?: BrandVoiceType) => {
  const text = brandVoices ? `
    and also: 
    - ${brandVoices?.description}
    - ${brandVoices?.type}
    - ${brandVoices?.title}
  ` : ''

  const generalPrompt = ChatPromptTemplate.fromTemplate(`Answer the question in a simple sentence based only on the following context:
    {context} ${text}
    
    Question: {question}`)

  const generateProduct = ChatPromptTemplate.fromTemplate(`
      // This template is designed to generate product titles and descriptions based on specific marketing requirements. 
      // It must not be used for any other purpose. If the input does not meet the criteria for generating a product 
      // title and description, the template should automatically respond with a limitation notice.
    
      Given the marketing requirements:
      {context}
    
      This tool is specialized in creating:
      1. A compelling product title, and
      2. A detailed product description not exceeding 300 words.
      
      These outputs should directly align with the provided marketing requirements.
    
      If the request deviates from these specific tasks, such as asking for advice, general information, or any task not related to generating a product title and description based on the given marketing requirements, the template should respond with:
      "Sorry, I can only help with generating a product title and description based on marketing requirements."
    
      Question: Based on the provided marketing requirements, what are a suitable product title and a detailed product description for the question: {question}?
    
      // Ensure this strict adherence to the task at hand to maintain focus and efficiency.
    `)

  const generateBrandVoice = ChatPromptTemplate.fromTemplate(`
      // This template is uniquely designed to synthesize a brand narrative, including:
      // 1. A distinct brand name,
      // 2. The brand type or category,
      // 3. An engaging brand story of 300 words or more,
      // based entirely on comprehensive background research conducted beforehand.
      
      Given the comprehensive background research, this tool is dedicated to extracting and transforming those insights into:
      1. A captivating and original brand name that stands out in the market,
      2. A clear definition of the brand's category, reflecting its place within the industry,
      3. A detailed and compelling brand story that encapsulates the brand’s ethos, mission, and values, tailored to engage the target audience effectively. This story will be informed by the nuances uncovered during the research phase, ensuring it resonates deeply with both existing and potential customers.
      
      The outcome will be a meticulously crafted narrative that not only defines the brand's identity but also serves as a cornerstone for all future marketing and branding efforts.
      
      This process ensures that every piece of the narrative is grounded in researched facts and insights, making the brand not just a name, but a story that lives and breathes the values and aspirations of its target audience.
      
      If the request falls outside the scope of creating a brand narrative based on background research, such as seeking advice unrelated to the insights gathered or requiring information not derived from the research, the template will respond with:
      "Sorry, I can only create a brand name, brand type, and a detailed brand story based on the insights gained from background research."
      
      Given the following context:
      {context}
      
      Question: {question}
      Can you craft a brand narrative that includes a brand name, brand type, and a detailed brand story, all derived from the background research conducted?
  `)

  const product = {
    'generate-product': generateProduct,
    'general': generalPrompt,
    'generate-brand-voice': generateBrandVoice
  } satisfies Record<CompletionType, unknown>

  return product[type_of_completion]
}