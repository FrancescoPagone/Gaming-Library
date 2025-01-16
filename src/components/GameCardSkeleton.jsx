import React from 'react';

export default function GameCardSkeleton() {
    return (
        <div className="bg-gray-800 dark:bg-gray-900 rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-700 dark:bg-gray-800" />
            <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-700 dark:bg-gray-800 rounded w-3/4" />
                <div className="flex gap-2">
                    <div className="h-6 bg-gray-700 dark:bg-gray-800 rounded w-20" />
                    <div className="h-6 bg-gray-700 dark:bg-gray-800 rounded w-20" />
                </div>
            </div>
        </div>
    );
}