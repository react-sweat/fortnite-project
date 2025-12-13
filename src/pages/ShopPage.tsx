import { useFortniteApi } from '../hooks/useFortniteApi';
import type { ShopResponse, ShopEntry } from '../types/fortnitedto';

export default function ShopPage() {
    const { data, loading, error } = useFortniteApi<ShopResponse>('/v2/shop');

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
                <p>Error loading shop: {error}</p>
            </div>
        );
    }

    if (!data || !data.entries) {
        return <div className="text-center p-4">No shop data available.</div>;
    }

    const sections: Record<string, ShopEntry[]> = {};

    data.entries.forEach((entry) => {
        const sectionName = entry.layout?.name || 'Other';

        if (sectionName === 'Jam Tracks') {
            return;
        }

        if (entry.devName.includes('SID_Placeholder') || entry.devName.includes('TBD')) {
            return;
        }

        if (!sections[sectionName]) {
            sections[sectionName] = [];
        }
        sections[sectionName].push(entry);
    });

    const sortedSectionNames = Object.keys(sections).sort((a, b) => {
        const indexA = sections[a][0].layout?.index ?? 999;
        const indexB = sections[b][0].layout?.index ?? 999;
        return indexA - indexB;
    });

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Item Shop</h1>
            <p className="text-center text-gray-500 mb-8">
                Date: {new Date(data.date).toLocaleDateString()}
            </p>

            {sortedSectionNames.map((sectionName) => (
                <div key={sectionName} className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                        {sectionName}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {sections[sectionName].map((entry) => {
                            const item = entry.brItems?.[0];
                            const name = entry.bundle?.name || item?.name || entry.devName;
                            const image =
                                entry.bundle?.image ||
                                item?.images.featured ||
                                item?.images.icon ||
                                item?.images.smallIcon;
                            const rarityColor = getRarityColor(item?.rarity.value);

                            return (
                                <div
                                    key={entry.offerId}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                                >
                                    <div className={`aspect-square w-full overflow-hidden relative bg-gray-200 ${rarityColor}`}>
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={name}
                                                className="w-full h-full object-contain object-center"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                        {entry.banner && (
                                            <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                                                {entry.banner.value}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="font-bold text-lg mb-1 truncate" title={name}>
                                            {name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                            {entry.bundle?.info || item?.description || item?.type.displayValue}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <img
                                                    src={data.vbuckIcon}
                                                    alt="V-Bucks"
                                                    className="w-5 h-5"
                                                />
                                                <span className="font-bold text-slate-800">
                                                    {entry.finalPrice}
                                                </span>
                                                {entry.finalPrice < entry.regularPrice && (
                                                    <span className="text-xs text-gray-400 line-through ml-1">
                                                        {entry.regularPrice}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

function getRarityColor(rarity?: string): string {
    switch (rarity?.toLowerCase()) {
        case 'legendary':
            return 'border-b-4 border-yellow-500';
        case 'epic':
            return 'border-b-4 border-purple-500';
        case 'rare':
            return 'border-b-4 border-blue-500';
        case 'uncommon':
            return 'border-b-4 border-green-500';
        case 'common':
            return 'border-b-4 border-gray-400';
        case 'icon':
        case 'icon series':
            return 'border-b-4 border-teal-400';
        case 'marvel':
        case 'marvel series':
            return 'border-b-4 border-red-600';
        default:
            return 'border-b-4 border-gray-200';
    }
}
