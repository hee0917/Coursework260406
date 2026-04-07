import { GoogleGenerativeAI } from "@google/generative-ai";

// Vercel 환경변수(Environment Variables)에서 API 키를 가져옵니다.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // 프론트엔드(page.tsx)에서 보낸 점검 항목 이름을 받습니다.
    const { itemName } = await req.json();

    // 가장 빠르고 가성비 좋은 gemini-1.5-flash 모델을 사용합니다.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // AI에게 줄 명령(프롬프트) - 네 연구 주제인 OSC 안전을 강조했어.
    const prompt = `당신은 OSC(Off-Site Construction) 건설 안전 전문가입니다. 
    현재 점검 중인 항목 [${itemName}]에서 '부적합'이 발견되었습니다. 
    이로 인해 발생할 수 있는 사고 시나리오와 OSC 현장 특화 예방 대책을 한국어로 2줄 내외로 짧고 전문적이게 답변해 주세요.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 결과를 JSON 형태로 반환합니다.
    return new Response(JSON.stringify({ advice: text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI API Error:", error);
    return new Response(JSON.stringify({ error: "AI 분석 실패" }), { status: 500 });
  }
}