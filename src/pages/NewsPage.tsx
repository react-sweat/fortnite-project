import { useState } from 'react';
import { useFortniteApi } from '../hooks/useFortniteApi';
import type { NewsResponse, NewsMotd, STWMessage } from '../types/fortnitedto';

export default function NewsPage() {
    const { data, loading, error } = useFortniteApi<NewsResponse>('/v2/news');
    const [activeTab, setActiveTab] = useState<'br' | 'stw'>('br');

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                <p>Error loading news: {error}</p>
            </div>
        );
    }

    if (!data) {
        return <div className="text-center p-4">No news available.</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fortnite News
            </h1>

            <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
                    <button
                        onClick={() => setActiveTab('br')}
                        className={`px-6 py-2 rounded-md font-semibold transition-all ${activeTab === 'br'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-600 hover:text-blue-600'
                            }`}
                    >
                        Battle Royale
                    </button>
                    <button
                        onClick={() => setActiveTab('stw')}
                        className={`px-6 py-2 rounded-md font-semibold transition-all ${activeTab === 'stw'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-600 hover:text-blue-600'
                            }`}
                    >
                        Save the World
                    </button>
                </div>
            </div>

            {activeTab === 'br' && data.br && (
                <div className="space-y-6">
                    <p className="text-center text-gray-500 mb-6">
                        Last updated: {new Date(data.br.date).toLocaleString()}
                    </p>

                    {data.br.image && (
                        <div className="mb-8 rounded-lg overflow-hidden shadow-xl">
                            <img
                                src={data.br.image}
                                alt="Featured News"
                                className="w-full h-auto"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.br.motds
                            .filter((motd) => !motd.hidden)
                            .sort((a, b) => b.sortingPriority - a.sortingPriority)
                            .map((motd) => (
                                <NewsCard key={motd.id} motd={motd} />
                            ))}
                    </div>
                </div>
            )}

            {activeTab === 'stw' && data.stw && (
                <div className="space-y-6">
                    <p className="text-center text-gray-500 mb-6">
                        Last updated: {new Date(data.stw.date).toLocaleString()}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.stw.messages.map((message, index) => (
                            <STWCard key={index} message={message} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function NewsCard({ motd }: { motd: NewsMotd }) {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="relative h-72 bg-gray-200 overflow-hidden">
                <img
                    src={motd.tileImage || motd.image}
                    alt={motd.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-2xl mb-3 text-gray-800">{motd.title}</h3>
                {motd.tabTitle !== motd.title && (
                    <p className="text-base text-blue-600 font-semibold mb-3">{motd.tabTitle}</p>
                )}
                <p className="text-gray-600 text-base leading-relaxed flex-grow">{motd.body}</p>
            </div>
        </div>
    );
}

function STWCard({ message }: { message: STWMessage }) {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-80 bg-gray-200 overflow-hidden">
                <img
                    src={message.image}
                    alt={message.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="p-8">
                <h3 className="font-bold text-3xl mb-4 text-gray-800">{message.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{message.body}</p>
            </div>
        </div>
    );
}
