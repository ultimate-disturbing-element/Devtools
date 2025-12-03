'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smartphone, Tablet, Monitor, Tv, MonitorSmartphone } from "lucide-react";

const devices = [
    { name: "Mobile", width: 375, height: 667, icon: Smartphone },
    { name: "Tablet", width: 768, height: 1024, icon: Tablet },
    { name: "Laptop", width: 1440, height: 900, icon: Monitor },
    { name: "Desktop", width: 1920, height: 1080, icon: MonitorSmartphone },
    { name: "4K", width: 3840, height: 2160, icon: Tv },
];

export default function ResponsiveTesterPage() {
    const [url, setUrl] = useState("");
    const [selectedDevice, setSelectedDevice] = useState(devices[0]);
    const [loadUrl, setLoadUrl] = useState("");

    const handleLoad = () => {
        if (url) {
            setLoadUrl(url.startsWith("http") ? url : `https://${url}`);
        }
    };

    // Calculate scaled dimensions to fit on screen while maintaining aspect ratio
    const getScaledDimensions = () => {
        const maxWidth = 1400; // Maximum width for preview
        const maxHeight = 900; // Maximum height for preview

        let { width, height } = selectedDevice;

        // Scale down if needed
        const widthScale = width > maxWidth ? maxWidth / width : 1;
        const heightScale = height > maxHeight ? maxHeight / height : 1;
        const scale = Math.min(widthScale, heightScale);

        return {
            width: Math.floor(width * scale),
            height: Math.floor(height * scale),
            scale: scale < 1 ? scale : 1
        };
    };

    const scaled = getScaledDimensions();

    return (
        <div className="container mx-auto p-8 max-w-[1600px]">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Responsive Design Tester</h1>
                <p className="text-muted-foreground">
                    Test how your website looks on different screen sizes and devices
                </p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Website URL</CardTitle>
                    <CardDescription>Enter a URL to preview across different viewports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="example.com"
                            onKeyDown={(e) => e.key === "Enter" && handleLoad()}
                        />
                        <Button onClick={handleLoad} disabled={!url}>
                            Load
                        </Button>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {devices.map((device) => {
                            const Icon = device.icon;
                            return (
                                <Button
                                    key={device.name}
                                    variant={selectedDevice.name === device.name ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedDevice(device)}
                                    className="gap-2"
                                >
                                    <Icon className="h-4 w-4" />
                                    {device.name}
                                    <span className="ml-1 text-xs opacity-70">
                                        {device.width}×{device.height}
                                    </span>
                                </Button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {loadUrl && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{selectedDevice.name} Preview</CardTitle>
                                <CardDescription>
                                    Viewport: {selectedDevice.width} × {selectedDevice.height} pixels
                                    {scaled.scale < 1 && (
                                        <span className="ml-2 text-xs">
                                            (Scaled to {Math.round(scaled.scale * 100)}% for display)
                                        </span>
                                    )}
                                </CardDescription>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Display: {scaled.width} × {scaled.height}px
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-8 rounded-lg flex items-center justify-center min-h-[600px]">
                            <div
                                className="bg-white dark:bg-black border-8 border-gray-800 dark:border-gray-700 rounded-2xl overflow-hidden shadow-2xl"
                                style={{
                                    width: scaled.width,
                                    height: scaled.height,
                                }}
                            >
                                <iframe
                                    src={loadUrl}
                                    className="w-full h-full"
                                    title={`${selectedDevice.name} view`}
                                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                    style={{
                                        width: selectedDevice.width,
                                        height: selectedDevice.height,
                                        transform: `scale(${scaled.scale})`,
                                        transformOrigin: 'top left',
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
