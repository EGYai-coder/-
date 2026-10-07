import { ChatMessage, LetterData } from '../types';

export async function askProfessorAI(
  message: string,
  letter: LetterData,
  conversation: ChatMessage[],
  childName: string = 'ساجدة'
): Promise<string> {
  try {
    const formattedHistory = conversation.map((c) => ({
      role: c.role === 'teacher' ? ('assistant' as const) : ('user' as const),
      content: c.text,
    }));

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        letter: letter.letter,
        letterName: letter.name,
        childName,
        conversation: formattedHistory,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.reply) {
        return data.reply;
      }
    }
  } catch (err) {
    console.warn('API call to /api/chat error, using smart client educational fallback:', err);
  }

  // Educational fallback logic tailored to the letter
  const clean = message.trim().toLowerCase();
  const wordsList = letter.words.map((w) => w.word).join(' و ');

  if (clean.includes('لا أعرف') || clean.includes('مش عارف') || clean.includes('ساعدني')) {
    return `ولا يهمك يا ${childName} يا قمر! هساعدك: مثلاً كلمة "${letter.words[0].word}" (${letter.words[0].emoji}) تبدأ بحرف ${letter.letter}! قوليلي إيه رأيك فيها؟ ✨`;
  }

  // Check if child mentioned one of the letter's words
  const matchedWord = letter.words.find((w) => clean.includes(w.word.toLowerCase()));
  if (matchedWord) {
    return `ما شاء الله عليكِ يا ${childName}! كلمة "${matchedWord.word}" ${matchedWord.emoji} تبدأ بحرف ${letter.name}! أنتِ شاطرة وذكية جداً! ⭐`;
  }

  return `يا سلام عليكِ يا ${childName} يا بطلة! فكرة جميلة جداً في حرف ${letter.name}! في كمان كلمات مثل ${wordsList}، تعرفي معنى أي كلمة منهم؟ 🌟`;
}
