'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";
import api from "@/lib/api";
import { useEffect } from "react";

interface PasswordStrength {
    score: number;
    strength: string;
    length: number;
    has_uppercase: boolean;
    has_lowercase: boolean;
    has_numbers: boolean;
    has_symbols: boolean;
    entropy: number;
    suggestions: string[];
}

export default function PasswordStrengthPage() {
    const [password, setPassword] = useState("");
    const [result, setResult] = useState<PasswordStrength | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (password) {
            const timeoutId = setTimeout(() => {
                checkPassword();
            }, 500);
            return () => clearTimeout(timeoutId);
        } else {
            setResult(null);
        }
    }, [password]);

    const checkPassword = async () => {
        if (!password) return;

        setLoading(true);
        try {
            const response = await api.post("/utils/password/check", {
                password: password,
            });
            setResult(response.data);
        } catch (error) {
            console.error("Error checking password:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStrengthColor = (score: number) => {
        if (score < 30) return "bg-red-500";
        if (score < 60) return "bg-orange-500";
        if (score < 80) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Password Strength Checker</h1>
                <p className="text-muted-foreground">
                    Analyze your password security and get improvement suggestions
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Enter Password</CardTitle>
                    <CardDescription>Type to see real-time strength analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password..."
                        className="text-lg"
                    />

                    {result && (
                        <>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Strength: {result.strength.replace('_', ' ').toUpperCase()}</span>
                                    <span className="font-medium">{result.score}/100</span>
                                </div>
                                <Progress value={result.score} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Character Types</p>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex items-center gap-2">
                                            {result.has_uppercase ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span>Uppercase letters</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {result.has_lowercase ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span>Lowercase letters</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {result.has_numbers ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span>Numbers</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {result.has_symbols ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span>Special symbols</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Statistics</p>
                                    <div className="space-y-1 text-sm">
                                        <div>Length: {result.length} characters</div>
                                        <div>Entropy: {result.entropy} bits</div>
                                    </div>
                                </div>
                            </div>

                            {result.suggestions.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Suggestions</p>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        {result.suggestions.map((suggestion, index) => (
                                            <li key={index}>• {suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
