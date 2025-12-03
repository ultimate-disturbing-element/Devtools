'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function JSONDiffPage() {
    const [json1, setJson1] = useState("");
    const [json2, setJson2] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDiff = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.post("/utils/json/diff", {
                json1,
                json2,
            });
            setResult(response.data);
        } catch (error: any) {
            setError(error.response?.data?.detail || "Failed to compare JSON");
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = result && (
        Object.keys(result.added).length > 0 ||
        Object.keys(result.removed).length > 0 ||
        Object.keys(result.modified).length > 0
    );

    return (
        <div className="container mx-auto p-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">JSON Diff Viewer</h1>
                <p className="text-muted-foreground">
                    Compare two JSON objects and see the differences
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Original JSON</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={json1}
                            onChange={(e) => setJson1(e.target.value)}
                            placeholder='{"name": "John", "age": 30}'
                            className="min-h-[300px] font-mono text-sm"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Modified JSON</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={json2}
                            onChange={(e) => setJson2(e.target.value)}
                            placeholder='{"name": "Jane", "age": 30, "city": "NYC"}'
                            className="min-h-[300px] font-mono text-sm"
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="mb-6">
                <Button onClick={handleDiff} className="w-full" disabled={loading || !json1 || !json2}>
                    {loading ? "Comparing..." : "Compare JSON"}
                </Button>
            </div>

            {error && (
                <Card className="mb-6 border-destructive">
                    <CardContent className="pt-6">
                        <p className="text-destructive text-sm">{error}</p>
                    </CardContent>
                </Card>
            )}

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-green-500">Added</CardTitle>
                            <CardDescription>{Object.keys(result.added).length} keys</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {Object.keys(result.added).length > 0 ? (
                                <pre className="text-sm bg-muted p-4 rounded-md overflow-auto max-h-64">
                                    {JSON.stringify(result.added, null, 2)}
                                </pre>
                            ) : (
                                <p className="text-muted-foreground text-sm">No additions</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-red-500">Removed</CardTitle>
                            <CardDescription>{Object.keys(result.removed).length} keys</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {Object.keys(result.removed).length > 0 ? (
                                <pre className="text-sm bg-muted p-4 rounded-md overflow-auto max-h-64">
                                    {JSON.stringify(result.removed, null, 2)}
                                </pre>
                            ) : (
                                <p className="text-muted-foreground text-sm">No removals</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-orange-500">Modified</CardTitle>
                            <CardDescription>{Object.keys(result.modified).length} keys</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {Object.keys(result.modified).length > 0 ? (
                                <pre className="text-sm bg-muted p-4 rounded-md overflow-auto max-h-64">
                                    {JSON.stringify(result.modified, null, 2)}
                                </pre>
                            ) : (
                                <p className="text-muted-foreground text-sm">No modifications</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {result && !hasChanges && (
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="text-green-500 font-medium">✓ JSON objects are identical</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
