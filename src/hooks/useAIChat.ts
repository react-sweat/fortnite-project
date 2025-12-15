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
    formatMarkdown: (text: string) => string;
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
- Use Markdown formatting for better readability:
  - Use **bold** for emphasis
  - Use \`code\` for technical terms
  - Use bullet points (- item) for lists
  - Use ### for section headers
  - Use tables when comparing data
  - Use > for important notes or tips
`;

const formatMarkdown = (text: string): string => {
    let formatted = text;

    formatted = formatted.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
    formatted = formatted.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>');
    formatted = formatted.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');

    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
    formatted = formatted.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    formatted = formatted.replace(/__(.+?)__/g, '<strong class="font-bold">$1</strong>');
    formatted = formatted.replace(/_(.+?)_/g, '<em class="italic">$1</em>');

    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, 
        '<pre class="bg-gray-800 p-3 rounded-lg my-2 overflow-x-auto"><code class="text-sm font-mono">$2</code></pre>');

    formatted = formatted.replace(/^> (.+)$/gm, 
        '<blockquote class="border-l-4 border-blue-500 pl-4 py-1 my-2 bg-gray-800/50 rounded-r">$1</blockquote>');

    formatted = formatted.replace(/^\- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
    formatted = formatted.replace(/^\* (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
    formatted = formatted.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

    formatted = formatted.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => {
        if (match.includes('list-decimal')) {
            return `<ol class="my-2 space-y-1">${match}</ol>`;
        }
        return `<ul class="my-2 space-y-1">${match}</ul>`;
    });

    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
        '<a href="$2" class="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    formatted = formatted.replace(/^---$/gm, '<hr class="my-4 border-gray-600">');

    formatted = formatted.replace(/\n\n/g, '</p><p class="my-2">');
    formatted = formatted.replace(/\n/g, '<br>');

    formatted = `<p class="my-2">${formatted}</p>`;

    formatted = formatted.replace(/<p class="my-2"><(h[1-3]|blockquote|pre|ul|ol|hr)/g, '<$1');
    formatted = formatted.replace(/<\/(h[1-3]|blockquote|pre|ul|ol)><\/p>/g, '</$1>');
    formatted = formatted.replace(/<hr[^>]*><\/p>/g, '<hr class="my-4 border-gray-600">');

    return formatted;
};

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
        formatMarkdown,
    };
}