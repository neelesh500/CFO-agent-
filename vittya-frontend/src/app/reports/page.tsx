"use client";
import { FileBarChart } from 'lucide-react';
export default function ReportsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center">
                <FileBarChart className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">Standardized Reporting</h1>
            <p className="text-gray-400 max-w-md">Generate automated P&L, Balance Sheets, and localized tax compliances on-demand.</p>
        </div>
    );
}
