import { GoogleGenerativeAI } from "@google/generative-ai";

// Vercel 환경변수에서 API 키를 가져옵니다.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { itemName } = await req.json();

    // 404 에러 방지를 위해 모델 이름을 정확하게 지정합니다.
    // 'gemini-1.5-flash' 대신 'gemini-1.5-flash'를 명시적으로 쓰거나 
    // 최신 버전인 'gemini-1.5-flash-latest'를 시도해볼 수 있어.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `당신은 OSC(Off-Site Construction) 건설 안전 전문가입니다. 
    현재 점검 중인 항목 [${itemName}]에서 '부적합'이 발견되었습니다. 
    이로 인해 발생할 수 있는 사고 시나리오와 OSC 현장 특화 예방 대책을 한국어로 2줄 내외로 짧고 전문적이게 답변해 주세요.`;

    // 요청이 잘 가는지 로그를 찍어봅니다. (Vercel Logs에서 확인 가능)
    console.log("Calling Gemini API with item:", itemName);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ advice: text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    // 에러 발생 시 상세 내용을 로그에 찍습니다.
    console.error("Gemini API 상세 에러:", error.message);
    return new Response(JSON.stringify({ error: error.message || "AI 분석 실패" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
