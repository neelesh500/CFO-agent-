"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type User = {
    username: string;
    role: string;
    token: string;
};

type AuthContextType = {
    user: User | null;
    login: (u: string, p: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const backend_url = "http://127.0.0.1:8000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const s = localStorage.getItem('vittya_auth');
        if (s) {
            setUser(JSON.parse(s));
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        const res = await fetch(`${backend_url}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error("Invalid credentials");
        const data = await res.json();
        const newUser = { username, role: data.role, token: data.token };
        localStorage.setItem('vittya_auth', JSON.stringify(newUser));
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('vittya_auth');
        setUser(null);
        router.push('/');
    };

    if (loading) return null;

    if (!user) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-brand-bg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full from-blue-500/10 to-transparent bg-gradient-to-br pointer-events-none" />
                <div className="panel p-8 rounded-xl z-10 w-96 max-w-[90vw]">
                    <h1 className="text-2xl font-bold text-center mb-6 text-white text-primary-gradient">Vittya Authorization</h1>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const u = (e.target as any).username.value;
                        const p = (e.target as any).password.value;
                        login(u, p).catch(err => alert(err.message));
                    }} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400">Username (cfo or analyst)</label>
                            <input name="username" type="text" defaultValue="cfo" className="w-full bg-[#181a1f] border border-[#ffffff1a] rounded p-2 text-white mt-1 outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Password</label>
                            <input name="password" type="password" defaultValue="pass" className="w-full bg-[#181a1f] border border-[#ffffff1a] rounded p-2 text-white mt-1 outline-none focus:border-blue-500" />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded transition">Authenticate System</button>
                    </form>
                    <p className="mt-4 text-xs text-gray-500 text-center">Secure Role-Based Access Enforced</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext)!;

// Context wrapper for secure application state

