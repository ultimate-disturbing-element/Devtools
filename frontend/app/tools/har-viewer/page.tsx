'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ChevronDown, ChevronRight, Clock, HardDrive, Network, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import api from "@/lib/api";

export default function HARViewerPage() {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);
    const [expandedRequests, setExpandedRequests] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);

    const handleParse = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post("/har/parse", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResult(response.data);
        } catch (error) {
            console.error("Error parsing HAR file:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRequest = (index: number) => {
        const newExpanded = new Set(expandedRequests);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedRequests(newExpanded);
    };

    const getStatusIcon = (status: number) => {
        if (status >= 200 && status < 300) return <CheckCircle2 className="h-4 w-4 text-green-600" />;
        if (status >= 400) return <XCircle className="h-4 w-4 text-red-600" />;
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    };

    const parseUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            return {
                protocol: urlObj.protocol,
                hostname: urlObj.hostname,
                pathname: urlObj.pathname,
                search: urlObj.search,
                params: Array.from(urlObj.searchParams.entries())
            };
        } catch {
            return null;
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">HAR File Viewer</h1>
                <p className="text-muted-foreground">
                    Parse and analyze HAR (HTTP Archive) files with detailed request/response information
                </p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Upload HAR File</CardTitle>
                    <CardDescription>Select a .har or .json file to analyze network traffic</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                        <input
                            type="file"
                            accept=".har,.json"
                            onChange={(e) => e.target.files && setFile(e.target.files[0])}
                            className="hidden"
                            id="har-upload"
                        />
                        <label htmlFor="har-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload className="h-12 w-12 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {file ? file.name : "Click to upload HAR file"}
                            </p>
                            {file && (
                                <p className="text-xs text-muted-foreground">
                                    Size: {(file.size / 1024).toFixed(2)} KB
                                </p>
                            )}
                        </label>
                    </div>

                    <Button onClick={handleParse} className="w-full" disabled={!file || loading}>
                        {loading ? "Parsing..." : "Parse HAR File"}
                    </Button>
                </CardContent>
            </Card>

            {result && (
                <>
                    {/* Summary Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Network className="h-4 w-4 text-blue-600" />
                                    Total Requests
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{result.total_requests}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <HardDrive className="h-4 w-4 text-purple-600" />
                                    Total Size
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{(result.total_size / 1024).toFixed(2)} KB</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-green-600" />
                                    Total Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{(result.total_time / 1000).toFixed(2)}s</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    Avg. Response
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {(result.total_time / result.total_requests).toFixed(0)}ms
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Requests List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Network Requests</CardTitle>
                            <CardDescription>
                                Detailed view of all HTTP requests captured in the HAR file
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {result.requests.map((request: any, index: number) => {
                                    const urlInfo = parseUrl(request.url);
                                    return (
                                        <div key={index} className="border rounded-lg overflow-hidden">
                                            <div
                                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                                                onClick={() => toggleRequest(index)}
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    {expandedRequests.has(index) ? (
                                                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                                                    )}
                                                    {getStatusIcon(request.status)}
                                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md flex-shrink-0 ${request.method === "GET" ? "bg-blue-500/20 text-blue-700 dark:text-blue-400" :
                                                        request.method === "POST" ? "bg-green-500/20 text-green-700 dark:text-green-400" :
                                                            request.method === "PUT" ? "bg-orange-500/20 text-orange-700 dark:text-orange-400" :
                                                                request.method === "DELETE" ? "bg-red-500/20 text-red-700 dark:text-red-400" :
                                                                    "bg-gray-500/20 text-gray-700 dark:text-gray-400"
                                                        }`}>
                                                        {request.method}
                                                    </span>
                                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md flex-shrink-0 ${request.status >= 200 && request.status < 300 ? "bg-green-500/20 text-green-700 dark:text-green-400" :
                                                        request.status >= 300 && request.status < 400 ? "bg-blue-500/20 text-blue-700 dark:text-blue-400" :
                                                            request.status >= 400 ? "bg-red-500/20 text-red-700 dark:text-red-400" :
                                                                "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                                                        }`}>
                                                        {request.status}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium truncate">{urlInfo?.pathname || request.url}</div>
                                                        <div className="text-xs text-muted-foreground truncate">{urlInfo?.hostname}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 text-xs text-muted-foreground flex-shrink-0 ml-4">
                                                    <div className="text-right">
                                                        <div className="font-semibold">{(request.size / 1024).toFixed(2)} KB</div>
                                                        <div className="text-xs opacity-70">Size</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold">{request.time.toFixed(0)} ms</div>
                                                        <div className="text-xs opacity-70">Time</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {expandedRequests.has(index) && (
                                                <div className="border-t bg-muted/30">
                                                    <Tabs defaultValue="general" className="w-full">
                                                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                                            <TabsTrigger value="general" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                                                                General
                                                            </TabsTrigger>
                                                            <TabsTrigger value="headers" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                                                                Headers
                                                            </TabsTrigger>
                                                            {(urlInfo?.params?.length ?? 0) > 0 && (
                                                                <TabsTrigger value="params" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                                                                    Query Params
                                                                </TabsTrigger>
                                                            )}
                                                            <TabsTrigger value="timing" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                                                                Timing
                                                            </TabsTrigger>
                                                        </TabsList>

                                                        <TabsContent value="general" className="p-4 space-y-3">
                                                            <div>
                                                                <div className="text-xs font-semibold text-muted-foreground mb-1">Request URL</div>
                                                                <div className="text-sm font-mono bg-background p-2 rounded break-all">{request.url}</div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div>
                                                                    <div className="text-xs font-semibold text-muted-foreground mb-1">Method</div>
                                                                    <div className="text-sm font-semibold">{request.method}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs font-semibold text-muted-foreground mb-1">Status Code</div>
                                                                    <div className="text-sm font-semibold">{request.status}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs font-semibold text-muted-foreground mb-1">Content Size</div>
                                                                    <div className="text-sm">{(request.size / 1024).toFixed(2)} KB</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs font-semibold text-muted-foreground mb-1">Response Time</div>
                                                                    <div className="text-sm">{request.time.toFixed(2)} ms</div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="headers" className="p-4">
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <div className="text-sm font-semibold mb-2">Request Headers</div>
                                                                    <div className="bg-background rounded overflow-auto max-h-64">
                                                                        <table className="w-full text-xs">
                                                                            <tbody>
                                                                                {Object.entries(request.headers || {}).map(([key, value]: [string, any]) => (
                                                                                    <tr key={key} className="border-b last:border-0">
                                                                                        <td className="py-2 px-3 font-semibold text-muted-foreground w-1/3">{key}</td>
                                                                                        <td className="py-2 px-3 font-mono break-all">{String(value)}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        {(urlInfo?.params?.length ?? 0) > 0 && (
                                                            <TabsContent value="params" className="p-4">
                                                                <div className="bg-background rounded overflow-auto max-h-64">
                                                                    <table className="w-full text-xs">
                                                                        <thead>
                                                                            <tr className="border-b">
                                                                                <th className="py-2 px-3 text-left font-semibold">Parameter</th>
                                                                                <th className="py-2 px-3 text-left font-semibold">Value</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {urlInfo?.params.map(([key, value], i) => (
                                                                                <tr key={i} className="border-b last:border-0">
                                                                                    <td className="py-2 px-3 font-semibold text-muted-foreground">{key}</td>
                                                                                    <td className="py-2 px-3 font-mono break-all">{value}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </TabsContent>
                                                        )}

                                                        <TabsContent value="timing" className="p-4">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between p-3 bg-background rounded">
                                                                    <span className="text-sm font-medium">Total Duration</span>
                                                                    <span className="text-sm font-bold">{request.time.toFixed(2)} ms</span>
                                                                </div>
                                                                <div className="flex items-center justify-between p-3 bg-background rounded">
                                                                    <span className="text-sm font-medium">Transfer Size</span>
                                                                    <span className="text-sm font-bold">{(request.size / 1024).toFixed(2)} KB</span>
                                                                </div>
                                                                <div className="mt-4">
                                                                    <div className="text-xs font-semibold text-muted-foreground mb-2">Timing Waterfall</div>
                                                                    <div className="bg-background p-3 rounded">
                                                                        <div className="h-6 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded relative">
                                                                            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                                                                                {request.time.toFixed(0)} ms
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>
                                                    </Tabs>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
