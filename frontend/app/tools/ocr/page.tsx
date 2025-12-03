'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Copy } from "lucide-react";
import api from "@/lib/api";

export default function OCRPage() {
    const [file, setFile] = useState<File | null>(null);
    const [type, setType] = useState<"image" | "pdf">("image");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleOCR = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("lang", "eng");

            const endpoint = type === "image" ? "/file/ocr/image" : "/file/ocr/pdf";
            const response = await api.post(endpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResult(response.data.text);
        } catch (error) {
            console.error("Error performing OCR:", error);
            setResult("Error performing OCR. Make sure tesseract is installed on the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">OCR Tool</h1>
                <p className="text-muted-foreground">
                    Extract text from images and PDFs using OCR
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>OCR Text Extraction</CardTitle>
                    <CardDescription>Upload an image or PDF file</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Button
                            variant={type === "image" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setType("image")}
                        >
                            Image
                        </Button>
                        <Button
                            variant={type === "pdf" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setType("pdf")}
                        >
                            PDF
                        </Button>
                    </div>

                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <input
                            type="file"
                            accept={type === "image" ? "image/*" : ".pdf"}
                            onChange={(e) => e.target.files && setFile(e.target.files[0])}
                            className="hidden"
                            id="ocr-upload"
                        />
                        <label htmlFor="ocr-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload className="h-12 w-12 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {file ? file.name : `Upload ${type} file`}
                            </p>
                        </label>
                    </div>

                    <Button onClick={handleOCR} className="w-full" disabled={!file || loading}>
                        {loading ? "Extracting text..." : "Perform OCR"}
                    </Button>

                    {result && (
                        <>
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">Extracted Text:</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigator.clipboard.writeText(result)}
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </Button>
                            </div>
                            <textarea
                                value={result}
                                readOnly
                                className="w-full h-64 p-4 bg-muted rounded-md text-sm font-mono"
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
