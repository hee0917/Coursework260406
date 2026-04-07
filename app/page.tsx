"use client";
import React, { useState } from 'react';

export default function OSCSafetyApp() {
  const [loading, setLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("항목을 점검해 주세요.");

  const askAI = async (itemName: string) => {
    setLoading(true);
    setAiAdvice("AI가 위험 요인을 분석 중입니다...");
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName }),
      });
      const data = await res.json();
      setAiAdvice(data.advice);
    } catch (e) {
      setAiAdvice("분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <div className="bg-orange-500 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">OSC Safety Platform</h1>
          <p className="text-sm opacity-90">OSC 건설현장 지능형 안전점검 시스템</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">📦 OSC 특화 점검 항목</h2>
            {[
              "모듈 결속 상태 확인 (운송 중 변형)",
              "크레인 양중 하중 및 수평도 측정",
              "접합부 볼트 조임 토크 준수",
              "고소작업대(AWP) 안전 장치 작동"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-gray-700 text-sm">{item}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => askAI(item)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-xs hover:bg-red-200"
                  >부적합</button>
                  <button className="px-3 py-1 bg-green-100 text-green-600 rounded-md text-xs hover:bg-green-200">적합</button>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-4 rounded-xl border ${loading ? 'bg-gray-100 border-gray-200' : 'bg-blue-50 border-blue-100'}`}>
            <h3 className="text-blue-800 font-bold mb-2 flex items-center gap-2">
              🤖 AI Safety Advice {loading && <span className="animate-spin">🌀</span>}
            </h3>
            <p className="text-blue-700 text-sm whitespace-pre-wrap leading-relaxed">
              {aiAdvice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
