// API service for OpenAI interactions
import { mediaItems } from './albumData';
import { isApiKeyConfigured } from './apiConfig';
import { getAuthHeader } from './runtimeConfig';

// Get API key from multiple possible sources
// 1. Check the runtime environment (for production)
// 2. Check the build-time environment variable
const getRuntimeApiKey = () => {
  // For Vercel deployments - get from window.env injected at runtime
  const runtimeKey = (window as any).env?.VITE_OPENAI_API_KEY;
  return runtimeKey || import.meta.env.VITE_OPENAI_API_KEY || '';
};

// Use the runtime API key
const API_KEY = getRuntimeApiKey();

// Enhanced logging for deployment environments
const isProd = import.meta.env.PROD;
console.log(`Environment: ${isProd ? 'Production' : 'Development'}`);
console.log(`OpenAI API Key status: ${API_KEY ? 'Present' : 'Missing'} (${API_KEY.length} chars)`);

// Only log partial key details for security
if (API_KEY) {
  try {
    const firstFour = API_KEY.substring(0, 4);
    const lastFour = API_KEY.substring(API_KEY.length - 4);
    console.log(`API key: ${firstFour}...${lastFour} (${API_KEY.length} chars)`);
  } catch (error) {
    console.log(`Error logging API key details: ${error}`);
  }
}

/**
 * Generate a description for an artifact using OpenAI
 */
export async function generateArtifactDescription(
  existingDescription: string
): Promise<string> {
  try {
    // Don't use OpenAI API for artifact descriptions, return existing description instead
    return existingDescription;
    
    /* Original OpenAI code - disabled
    if (!isApiKeyConfigured()) {
      return existingDescription;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'أنت خبير في التاريخ والآثار المصرية. قم بإنشاء وصف تفصيلي وممتع لقطعة أثرية مصرية باللغة العربية. الوصف يجب أن يكون دقيقاً تاريخياً وجذاباً للزوار.'
          },
          {
            role: 'user',
            content: `عنوان القطعة الأثرية: "${title}". الوصف الحالي: "${existingDescription}". أرجو إنشاء وصف أكثر تفصيلاً وعمقاً.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
    */
  } catch (error) {
    console.error('Error generating description:', error);
    return existingDescription; // Return existing description on error
  }
}

/**
 * Convert voice to text using OpenAI Whisper API
 */
export async function voiceToText(audioBlob: Blob): Promise<string> {
  try {
    if (!isApiKeyConfigured()) {
      console.error('API key not configured properly');
      throw new Error('API key not available');
    }

    console.log('Preparing voice-to-text request...');
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'ar');

    const authHeader = getAuthHeader();
    console.log('Authorization header present:', !!authHeader);
    console.log('Auth header starts with:', authHeader.substring(0, 10) + '...');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': authHeader
      },
      body: formData
    });

    if (!response.ok) {
      console.error(`API error status: ${response.status} (${response.statusText})`);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error converting voice to text:', error);
    return '';
  }
}

/**
 * Generate AI response to a question about an artifact
 */
export async function generateArtifactResponse(
  artifactTitle: string, 
  artifactDescription: string, 
  question: string
): Promise<string> {
  try {
    if (!isApiKeyConfigured()) {
      return 'عذراً، خدمة الذكاء الاصطناعي غير متاحة حالياً. يرجى التحقق من إعدادات التطبيق.';
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'أنت مرشد متحف خبير في الآثار المصرية. أجب عن أسئلة الزوار باللغة العربية بشكل ودود ومعلوماتي.'
          },
          {
            role: 'user',
            content: `معلومات القطعة الأثرية:\nالعنوان: ${artifactTitle}\nالوصف: ${artifactDescription}\n\nسؤال الزائر: ${question}`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    return 'عذراً، لم أتمكن من الإجابة على سؤالك في الوقت الحالي.';
  }
}

/**
 * Add detailed information to all media items
 */
export async function enhanceMediaItems() {
  const enhancedItems = [...mediaItems];
  
  for (const item of enhancedItems) {
    if (!item.details) {
      // Only process items without existing detailed descriptions
      try {
        // Use default description instead of OpenAI
        const defaultDescription = generateDefaultDescription(item.title, item.description, item.type);
        item.description = defaultDescription;
      } catch (error) {
        console.error(`Failed to enhance description for ${item.title}:`, error);
      }
    }
  }
  
  return enhancedItems;
}

/**
 * Generate a default description without using OpenAI
 */
function generateDefaultDescription(title: string, description: string, type: string): string {
  // Different templates based on artifact type
  if (type === '3d') {
    return `هذه قطعة "${title}" تعتبر من القطع الأثرية المصرية البارزة. ${description} وتعكس القطعة براعة الفنان المصري القديم في النحت والتشكيل، وتوضح جوانب مهمة من الحضارة المصرية القديمة.`;
  } else if (type === 'videos') {
    return `فيديو "${title}" يقدم محتوى تعليمي قيم عن تاريخ مصر القديمة. ${description} يتضمن الفيديو شرحًا تفصيليًا ومعلومات تاريخية دقيقة.`;
  } else {
    return `صورة "${title}" تعرض قطعة أثرية نادرة من المتحف. ${description} تظهر الصورة التفاصيل الدقيقة والزخارف المميزة.`;
  }
}

/**
 * Generate text to speech using OpenAI TTS API
 */
export async function textToSpeech(text: string): Promise<ArrayBuffer> {
  try {
    if (!isApiKeyConfigured()) {
      throw new Error('API key not available');
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'alloy',
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw error;
  }
}
