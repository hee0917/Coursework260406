import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { itemName } = await req.json();
    
    // 'gemini-1.5-flash' 대신 더 명확한 이름을 써봅니다.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `${itemName} 항목 부적합 시 사고 시나리오와 OSC 예방 대책을 2줄로 전문가처럼 써줘.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(JSON.stringify({ advice: text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("API Error:", error.message);
    // 에러가 나도 멈추지 않게 가짜 메시지라도 돌려줍니다.
    return new Response(JSON.stringify({ advice: "현재 AI 분석이 지연되고 있습니다. 잠시 후 다시 시도해주세요." }), { 
      status: 200, // 브라우저가 멈추지 않게 200으로 보냅니다.
      headers: { "Content-Type": "application/json" } 
    });
  }
}
