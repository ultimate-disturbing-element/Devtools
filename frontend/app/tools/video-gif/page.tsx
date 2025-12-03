'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import api from "@/lib/api";

export default function VideoGIFPage() {
    const [file, setFile] = useState<File | null>(null);
    const [startTime, setStartTime] = useState(0);
    const [duration, setDuration] = useState(5);
    const [fps, setFps] = useState(10);
    const [loading, setLoading] = useState(false);

    const handleConvert = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("start_time", startTime.toString());
            formData.append("duration", duration.toString());
            formData.append("fps", fps.toString());

            const response = await api.post("/file/video/to-gif", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                responseType: "blob",
            });

            const url = URL.createObjectURL(response.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "output.gif";
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error converting video:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Video to GIF Converter</h1>
                <p className="text-muted-foreground">
                    Convert video files to animated GIFs
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Video to GIF</CardTitle>
                    <CardDescription>Upload a video and configure GIF settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => e.target.files && setFile(e.target.files[0])}
                            className="hidden"
                            id="video-upload"
                        />
                        <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload className="h-12 w-12 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {file ? file.name : "Upload video file"}
                            </p>
                        </label>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Start Time (s)</label>
                            <Input
                                type="number"
                                min="0"
                                value={startTime}
                                onChange={(e) => setStartTime(parseInt(e.target.value) || 0)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Duration (s)</label>
                            <Input
                                type="number"
                                min="1"
                                max="30"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value) || 5)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">FPS</label>
                            <Input
                                type="number"
                                min="5"
                                max="30"
                                value={fps}
                                onChange={(e) => setFps(parseInt(e.target.value) || 10)}
                            />
                        </div>
                    </div>

                    <Button onClick={handleConvert} className="w-full" disabled={!file || loading}>
                        {loading ? "Converting (this may take a while)..." : "Convert to GIF"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
