'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Terminal } from "lucide-react";
import api from "@/lib/api";

export default function CURLBuilderPage() {
    const [url, setUrl] = useState("");
    const [method, setMethod] = useState("GET");
    const [headers, setHeaders] = useState("");
    const [body, setBody] = useState("");
    const [auth, setAuth] = useState("");
    const [result, setResult] = useState("");

    const handleBuild = async () => {
        try {
            // Parse headers
            const parsedHeaders: Record<string, string> = {};
            if (headers) {
                headers.split("\n").forEach((line) => {
                    const [key, ...valueParts] = line.split(":");
                    if (key && valueParts.length) {
                        parsedHeaders[key.trim()] = valueParts.join(":").trim();
                    }
                });
            }

            const response = await api.post("/network/curl/build", {
                url,
                method,
                headers: parsedHeaders,
                body: body || undefined,
                auth: auth || undefined,
            });
            setResult(response.data.command);
        } catch (error) {
            console.error("Error building CURL command:", error);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
    };

    return (
        <div className="container mx-auto p-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">CURL Command Builder</h1>
                <p className="text-muted-foreground">
                    Generate CURL commands from form inputs
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Request Configuration</CardTitle>
                        <CardDescription>Configure your HTTP request</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">URL *</label>
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://api.example.com/endpoint"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Method</label>
                            <select
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option>GET</option>
                                <option>POST</option>
                                <option>PUT</option>
                                <option>PATCH</option>
                                <option>DELETE</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Headers (one per line)</label>
                            <Textarea
                                value={headers}
                                onChange={(e) => setHeaders(e.target.value)}
                                placeholder="Content-Type: application/json&#10;Authorization: Bearer token"
                                className="min-h-[100px] font-mono text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Body (JSON)</label>
                            <Textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder='{"key": "value"}'
                                className="min-h-[100px] font-mono text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Authentication (user:password)</label>
                            <Input
                                value={auth}
                                onChange={(e) => setAuth(e.target.value)}
                                placeholder="username:password"
                            />
                        </div>

                        <Button onClick={handleBuild} className="w-full" disabled={!url}>
                            <Terminal className="h-4 w-4 mr-2" />
                            Build CURL Command
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Generated Command</CardTitle>
                        <CardDescription>
                            {result && (
                                <Button variant="outline" size="sm" onClick={handleCopy}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </Button>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {result ? (
                            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm font-mono whitespace-pre-wrap break-all">
                                {result}
                            </pre>
                        ) : (
                            <div className="h-96 flex items-center justify-center text-muted-foreground">
                                Generated CURL command will appear here
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
