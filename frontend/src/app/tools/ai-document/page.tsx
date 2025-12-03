"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AIDocumentGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("professional");
  const [format, setFormat] = useState("pdf");
  const [loading, setLoading] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  const generateDocument = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/v1/ai/document/generate", {
        title,
        description,
        tone,
        format
      });

      setGeneratedText(res.data.content);
      setPreviewOpen(true);

    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">AI Document Generator</h1>

      <div className="space-y-4">

        {/* Title */}
        <Input
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <Textarea
          rows={6}
          placeholder="Describe what the document should contain..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Tone */}
        <Select onValueChange={setTone} defaultValue="professional">
          <SelectTrigger>
            <SelectValue placeholder="Tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
          </SelectContent>
        </Select>

        {/* Format */}
        <Select onValueChange={setFormat} defaultValue="pdf">
          <SelectTrigger>
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="markdown">Markdown</SelectItem>
            <SelectItem value="text">Plain Text</SelectItem>
          </SelectContent>
        </Select>

        {/* Generate Button */}
        <Button onClick={generateDocument} disabled={loading}>
          {loading ? "Generating..." : "Generate Document"}
        </Button>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generated Document Preview</DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-wrap border p-4 rounded bg-gray-50 max-h-[60vh] overflow-y-auto">
            {generatedText}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
