import { GoogleGenAI } from '@google/genai';

export interface ChatRequestData {
  message: string;
  letter: string;
  letterName: string;
  childName?: string;
  conversation?: Array<{ role: 'user' | 'assistant' | 'teacher'; content: string }>;
}

export async function handleTeacherChat(data: ChatRequestData): Promise<{ reply: string; source: string }> {
  const { message, letter, letterName, childName = 'ساجدة', conversation = [] } = data;

  const apiKey = process.env.GEMINI_API_KEY || '';
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `أنت "الأستاذ AI" المعلم والمربي الذكي المحبوب في برنامج "مغامرات ${childName}".
أنت تُعلم طفلة ذكية اسمها "${childName}" في الصف الأول الابتدائي / مرحلة التأسيس.
أسلوبك:
1. تحدث بلهجة مصرية مبسطة ودافئة ومرحة ممزوجة بالفصحى الواضحة المناسبة لطفلة صغيرة.
2. ردودك قصيرة جداً (جملة أو جملتان بحد أقصى) ومباشرة ومشجعة جداً.
3. استخدم كلمات تشجيعية مثل: "يا ساجدة يا بطلة!", "شاطرة جداً يا قمر!", "ما شاء الله عليكي!", "فكرة ممتازة!".
4. الدرس الحالي: حرف ${letter} (${letterName}).
5. إذا سألتك ساجدة عن شيء أو أجابت إجابة صحيحة، امدحها بحرارة ثم اسألها سؤالاً جديداً خفيفاً وسهلاً عن حرف ${letter}.
6. إذا أخطأت أو قالت "لا أعرف"، لا توبخها بل أعطها تلميحاً لطيفاً ومضحكاً يساعدها تكتشف الإجابة بنفسها.
7. لا تتحدث بنصوص طويلة أبداً.`;

      const historyText = conversation
        .slice(-6)
        .map((c) => `${c.role === 'user' ? childName : 'الأستاذ AI'}: ${c.content}`)
        .join('\n');

      const prompt = `${historyText ? historyText + '\n' : ''}${childName}: ${message}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text?.trim();
      if (reply) {
        return { reply, source: 'gemini' };
      }
    } catch (err) {
      console.warn('Gemini chat warning, switching to teacher fallback:', err);
    }
  }

  // Friendly educational fallback
  const clean = message.trim();
  if (clean.includes('لا أعرف') || clean.includes('مش عارفه') || clean.includes('معرفش') || clean.includes('ساعدني')) {
    return {
      reply: `ولا يهمك يا ${childName} يا بطلة! هديكي فزورة صغيرة: حاجة تبدأ بحرف ${letter}، يا ترى إيه هي؟ فكري معايا! 💡`,
      source: 'fallback',
    };
  }

  if (clean.includes('مرحبا') || clean.includes('أهلا') || clean.includes('سلام') || clean.includes('ازيك')) {
    return {
      reply: `أهلاً وسهلاً يا ${childName} يا قمر! جاهزة لمغامرة حرف ${letter} (${letterName}) النهاردة؟ 🚀`,
      source: 'fallback',
    };
  }

  return {
    reply: `أحسنتِ يا ${childName} يا شطورة! إجابة ممتازة جداً! تعرفي تقوليلي كلمة تانية فيها حرف ${letter}؟ ⭐`,
    source: 'fallback',
  };
}
