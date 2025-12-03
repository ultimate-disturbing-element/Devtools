'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import api from "@/lib/api";

export default function PDFToolsPage() {
    const [activeTab, setActiveTab] = useState<"merge" | "split" | "to-text" | "from-text">("merge");
    const [files, setFiles] = useState<File[]>([]);
    const [text, setText] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleMerge = async () => {
        if (files.length < 2) return;
        setLoading(true);
        try {
            const formData = new FormData();
            files.forEach((file) => formData.append("files", file));

            const response = await api.post("/file/pdf/merge", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                responseType: "blob",
            });

            const url = URL.createObjectURL(response.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "merged.pdf";
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error merging PDFs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToText = async () => {
        if (!files[0]) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", files[0]);

            const response = await api.post("/file/pdf/to-text", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResult(response.data.text);
        } catch (error) {
            console.error("Error extracting text:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">PDF Tools</h1>
                <p className="text-muted-foreground">
                    Merge, split, and convert PDF files
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex gap-2">
                        {(["merge", "to-text"] as const).map((tab) => (
                            <Button
                                key={tab}
                                variant={activeTab === tab ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === "merge" ? "Merge PDFs" : "PDF to Text"}
                            </Button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {activeTab === "merge" && (
                        <>
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="pdf-upload"
                                />
                                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                    <Upload className="h-12 w-12 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {files.length > 0 ? `${files.length} files selected` : "Upload PDF files to merge"}
                                    </p>
                                </label>
                            </div>

                            <Button onClick={handleMerge} className="w-full" disabled={files.length < 2 || loading}>
                                {loading ? "Merging..." : "Merge PDFs"}
                            </Button>
                        </>
                    )}

                    {activeTab === "to-text" && (
                        <>
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="pdf-text-upload"
                                />
                                <label htmlFor="pdf-text-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                    <Upload className="h-12 w-12 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {files[0] ? files[0].name : "Upload PDF to extract text"}
                                    </p>
                                </label>
                            </div>

                            <Button onClick={handleToText} className="w-full" disabled={!files[0] || loading}>
                                {loading ? "Extracting..." : "Extract Text"}
                            </Button>

                            {result && (
                                <div className="mt-4">
                                    <textarea
                                        value={result}
                                        readOnly
                                        className="w-full h-64 p-4 bg-muted rounded-md font-mono text-sm"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
