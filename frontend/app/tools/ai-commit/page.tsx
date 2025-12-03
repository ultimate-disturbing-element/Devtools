'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import api from "@/lib/api";

export default function AICommitPage() {
    const [description, setDescription] = useState("");
    const [diff, setDiff] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await api.post("/ai/commit/generate", {
                description,
                diff: diff || undefined,
            });
            setResult(response.data);
        } catch (error) {
            console.error("Error generating commit message:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="container mx-auto p-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">AI Commit Message Generator</h1>
                <p className="text-muted-foreground">
                    Generate conventional commit messages using AI
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Change Description</CardTitle>
                        <CardDescription>Describe your changes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description *</label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Added user authentication feature..."
                                className="min-h-[150px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Git Diff (Optional)</label>
                            <Textarea
                                value={diff}
                                onChange={(e) => setDiff(e.target.value)}
                                placeholder="Paste git diff output here..."
                                className="min-h-[150px] font-mono text-sm"
                            />
                        </div>

                        <Button
                            onClick={handleGenerate}
                            className="w-full"
                            disabled={loading || !description}
                        >
                            {loading ? "Generating..." : "Generate Commit Messages"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Generated Commit Messages</CardTitle>
                        <CardDescription>Click to copy</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {result ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium mb-2">Conventional Format</p>
                                    <div
                                        className="p-3 bg-muted rounded-md font-mono text-sm cursor-pointer hover:bg-muted/80"
                                        onClick={() => handleCopy(result.conventional_format)}
                                    >
                                        {result.conventional_format}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium mb-2">Short Message</p>
                                    <div
                                        className="p-3 bg-muted rounded-md font-mono text-sm cursor-pointer hover:bg-muted/80"
                                        onClick={() => handleCopy(result.short_message)}
                                    >
                                        {result.short_message}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium mb-2">Extended Message</p>
                                    <div
                                        className="p-3 bg-muted rounded-md font-mono text-sm cursor-pointer hover:bg-muted/80 whitespace-pre-wrap"
                                        onClick={() => handleCopy(result.extended_message)}
                                    >
                                        {result.extended_message}
                                    </div>
                                </div>

                                <p className="text-xs text-muted-foreground text-center">
                                    Click any message to copy it
                                </p>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-muted-foreground">
                                Generated commit messages will appear here
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
