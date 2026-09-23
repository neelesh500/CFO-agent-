"use client";
import { Database } from 'lucide-react';
export default function DataControlPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center">
                <Database className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">Data Control Center</h1>
            <p className="text-gray-400 max-w-md">Manage Azure SQL data ingestion, API connections, and third-party accounting software streams.</p>
        </div>
    );
}
