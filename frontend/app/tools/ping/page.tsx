'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import api from "@/lib/api";

export default function PingPage() {
    const [host, setHost] = useState("");
    const [count, setCount] = useState(4);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handlePing = async () => {
        setLoading(true);
        try {
            const response = await api.post("/network/ping", {
                host,
                count,
            });
            setResult(response.data);
        } catch (error: any) {
            console.error("Error pinging host:", error);
            setResult({ error: error.response?.data?.detail || "Ping failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Ping Tool</h1>
                <p className="text-muted-foreground">
                    Check network connectivity and latency
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ping Configuration</CardTitle>
                    <CardDescription>Enter hostname or IP address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium">Host</label>
                            <Input
                                value={host}
                                onChange={(e) => setHost(e.target.value)}
                                placeholder="google.com or 8.8.8.8"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Count</label>
                            <Input
                                type="number"
                                min="1"
                                max="10"
                                value={count}
                                onChange={(e) => setCount(parseInt(e.target.value) || 4)}
                            />
                        </div>
                    </div>

                    <Button onClick={handlePing} className="w-full" disabled={loading || !host}>
                        <Activity className="h-4 w-4 mr-2" />
                        {loading ? "Pinging..." : "Ping"}
                    </Button>

                    {result && !result.error && (
                        <div className="mt-6 space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-muted rounded-md">
                                    <p className="text-xs text-muted-foreground">Sent</p>
                                    <p className="text-2xl font-bold">{result.packets_sent}</p>
                                </div>
                                <div className="p-4 bg-muted rounded-md">
                                    <p className="text-xs text-muted-foreground">Received</p>
                                    <p className="text-2xl font-bold">{result.packets_received}</p>
                                </div>
                                <div className="p-4 bg-muted rounded-md">
                                    <p className="text-xs text-muted-foreground">Loss</p>
                                    <p className="text-2xl font-bold">{result.packet_loss}%</p>
                                </div>
                                <div className="p-4 bg-muted rounded-md">
                                    <p className="text-xs text-muted-foreground">Avg Latency</p>
                                    <p className="text-2xl font-bold">
                                        {result.avg_latency ? `${result.avg_latency.toFixed(1)}ms` : "N/A"}
                                    </p>
                                </div>
                            </div>

                            {result.min_latency && result.max_latency && (
                                <div className="p-4 bg-muted rounded-md">
                                    <p className="text-sm font-medium mb-2">Latency Stats</p>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Min:</span>{" "}
                                            <span className="font-semibold">{result.min_latency.toFixed(1)}ms</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Avg:</span>{" "}
                                            <span className="font-semibold">{result.avg_latency.toFixed(1)}ms</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Max:</span>{" "}
                                            <span className="font-semibold">{result.max_latency.toFixed(1)}ms</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {result && result.error && (
                        <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-md">
                            <p className="font-semibold">Error:</p>
                            <p className="text-sm">{result.error}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
