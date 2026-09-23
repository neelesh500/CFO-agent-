"use client";
import { Settings } from 'lucide-react';
export default function SettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-gray-500/10 text-gray-400 rounded-full flex items-center justify-center">
                <Settings className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">Platform Settings</h1>
            <p className="text-gray-400 max-w-md">Configure agent personas, notification preferences, and team access rules.</p>
        </div>
    );
}
