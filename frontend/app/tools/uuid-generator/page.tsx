'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import api from "@/lib/api";

export default function UUIDGeneratorPage() {
    const [count, setCount] = useState(5);
    const [uuids, setUuids] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/utils/uuid/generate?count=${count}`);
            setUuids(response.data.uuids);
        } catch (error) {
            console.error("Error generating UUIDs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (uuid: string) => {
        navigator.clipboard.writeText(uuid);
    };

    const handleCopyAll = () => {
        navigator.clipboard.writeText(uuids.join('\n'));
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">UUID Generator</h1>
                <p className="text-muted-foreground">
                    Generate UUID v4 identifiers for your applications
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Generate UUIDs</CardTitle>
                    <CardDescription>Specify how many UUIDs to generate (1-100)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Input
                            type="number"
                            min="1"
                            max="100"
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                            className="max-w-[200px]"
                        />
                        <Button onClick={handleGenerate} disabled={loading}>
                            {loading ? "Generating..." : "Generate"}
                        </Button>
                    </div>

                    {uuids.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">
                                    Generated {uuids.length} UUID{uuids.length > 1 ? 's' : ''}
                                </p>
                                <Button variant="outline" size="sm" onClick={handleCopyAll}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy All
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {uuids.map((uuid, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-md bg-muted/50 font-mono text-sm"
                                    >
                                        <span>{uuid}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleCopy(uuid)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
