'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import api from "@/lib/api";

export default function ImageConverterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState("png");
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [loading, setLoading] = useState(false);

    const handleConvert = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("target_format", format);
            if (width) formData.append("width", width);
            if (height) formData.append("height", height);

            const response = await api.post("/file/image/convert", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                responseType: "blob",
            });

            const url = URL.createObjectURL(response.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = `converted.${format}`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error converting image:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Image Converter</h1>
                <p className="text-muted-foreground">
                    Convert images between formats and resize
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Image Conversion</CardTitle>
                    <CardDescription>Upload an image and convert it</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files && setFile(e.target.files[0])}
                            className="hidden"
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload className="h-12 w-12 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {file ? file.name : "Upload image file"}
                            </p>
                        </label>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Format</label>
                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="png">PNG</option>
                                <option value="jpg">JPG</option>
                                <option value="webp">WebP</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Width (optional)</label>
                            <Input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                placeholder="Auto"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Height (optional)</label>
                            <Input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="Auto"
                            />
                        </div>
                    </div>

                    <Button onClick={handleConvert} className="w-full" disabled={!file || loading}>
                        {loading ? "Converting..." : "Convert Image"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
