'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Route } from "lucide-react";
import api from "@/lib/api";

export default function TraceroutePage() {
    const [host, setHost] = useState("");
    const [maxHops, setMaxHops] = useState(30);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleTraceroute = async () => {
        setLoading(true);
        try {
            const response = await api.post("/network/traceroute", {
                host,
                max_hops: maxHops,
            });
            setResult(response.data);
        } catch (error: any) {
            console.error("Error running traceroute:", error);
            setResult({ error: error.response?.data?.detail || "Traceroute failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Traceroute Tool</h1>
                <p className="text-muted-foreground">
                    Trace the network path to a host
                </p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Traceroute Configuration</CardTitle>
                    <CardDescription>Enter destination hostname or IP</CardDescription>
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
                            <label className="text-sm font-medium">Max Hops</label>
                            <Input
                                type="number"
                                min="1"
                                max="64"
                                value={maxHops}
                                onChange={(e) => setMaxHops(parseInt(e.target.value) || 30)}
                            />
                        </div>
                    </div>

                    <Button onClick={handleTraceroute} className="w-full" disabled={loading || !host}>
                        <Route className="h-4 w-4 mr-2" />
                        {loading ? "Tracing route..." : "Traceroute"}
                    </Button>
                </CardContent>
            </Card>

            {result && !result.error && result.hops && (
                <Card>
                    <CardHeader>
                        <CardTitle>Route to {result.host}</CardTitle>
                        <CardDescription>{result.hops.length} hops</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {result.hops.map((hop: any, index: number) => (
                                <div
                                    key={index}
                                    className="p-3 bg-muted rounded-md flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-primary w-8">{hop.hop_number}</span>
                                        <div>
                                            <p className="font-mono text-sm">
                                                {hop.hostname || hop.ip || "*"}
                                            </p>
                                            {hop.ip && hop.hostname && (
                                                <p className="text-xs text-muted-foreground">{hop.ip}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {hop.latency ? `${hop.latency.toFixed(1)} ms` : "*"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {result && result.error && (
                <Card className="border-destructive">
                    <CardContent className="pt-6">
                        <p className="text-destructive">{result.error}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
