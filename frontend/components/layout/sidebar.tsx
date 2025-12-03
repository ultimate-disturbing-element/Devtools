'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    FileText,
    GitCommit,
    GitPullRequest,
    Key,
    Shield,
    Fingerprint,
    Palette,
    FileJson,
    FileSpreadsheet,
    FileType,
    Image,
    Video,
    ScanText,
    Network,
    Route,
    Globe,
    Terminal,
    Archive,
    Monitor,
    Home,
    Sparkles
} from "lucide-react";

const toolCategories = [
    {
        name: "AI Tools",
        color: "from-violet-500 to-purple-600",
        tools: [
            { name: "AI Document", path: "/tools/ai-document", icon: FileText },
            { name: "AI Commit", path: "/tools/ai-commit", icon: GitCommit },
            { name: "PR Summary", path: "/tools/ai-pr-summary", icon: GitPullRequest },
        ],
    },
    {
        name: "Utilities",
        color: "from-blue-500 to-cyan-600",
        tools: [
            { name: "Password Strength", path: "/tools/password-strength", icon: Shield },
            { name: "Password Generator", path: "/tools/password-generator", icon: Key },
            { name: "UUID Generator", path: "/tools/uuid-generator", icon: Fingerprint },
            { name: "Color Picker", path: "/tools/color-picker", icon: Palette },
            { name: "JSON Formatter", path: "/tools/json-formatter", icon: FileJson },
            { name: "JSON Diff", path: "/tools/json-diff", icon: FileJson },
            { name: "Text Diff", path: "/tools/text-diff", icon: FileType },
            { name: "CSV to JSON", path: "/tools/csv-json", icon: FileSpreadsheet },
        ],
    },
    {
        name: "File & Media",
        color: "from-pink-500 to-rose-600",
        tools: [
            { name: "PDF Tools", path: "/tools/pdf-tools", icon: FileText },
            { name: "Image Converter", path: "/tools/image-converter", icon: Image },
            { name: "Video to GIF", path: "/tools/video-gif", icon: Video },
            { name: "OCR", path: "/tools/ocr", icon: ScanText },
        ],
    },
    {
        name: "Network",
        color: "from-orange-500 to-amber-600",
        tools: [
            { name: "Ping", path: "/tools/ping", icon: Network },
            { name: "Traceroute", path: "/tools/traceroute", icon: Route },
            { name: "IP Lookup", path: "/tools/ip-lookup", icon: Globe },
            { name: "CURL Builder", path: "/tools/curl-builder", icon: Terminal },
        ],
    },
    {
        name: "Other",
        color: "from-indigo-500 to-blue-600",
        tools: [
            { name: "HAR Viewer", path: "/tools/har-viewer", icon: Archive },
            { name: "Responsive Tester", path: "/tools/responsive-tester", icon: Monitor },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <div className="w-64 border-r border-border/50 bg-card/50 backdrop-blur-sm h-screen overflow-y-auto">
            {/* Logo/Brand */}
            <div className="p-6 border-b border-border/50">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-2 rounded-lg bg-gradient-primary shadow-lg group-hover:shadow-glow transition-all duration-300">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <div className="text-lg font-bold">DevTools</div>
                        <div className="text-xs text-muted-foreground">Platform</div>
                    </div>
                </Link>
            </div>

            {/* Home Link */}
            <div className="p-4">
                <Link
                    href="/"
                    className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300",
                        isHome
                            ? "bg-gradient-primary text-white"
                            : "hover:bg-accent/50 hover:text-accent-foreground"
                    )}
                >
                    <Home className="h-4 w-4" />
                    <span className="font-medium">Home</span>
                </Link>
            </div>

            {/* Tool Categories */}
            <nav className="space-y-6 p-4">
                {toolCategories.map((category) => (
                    <div key={category.name} className="space-y-2">
                        <div className="flex items-center gap-2 px-2">
                            <div className={`h-6 w-1 bg-gradient-to-b ${category.color} rounded-full`} />
                            <h3 className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
                                {category.name}
                            </h3>
                        </div>
                        <div className="space-y-1">
                            {category.tools.map((tool) => {
                                const Icon = tool.icon;
                                const isActive = pathname === tool.path;

                                return (
                                    <Link
                                        key={tool.path}
                                        href={tool.path}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300 group",
                                            isActive
                                                ? "bg-primary/10 text-primary font-medium border border-primary/20"
                                                : "hover:bg-accent/50 hover:text-accent-foreground hover:translate-x-1"
                                        )}
                                    >
                                        <Icon className={cn(
                                            "h-4 w-4 transition-colors duration-300",
                                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                        )} />
                                        <span className="flex-1">{tool.name}</span>
                                        {isActive && (
                                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 mt-auto border-t border-border/50">
                <div className="text-xs text-center text-muted-foreground">
                    <div className="font-semibold text-gradient">21+ Tools</div>
                    <div>Ready to use</div>
                </div>
            </div>
        </div>
    );
}
