import { useState } from 'react';
import axios from 'axios';

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    reasoning_details?: any;
}

interface UseAIChatReturn {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    sendMessage: (content: string) => Promise<void>;
    clearMessages: () => void;
}

const SYSTEM_PROMPT = `
You are a Fortnite Expert AI Assistant. Your goal is to help players improve their game, analyze their stats, and provide hardware recommendations.

Capabilities:
1.  Win Probability: Calculate win probability based on stats (Win %, K/D, Matches).
2.  Skill Advice: Give specific tips to improve based on their weak points.
3.  PC Recommendations: Recommend PC specs for Fortnite (High FPS, Low Latency).

CRITICAL INSTRUCTION FOR STATS:
When a user asks about their stats or win probability, you MUST first obtain their Fortnite username.
If you have the username, you MUST output a "Tool Call" to fetch their stats.
The Tool Call format is: \`[[get_stats: <username>]]\`
Example: \`[[get_stats: Ninja]]\`

Do NOT make up stats. Only use the stats provided by the System in response to your Tool Call.
If you receive stats JSON, analyze it and answer the user's question.

STYLE GUIDELINES:
- Do NOT explain your math or formulas. Just state the probability or result.
- Be concise and friendly.
- Do NOT use Markdown formatting (no bold, no tables, no lists). Use plain text only.
- Use simple spacing or dashes for lists if needed.
`;

const fetchPlayerStats = async (username: string) => {
    try {
        const apiKey = import.meta.env.VITE_FORTNITE_API_KEY;
        const baseUrl = import.meta.env.VITE_FORTNITE_API_BASE_URL || 'https://fortnite-api.com';

        const response = await axios.get(`${baseUrl}/v2/stats/br/v2`, {
            params: { name: username },
            headers: apiKey ? { Authorization: apiKey } : {},
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching stats:', error);
        return { error: 'Player not found or API error' };
    }
};

export function useAIChat(): UseAIChatReturn {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        const userMessage: Message = { role: 'user', content };
        let currentMessages = [...messages, userMessage];

        if (messages.length === 0) {
            currentMessages = [
                { role: 'system', content: SYSTEM_PROMPT },
                userMessage
            ];
        }

        setMessages(currentMessages);
        setIsLoading(true);
        setError(null);

        try {
            const apiKey = import.meta.env.VITE_AI_API_KEY;
            let baseUrl = import.meta.env.VITE_AI_BASE_URL;

            if (!apiKey) throw new Error('AI configuration is missing.');

            if (baseUrl) {
                if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
                if (baseUrl.includes('openrouter.ai') && !baseUrl.includes('/api/v1')) baseUrl = `${baseUrl}/api/v1`;
                if (!baseUrl.endsWith('/chat/completions')) baseUrl = `${baseUrl}/chat/completions`;
            } else {
                throw new Error('Base URL is missing');
            }

            const callAI = async (msgs: Message[]) => {
                return await axios.post(
                    baseUrl!,
                    {
                        model: 'x-ai/grok-4.1-fast',
                        messages: msgs,
                        reasoning: { enabled: true }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`,
                            'HTTP-Referer': window.location.origin,
                            'X-Title': 'Fortnite Platform',
                        },
                    }
                );
            };

            let response = await callAI(currentMessages);
            let assistantMessage: Message = {
                role: 'assistant',
                content: response.data.choices[0].message.content || '',
                reasoning_details: response.data.choices[0].message.reasoning_details
            };

            const toolCallMatch = assistantMessage.content.match(/\[\[get_stats:\s*(.+?)\]\]/);

            if (toolCallMatch) {
                const username = toolCallMatch[1].trim();

                currentMessages = [...currentMessages, assistantMessage];
                setMessages(currentMessages);

                const stats = await fetchPlayerStats(username);
                const systemStatsMessage: Message = {
                    role: 'system',
                    content: `Stats for ${username}: ${JSON.stringify(stats)}`
                };

                currentMessages = [...currentMessages, systemStatsMessage];

                response = await callAI(currentMessages);
                assistantMessage = {
                    role: 'assistant',
                    content: response.data.choices[0].message.content || '',
                    reasoning_details: response.data.choices[0].message.reasoning_details
                };
            }

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err: any) {
            console.error('AI Chat Error:', err);
            setError(err.message || 'Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    const clearMessages = () => {
        setMessages([]);
        setError(null);
    };

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages,
    };
}
