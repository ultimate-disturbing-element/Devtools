'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function ColorPickerPage() {
    const [color, setColor] = useState("#3b82f6");
    const [result, setResult] = useState<any>(null);
    const [palette, setPalette] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleConvert = async (colorValue: string) => {
        setLoading(true);
        try {
            const response = await api.post("/utils/color/convert", { color: colorValue });
            setResult(response.data);

            // Also get palette
            const paletteResponse = await api.post("/utils/color/palette", {
                base_color: colorValue,
                count: 5,
            });
            setPalette(paletteResponse.data);
        } catch (error) {
            console.error("Error converting color:", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-convert when color changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (color) {
                handleConvert(color);
            }
        }, 300); // Debounce for 300ms

        return () => clearTimeout(timer);
    }, [color]);

    return (
        <div className="container mx-auto p-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Color Picker & Converter</h1>
                <p className="text-muted-foreground">
                    Convert colors between formats and generate color palettes
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Color Input</CardTitle>
                        <CardDescription>Enter color in HEX, RGB, or HSL format</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Color</label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-20 h-10 cursor-pointer"
                                />
                                <Input
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    placeholder="#3b82f6 or rgb(59, 130, 246)"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {loading ? "🔄 Converting..." : "✓ Auto-converting"}
                            </p>
                        </div>

                        {result && (
                            <div className="space-y-3">
                                <div
                                    className="h-24 rounded-md border"
                                    style={{ backgroundColor: result.hex }}
                                />
                                <div className="space-y-2 text-sm font-mono">
                                    <div className="flex justify-between p-2 bg-muted rounded">
                                        <span className="text-muted-foreground">HEX:</span>
                                        <span className="font-semibold">{result.hex}</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-muted rounded">
                                        <span className="text-muted-foreground">RGB:</span>
                                        <span className="font-semibold">{result.rgb}</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-muted rounded">
                                        <span className="text-muted-foreground">HSL:</span>
                                        <span className="font-semibold">{result.hsl}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Color Palette</CardTitle>
                        <CardDescription>Shades and tints of your color</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {palette ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium mb-2">Shades (Darker)</p>
                                    <div className="grid grid-cols-5 gap-2">
                                        {palette.shades.map((shade: string, i: number) => (
                                            <div
                                                key={i}
                                                className="aspect-square rounded border cursor-pointer hover:scale-105 transition-transform"
                                                style={{ backgroundColor: shade }}
                                                title={shade}
                                                onClick={() => {
                                                    setColor(shade);
                                                    navigator.clipboard.writeText(shade);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium mb-2">Tints (Lighter)</p>
                                    <div className="grid grid-cols-5 gap-2">
                                        {palette.tints.map((tint: string, i: number) => (
                                            <div
                                                key={i}
                                                className="aspect-square rounded border cursor-pointer hover:scale-105 transition-transform"
                                                style={{ backgroundColor: tint }}
                                                title={tint}
                                                onClick={() => {
                                                    setColor(tint);
                                                    navigator.clipboard.writeText(tint);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-xs text-muted-foreground text-center">
                                    Click any color to copy and use it
                                </p>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-muted-foreground">
                                Convert a color to see its palette
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
