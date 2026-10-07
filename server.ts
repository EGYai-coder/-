import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

interface ChatRequestBody {
  message: string;
  letter: string;
  letterName: string;
  childName?: string;
  conversation?: Array<{ role: 'user' | 'assistant' | 'teacher'; content: string }>;
}

app.post('/api/chat', async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  try {
    const { message, letter, letterName, childName = 'ساجدة', conversation = [] } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const systemInstruction = `أنت "الأستاذ AI" المعلم والمربي الذكي المحبوب في برنامج "مغامرات ${childName}".
أنت تُعلم طفلة ذكية اسمها "${childName}" في الصف الأول الابتدائي / مرحلة التأسيس.
أسلوبك:
1. تحدث بلهجة مصرية مبسطة ودافئة ومرحة ممزوجة بالفصحى الواضحة المناسبة لطفلة صغيرة.
2. ردودك قصيرة جداً (جملة أو جملتان بحد أقصى) ومباشرة ومشجعة جداً.
3. استخدم كلمات تشجيعية مثل: "يا ساجدة يا بطلة!", "شاطرة جداً يا حبيبتي!", "ما شاء الله عليكي!", "فكرة ممتازة!".
4. الدرس الحالي: حرف ${letter} (${letterName}).
5. إذا سألتك ساجدة عن شيء أو أجابت إجابة صحيحة، امدحها بحرارة ثم اسألها سؤالاً جديداً خفيفاً وسهلاً عن حرف ${letter}.
6. إذا أخطأت أو قالت "لا أعرف"، لا توبخها أبداً بل أعطها تلميحاً لطيفاً ومضحكاً يساعدها تكتشف الإجابة بنفسها.
7. لا تتحدث بنصوص طويلة أبداً، فالأطفال يفضلون التفاعل السريع والكلمات البسيطة.`;

    if (ai) {
      try {
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

        const reply = response.text?.trim() || `أحسنتِ يا ${childName}! أنتِ شاطرة جداً في حرف ${letter}!`;
        res.json({ reply, source: 'gemini' });
        return;
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to smart teacher engine:', geminiError);
      }
    }

    // Built-in educational fallback generator
    const fallbackReply = generateEducationalReply(message, letter, letterName, childName);
    res.json({ reply: fallbackReply, source: 'fallback' });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      reply: 'يا ساجدة يا عسل، أنا سامعك بس كنت بشرب عصير تفاح! قوليلي تاني؟ 🍎',
      source: 'error_fallback',
    });
  }
});

function generateEducationalReply(msg: string, letter: string, letterName: string, childName: string): string {
  const clean = msg.trim().toLowerCase();
  
  if (clean.includes('لا أعرف') || clean.includes('مش عارفه') || clean.includes('معرفش') || clean.includes('ساعدني')) {
    return `ولا يهمك يا ${childName} يا بطلة! هديكي فزورة صغيرة: حاجة تبدأ بحرف ${letter}، يا ترى إيه هي؟ فكري معايا!`;
  }
  
  if (clean.includes('مرحبا') || clean.includes('أهلا') || clean.includes('سلام') || clean.includes('ازيك')) {
    return `أهلاً وسهلاً يا ${childName} يا قمر! جاهزة لمغامرة حرف ${letter} (${letterName}) النهاردة؟`;
  }

  return `شاطرة يا ${childName}! إجابة ممتازة وذكية جداً! تعرفي كلمة تانية كمان فيها حرف ${letter}؟ ⭐`;
}

// Serve static frontend assets in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
