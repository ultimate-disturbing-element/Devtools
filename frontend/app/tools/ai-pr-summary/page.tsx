'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function PRSummaryPage() {
    const [prDescription, setPrDescription] = useState("");
    const [diff, setDiff] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await api.post("/ai/pr/summarize", {
                pr_description: prDescription,
                diff: diff || undefined,
            });
            setResult(response.data);
        } catch (error) {
            console.error("Error generating PR summary:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">AI PR Summary Generator</h1>
                <p className="text-muted-foreground">
                    Generate comprehensive pull request summaries with AI
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Pull Request Information</CardTitle>
                        <CardDescription>Provide PR details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">PR Description *</label>
                            <Textarea
                                value={prDescription}
                                onChange={(e) => setPrDescription(e.target.value)}
                                placeholder="Describe the pull request..."
                                className="min-h-[200px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Diff (Optional)</label>
                            <Textarea
                                value={diff}
                                onChange={(e) => setDiff(e.target.value)}
                                placeholder="Paste git diff or changes..."
                                className="min-h-[150px] font-mono text-sm"
                            />
                        </div>

                        <Button
                            onClick={handleGenerate}
                            className="w-full"
                            disabled={loading || !prDescription}
                        >
                            {loading ? "Generating..." : "Generate PR Summary"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Generated Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {result ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Summary</h3>
                                    <p className="text-sm text-muted-foreground">{result.summary}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2 text-red-500">Potential Risks</h3>
                                    <ul className="space-y-1">
                                        {result.risks.map((risk: string, i: number) => (
                                            <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                                <span>•</span>
                                                <span>{risk}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2 text-blue-500">Key Changes</h3>
                                    <ul className="space-y-1">
                                        {result.changes.map((change: string, i: number) => (
                                            <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                                <span>•</span>
                                                <span>{change}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2 text-green-500">Testing Suggestions</h3>
                                    <ul className="space-y-1">
                                        {result.testing_suggestions.map((suggestion: string, i: number) => (
                                            <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                                <span>•</span>
                                                <span>{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="h-96 flex items-center justify-center text-muted-foreground">
                                Generated PR summary will appear here
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
