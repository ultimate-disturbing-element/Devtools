'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import api from "@/lib/api";

export default function AIDocumentPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tone, setTone] = useState("professional");
    const [format, setFormat] = useState<"markdown" | "text">("markdown");
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await api.post("/ai/document/generate", {
                title,
                description,
                tone,
                format,
            });
            setResult(response.data.content);
        } catch (error: any) {
            console.error("Error generating document:", error);
            setResult(`Error: ${error.response?.data?.detail || "Failed to generate document"}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([result], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title || "document"}.${format === "markdown" ? "md" : "txt"}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto p-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">AI Document Generator</h1>
                <p className="text-muted-foreground">
                    Generate professional documents using AI (requires API key in backend .env)
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Document Details</CardTitle>
                        <CardDescription>Provide information about your document</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter document title..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what the document should contain..."
                                className="min-h-[200px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tone</label>
                                <select
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="professional">Professional</option>
                                    <option value="casual">Casual</option>
                                    <option value="formal">Formal</option>
                                    <option value="friendly">Friendly</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Format</label>
                                <select
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value as any)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="markdown">Markdown</option>
                                    <option value="text">Text</option>
                                </select>
                            </div>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            className="w-full"
                            disabled={loading || !title || !description}
                        >
                            {loading ? "Generating..." : "Generate Document"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Generated Document</CardTitle>
                        <CardDescription>
                            {result && (
                                <Button variant="outline" size="sm" onClick={handleDownload}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {result ? (
                            <Textarea
                                value={result}
                                readOnly
                                className="min-h-[400px] font-mono text-sm"
                            />
                        ) : (
                            <div className="min-h-[400px] flex items-center justify-center text-muted-foreground border rounded-md">
                                Generated document will appear here
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
