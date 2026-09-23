"use client";
import { Gavel } from 'lucide-react';
export default function DecisionsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-brand-cyan/10 text-brand-cyan rounded-full flex items-center justify-center">
                <Gavel className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">Autonomous Decisions</h1>
            <p className="text-gray-400 max-w-md">Review and audit all financial actions executed autonomously by the Decision Agent.</p>
        </div>
    );
}
