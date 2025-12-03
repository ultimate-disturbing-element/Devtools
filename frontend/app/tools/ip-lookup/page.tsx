'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import api from "@/lib/api";

export default function IPLookupPage() {
    const [ip, setIp] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleLookup = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/network/ip/${ip}`);
            setResult(response.data);
        } catch (error: any) {
            console.error("Error looking up IP:", error);
            setResult({ error: error.response?.data?.detail || "IP lookup failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">IP Lookup Tool</h1>
                <p className="text-muted-foreground">
                    Get geolocation and ISP information for any IP address
                </p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>IP Address</CardTitle>
                    <CardDescription>Enter an IPv4 address to lookup</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        placeholder="8.8.8.8"
                    />

                    <Button onClick={handleLookup} className="w-full" disabled={loading || !ip}>
                        <Globe className="h-4 w-4 mr-2" />
                        {loading ? "Looking up..." : "Lookup IP"}
                    </Button>
                </CardContent>
            </Card>

            {result && !result.error && (
                <Card>
                    <CardHeader>
                        <CardTitle>IP Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="p-3 bg-muted rounded-md">
                                    <p className="text-xs text-muted-foreground mb-1">IP Address</p>
                                    <p className="font-mono font-semibold">{result.ip}</p>
                                </div>

                                <div className="p-3 bg-muted rounded-md">
                                    <p className="text-xs text-muted-foreground mb-1">Country</p>
                                    <p className="font-semibold">{result.country || "N/A"}</p>
                                </div>

                                <div className="p-3 bg-muted rounded-md">
                                    <p className="text-xs text-muted-foreground mb-1">Region</p>
                                    <p className="font-semibold">{result.region || "N/A"}</p>
                                </div>

                                <div className="p-3 bg-muted rounded-md">
                                    <p className="text-xs text-muted-foreground mb-1">City</p>
                                    <p className="font-semibold">{result.city || "N/A"}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3 bg-muted rounded-md">
                                    <p className="text-xs text-muted-foreground mb-1">ISP</p>
                                    <p className="font-semibold">{result.isp || "N/A"}</p>
                                </div>

                                <div className="p-3 bg-muted rounded-md">
                                    <p className="text-xs text-muted-foreground mb-1">ASN</p>
                                    <p className="font-semibold">{result.asn || "N/A"}</p>
                                </div>

                                {result.latitude && result.longitude && (
                                    <div className="p-3 bg-muted rounded-md">
                                        <p className="text-xs text-muted-foreground mb-1">Coordinates</p>
                                        <p className="font-mono text-sm">
                                            {result.latitude.toFixed(4)}, {result.longitude.toFixed(4)}
                                        </p>
                                    </div>
                                )}
                            </div>
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
