import { useState } from 'react';
import { useFortniteApi } from '../hooks/useFortniteApi';
import type { MapData } from '../types/fortnitedto';

interface Point {
    x: number;
    y: number;
    pixelX: number;
    pixelY: number;
}

export default function MapPage() {
    const { data, loading, error } = useFortniteApi<MapData>('/v1/map');
    const [coordinates, setCoordinates] = useState<{ x: number; y: number } | null>(null);
    const [point1, setPoint1] = useState<Point | null>(null);
    const [point2, setPoint2] = useState<Point | null>(null);

    const MAP_MIN_X = -60000;
    const MAP_MAX_X = 90000;
    const MAP_MIN_Y = -60000;
    const MAP_MAX_Y = 60000;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const percentX = x / rect.width;
        const percentY = y / rect.height;

        const fortniteX = Math.round(MAP_MIN_X + percentX * (MAP_MAX_X - MAP_MIN_X));
        const fortniteY = Math.round(MAP_MAX_Y - percentY * (MAP_MAX_Y - MAP_MIN_Y));

        setCoordinates({ x: fortniteX, y: fortniteY });
    };

    const handleMouseLeave = () => {
        setCoordinates(null);
    };

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pixelX = e.clientX - rect.left;
        const pixelY = e.clientY - rect.top;

        const percentX = pixelX / rect.width;
        const percentY = pixelY / rect.height;

        const fortniteX = Math.round(MAP_MIN_X + percentX * (MAP_MAX_X - MAP_MIN_X));
        const fortniteY = Math.round(MAP_MAX_Y - percentY * (MAP_MAX_Y - MAP_MIN_Y));

        const newPoint: Point = { x: fortniteX, y: fortniteY, pixelX, pixelY };

        if (!point1) {
            setPoint1(newPoint);
        } else if (!point2) {
            setPoint2(newPoint);
        } else {
            setPoint1(newPoint);
            setPoint2(null);
        }
    };

    const calculateDistance = () => {
        if (!point1 || !point2) return null;

        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        const distanceCm = Math.sqrt(dx * dx + dy * dy);

        const distanceM = distanceCm / 100;

        return Math.round(distanceM);
    };

    const clearPoints = () => {
        setPoint1(null);
        setPoint2(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                <p>Error loading map: {error}</p>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const { images } = data;
    const distance = calculateDistance();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Fortnite Map</h1>

            <div className="max-w-4xl mx-auto mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-blue-900 mb-2">Distance Calculator</h2>
                            <p className="text-sm text-blue-700">
                                {!point1 && "Click on the map to set your first point"}
                                {point1 && !point2 && "Click on the map to set your second point"}
                                {point1 && point2 && distance && (
                                    <span className="text-xl font-bold">Distance: {distance.toLocaleString()} meters</span>
                                )}
                            </p>
                        </div>
                        {(point1 || point2) && (
                            <button
                                onClick={clearPoints}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div
                    className="relative aspect-square w-full cursor-crosshair"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleMapClick}
                >
                    <img
                        src={images.pois}
                        alt="Fortnite Map"
                        className="w-full h-full object-contain select-none"
                        draggable={false}
                    />

                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {point1 && point2 && (
                            <line
                                x1={point1.pixelX}
                                y1={point1.pixelY}
                                x2={point2.pixelX}
                                y2={point2.pixelY}
                                stroke="white"
                                strokeWidth="4"
                            />
                        )}

                        {point1 && (
                            <>
                                <circle cx={point1.pixelX} cy={point1.pixelY} r="10" fill="#3b82f6" stroke="white" strokeWidth="3" />
                                <text x={point1.pixelX} y={point1.pixelY - 18} fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" style={{ textShadow: '2px 2px 4px black' }}>
                                    Start
                                </text>
                            </>
                        )}

                        {point2 && (
                            <>
                                <circle cx={point2.pixelX} cy={point2.pixelY} r="10" fill="#ef4444" stroke="white" strokeWidth="3" />
                                <text x={point2.pixelX} y={point2.pixelY - 18} fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" style={{ textShadow: '2px 2px 4px black' }}>
                                    End
                                </text>
                            </>
                        )}
                    </svg>

                    {coordinates && (
                        <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg font-mono text-sm pointer-events-none">
                            <div className="flex gap-4">
                                <span>X: {coordinates.x}</span>
                                <span>Y: {coordinates.y}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
