'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { diffLines, Change } from "diff";

export default function TextDiffPage() {
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");
    const [diff, setDiff] = useState<Change[]>([]);

    const handleDiff = () => {
        const differences = diffLines(text1, text2);
        setDiff(differences);
    };

    return (
        <div className="container mx-auto p-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Text Diff Viewer</h1>
                <p className="text-muted-foreground">
                    Compare two text blocks side-by-side
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Original Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={text1}
                            onChange={(e) => {
                                setText1(e.target.value);
                                if (e.target.value && text2) {
                                    setDiff(diffLines(e.target.value, text2));
                                }
                            }}
                            placeholder="Enter original text..."
                            className="min-h-[300px] font-mono text-sm"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Modified Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={text2}
                            onChange={(e) => {
                                setText2(e.target.value);
                                if (text1 && e.target.value) {
                                    setDiff(diffLines(text1, e.target.value));
                                }
                            }}
                            placeholder="Enter modified text..."
                            className="min-h-[300px] font-mono text-sm"
                        />
                    </CardContent>
                </Card>
            </div>

            {diff.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Differences</CardTitle>
                        <CardDescription>Green = Added, Red = Removed, White = Unchanged</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-auto max-h-96">
                            {diff.map((part, index) => (
                                <div
                                    key={index}
                                    className={`${part.added
                                            ? "bg-green-500/20 text-green-700 dark:text-green-300"
                                            : part.removed
                                                ? "bg-red-500/20 text-red-700 dark:text-red-300"
                                                : ""
                                        } whitespace-pre-wrap`}
                                >
                                    {part.added && "+ "}
                                    {part.removed && "- "}
                                    {part.value}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
