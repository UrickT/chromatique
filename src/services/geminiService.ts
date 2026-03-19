import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

/**
 * 初始化 Gemini AI 實例
 * 請確保環境變數中已配置有效 API Key
 */
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel(
  { model: "gemini-2.5-flash" },
); // 穩定版 2.5

/**
 * 從圖片中提取色板
 * @param base64Image 圖片的 Base64 編碼字符串
 * @param count 欲提取的顏色數量
 * @returns HEX 顏色代碼數組
 */
export async function extractColorsFromImage(
  base64Image: string,
  count: number = 5,
): Promise<string[]> {
  const prompt = `Extract a cohesive and aesthetically pleasing color palette of exactly ${count} hex codes from this image. Return the result as a JSON array of strings only.`;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
            { text: prompt },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
    });

    const response = result.response;
    const text = response.text();
    return JSON.parse(text) as string[];
  } catch (e) {
    console.error("Gemini Extraction Error:", e);
    // 發生錯誤時的後備色板
    return ["#0F172A", "#334155", "#64748B", "#94A3B8", "#CBD5E1"];
  }
}

/**
 * 獲取每日推薦顏色
 * @param lang 語言偏好
 * @returns 包含 HEX、名稱與描述的 DailyColor 對象
 */
export async function getDailyColor(lang: "en" | "zh" = "en") {
  // 在 Prompt 中強調 JSON 格式（這對 Flash 模型很重要）
  const prompt =
    lang === "zh"
      ? "請生成一個『今日之色』。返回格式必須為純 JSON 對象，包含：'hex' (十六進制)、'name' (詩意中文名)、'description' (一句詩意中文描述)。"
      : "Generate a 'Color of the Day'. Return a pure JSON object: 'hex', 'name' (poetic name), and 'description' (1-sentence poetic description).";

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        // 如果你的環境持續噴 400，請先註解掉 responseSchema 測試
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            hex: { type: SchemaType.STRING },
            name: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
          },
          required: ["hex", "name", "description"],
        },
      },
    });

    const text = result.response.text();

    // 安全解析：有時 Gemini 會回傳包含 ```json 的 Markdown，需要清理
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Gemini Daily Color Error:", e);
    // 保持你的後備方案 (Fallback)
    return lang === "zh"
      ? {
          hex: "#E94E77",
          name: "絲絨暮色",
          description: "夏日傍晚太陽落入地平線時的溫暖。",
        }
      : {
          hex: "#E94E77",
          name: "Velvet Dusk",
          description: "Soft warmth of a summer evening.",
        };
  }
}
