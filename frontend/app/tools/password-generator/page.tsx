'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import api from "@/lib/api";

export default function PasswordGeneratorPage() {
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [password, setPassword] = useState("");
    const [strengthScore, setStrengthScore] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await api.post("/utils/password/generate", {
                length,
                include_uppercase: includeUppercase,
                include_lowercase: includeLowercase,
                include_numbers: includeNumbers,
                include_symbols: includeSymbols,
            });
            setPassword(response.data.password);
            setStrengthScore(response.data.strength_score);
        } catch (error) {
            console.error("Error generating password:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
    };

    const getStrengthColor = (score: number) => {
        if (score < 30) return "text-red-500";
        if (score < 60) return "text-orange-500";
        if (score < 80) return "text-yellow-500";
        return "text-green-500";
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
                <p className="text-muted-foreground">
                    Generate secure random passwords with customizable options
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Password Options</CardTitle>
                    <CardDescription>Customize your password requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Length: {length}</label>
                        <input
                            type="range"
                            min="8"
                            max="128"
                            value={length}
                            onChange={(e) => setLength(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeUppercase}
                                onChange={(e) => setIncludeUppercase(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Uppercase (A-Z)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeLowercase}
                                onChange={(e) => setIncludeLowercase(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Lowercase (a-z)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeNumbers}
                                onChange={(e) => setIncludeNumbers(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Numbers (0-9)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeSymbols}
                                onChange={(e) => setIncludeSymbols(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Symbols (!@#$...)</span>
                        </label>
                    </div>

                    <Button onClick={handleGenerate} className="w-full" disabled={loading}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {loading ? "Generating..." : "Generate Password"}
                    </Button>

                    {password && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-md bg-muted/50 font-mono text-lg break-all relative">
                                {password}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={handleCopy}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                    Strength Score:{" "}
                                    <span className={`font-bold ${getStrengthColor(strengthScore)}`}>
                                        {strengthScore}/100
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
