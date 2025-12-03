'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Copy } from "lucide-react";
import api from "@/lib/api";

export default function JSONFormatterPage() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleValidate = async () => {
        setLoading(true);
        try {
            const response = await api.post("/utils/json/validate", {
                json_string: input,
            });
            setResult(response.data);
        } catch (error: any) {
            setResult({
                valid: false,
                error: error.response?.data?.detail || "Network error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (result?.formatted) {
            navigator.clipboard.writeText(result.formatted);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">JSON Formatter & Validator</h1>
                <p className="text-muted-foreground">
                    Validate, format, and beautify your JSON data
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Input JSON</CardTitle>
                        <CardDescription>Paste your JSON here</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder='{"name": "John", "age": 30}'
                            className="min-h-[400px] font-mono text-sm"
                        />
                        <Button
                            onClick={handleValidate}
                            className="mt-4 w-full"
                            disabled={loading || !input}
                        >
                            {loading ? "Validating..." : "Validate & Format"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Result</CardTitle>
                        <CardDescription>
                            {result && (
                                <div className="flex items-center gap-2">
                                    {result.valid ? (
                                        <><CheckCircle2 className="h-4 w-4 text-green-500" /> Valid JSON</>
                                    ) : (
                                        <><XCircle className="h-4 w-4 text-red-500" /> Invalid JSON</>
                                    )}
                                </div>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {result && result.valid && (
                            <>
                                <div className="relative">
                                    <Textarea
                                        value={result.formatted}
                                        readOnly
                                        className="min-h-[400px] font-mono text-sm"
                                    />
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="absolute top-2 right-2"
                                        onClick={handleCopy}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        )}
                        {result && !result.valid && (
                            <div className="p-4 rounded-md bg-destructive/10 text-destructive">
                                <p className="font-semibold mb-2">Error:</p>
                                <p className="text-sm font-mono">{result.error}</p>
                            </div>
                        )}
                        {!result && (
                            <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                                Enter JSON and click validate
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
