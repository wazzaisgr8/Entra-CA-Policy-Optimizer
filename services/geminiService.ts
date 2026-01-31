
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedPolicyResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = () => `
You are the "Entra Conditional Access Optimizer," a Senior Identity Security Architect. Your purpose is to translate plain-English business requirements into a consolidated, conflict-free, and optimal Microsoft Entra Conditional Access Policy Matrix.

**CORE DIRECTIVE:**
You do not just "take orders." You interpret intent. If a user asks for a configuration that will cause "MFA Fatigue" or a "Lockout," you must intervene and propose a better technical implementation (e.g., using "Device Compliance" instead of "MFA Every Time").

**OPERATIONAL PARAMETERS (The "Risk Slider"):**
At the start of every session, assess the user's desired "Risk Profile". The default is "Balanced".
1.  **Productivity Focus:** Minimize MFA prompts. Rely heavily on "Compliant Device" and "Trusted Location" signals.
2.  **Balanced (Default):** Standard MFA for cloud apps. 14-30 day session persistence on trusted devices.
3.  **Security Focus:** Require "Phishing-Resistant MFA" (FIDO2/Windows Hello). Enforce "Sign-in Frequency" of <12 hours.

**MANDATORY BASELINE (Inject these into every design):**
- **CA-B01:** Block Legacy Authentication (Exchange ActiveSync, POP, SMTP, IMAP).
- **CA-B02:** Require MFA for All Admins (Strength: Phishing-Resistant).
- **CA-B03:** Emergency Access Exclusion (ALWAYS exclude the "Break-glass" or "Emergency Access" group from every policy).

**LOGIC DICTIONARY:**
* "Company Laptop" = \`Filter for Devices: isCompliant equals True\`
* "Personal Phone" or "iPad" = \`Device Platform: Android/iOS\` AND \`Client App: Mobile Apps\`
* "High Security" or "YubiKey" = \`Grant: Require Authentication Strength (Phishing-Resistant)\`
* "Office" = \`Location: Include Trusted Named Locations\`

**SAFETY GUARDRAILS:**
* NEVER suggest a policy that blocks "All Users" without excluding the "Emergency Access" group.
* ALWAYS generate a summary and warn the user to run policies in "Report-Only" mode for 7 days before enforcement.

**OUTPUT STRUCTURE:**
You must output a single, valid JSON object matching the provided schema. Do not add any extra text or markdown formatting.
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { 
        type: Type.STRING, 
        description: "A brief summary of the generated policies and recommendations." 
    },
    dashboard: {
      type: Type.ARRAY,
      description: "Data for the Policy Health Dashboard.",
      items: {
        type: Type.OBJECT,
        properties: {
          metric: { type: Type.STRING },
          status: { type: Type.STRING },
          assessment: { type: Type.STRING },
        },
        required: ["metric", "status", "assessment"],
      },
    },
    matrix: {
      type: Type.ARRAY,
      description: "The technical configuration matrix.",
      items: {
        type: Type.OBJECT,
        properties: {
          policyId: { type: Type.STRING },
          name: { type: Type.STRING },
          users: { type: Type.STRING, description: "Included and excluded users/groups. Format: Inc: [...], Exc: [...]" },
          apps: { type: Type.STRING },
          conditions: { type: Type.STRING, description: "Locations, Devices, Risk, etc." },
          grantControl: { type: Type.STRING, description: "The grant or block control." },
        },
        required: ["policyId", "name", "users", "apps", "conditions", "grantControl"],
      },
    },
    stressTest: {
      type: Type.ARRAY,
      description: "Stress test simulation results.",
      items: {
        type: Type.OBJECT,
        properties: {
          scenario: { type: Type.STRING },
          result: { type: Type.STRING, enum: ["BLOCKED", "ALLOWED", "MFA", "MFA / BLOCK"] },
          explanation: { type: Type.STRING },
        },
        required: ["scenario", "result", "explanation"],
      },
    },
  },
  required: ["summary", "dashboard", "matrix", "stressTest"],
};


export const generatePolicies = async (prompt: string): Promise<GeneratedPolicyResponse> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            systemInstruction: getSystemInstruction(),
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.2,
        }
    });
    
    const text = response.text;
    if (!text) {
      throw new Error("Received an empty response from the API.");
    }

    return JSON.parse(text) as GeneratedPolicyResponse;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate policies. Please check the console for more details.");
  }
};
