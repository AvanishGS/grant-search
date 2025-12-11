import { GoogleGenAI } from "@google/genai";
import { GrantSearchRequest, SearchResult, WebSource, GrantOpportunity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchGrants = async (request: GrantSearchRequest): Promise<SearchResult> => {
  const { sector, projectType, keywords, regionScope } = request;
  
  const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Define scope instruction based on user selection
  const scopeInstruction = regionScope === 'POLISH'
    ? `
    SCOPE:
    - **STRICTLY POLISH NATIONAL & LOCAL FUNDS ONLY**.
    - Primary Sources: NIW-CRSO, Polish Ministries (e.g., MKiDN, MEN, MSiT), Urząd Marszałkowski (Regional Funds/RPO), Municipal Grants (Otwarte Konkursy Ofert), FIO, PROO.
    - **EXCLUDE**: Direct management EU funds (Erasmus+, Horizon Europe, CERV) unless there is a specific local Polish call managed by a Polish intermediary.
    `
    : `
    SCOPE:
    - **ALL EUROPEAN & POLISH FUNDS**.
    - Include: Direct EU Funds (Erasmus+, CERV, Horizon Europe, Creative Europe, Life).
    - Include: Indirect EU Funds in Poland (FERS, FENG, FEnIKS).
    - Include: National Polish Grants (NIW, Ministries, Regional Funds).
    `;

  const prompt = `
    Current Date: ${currentDate}

    Act as a senior EU grant consultant for Polish NGOs.
    Search for ACTIVE and UPCOMING grant calls.

    ${scopeInstruction}

    CRITERIA:
    - **Deadlines**: STRICTLY FUTURE DATES ONLY (After ${currentDate}).
    - **Target**: Polish NGOs.
    - **Focus**: ${sector}, ${projectType}, ${keywords}.

    OUTPUT FORMAT:
    First, provide a brief strategic summary in Markdown. 
    THEN, generate a strictly formatted JSON array containing the specific opportunities found.
    
    The JSON must be wrapped in a code block \`\`\`json ... \`\`\`.
    
    JSON Structure per item:
    {
      "title": "Grant Name",
      "organization": "Funding Agency",
      "url": "Direct HTTP link to the specific grant call page or application portal",
      "deadline": "YYYY-MM-DD" (or "Ongoing"),
      "amount": "Budget per project (e.g. 'up to 50k PLN')",
      "description": "One sentence summary focusing on eligibility.",
      "competitionLevel": "Low" | "Medium" | "High" | "Very High",
      "successRateEstimate": "e.g. '15-20%'",
      "matchScore": number (0-100, relevance to '${keywords}'),
      "coFinancing": "e.g. 'None (100% funded)' or '20% own contribution'",
      "fundingType": "e.g. 'Lump Sum', 'Real Costs', 'Unit Costs'",
      "adminBurden": "Low" | "Medium" | "High" (Estimate paperwork/reporting complexity),
      "consortiumReq": "e.g. 'Single Entity', 'Min 3 Partners', 'Transnational'",
      "projectDuration": "e.g. '12-24 months'",
      "paymentModel": "e.g. 'Pre-financing available', 'Reimbursement'"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const fullText = response.text || "";
    
    // Parse JSON from code block
    let opportunities: GrantOpportunity[] = [];
    const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        opportunities = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.warn("Failed to parse grant JSON", e);
      }
    }

    // Extract sources
    const sources: WebSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    chunks.forEach((chunk) => {
      if (chunk.web) {
        sources.push({
          uri: chunk.web.uri,
          title: chunk.web.title || "Source Link",
        });
      }
    });

    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i);

    return {
      rawMarkdown: fullText.replace(/```json[\s\S]*```/, ''), // Remove JSON from display text
      opportunities,
      sources: uniqueSources,
    };

  } catch (error) {
    console.error("Error searching grants:", error);
    throw error;
  }
};

export const generateGrantResource = async (grantTitle: string, type: 'ADVICE' | 'TEMPLATE'): Promise<string> => {
  const prompt = type === 'ADVICE' 
    ? `Act as a senior grant evaluator. For the grant "${grantTitle}", provide 5 specific, high-level expert tips on how to win this specific application. Focus on evaluation criteria, common mistakes, and "hidden" requirements. Format as Markdown.`
    : `Act as a professional grant writer. Write a hypothetical "Project Abstract" (max 200 words) for a successful application to the grant "${grantTitle}". It should be an example of best practices, using clear objectives, outputs, and impact indicators. Format as Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Unable to generate resource at this time.";
  } catch (error) {
    console.error("Error generating resource:", error);
    return "Error generating content. Please try again.";
  }
};