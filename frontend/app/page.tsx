'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
    FileText, GitCommit, Shield, Key, Palette, FileJson,
    Image, Network, Archive, Monitor, ArrowRight, Sparkles,
    Zap, Code2, Star
} from "lucide-react";

const featuredTools = [
    {
        title: "AI Document Generator",
        description: "Generate professional documents using AI",
        icon: FileText,
        href: "/tools/ai-document",
        gradient: "from-violet-500 to-purple-600",
    },
    {
        title: "Password Tools",
        description: "Check strength and generate secure passwords",
        icon: Shield,
        href: "/tools/password-strength",
        gradient: "from-blue-500 to-cyan-600",
    },
    {
        title: "JSON Formatter",
        description: "Format, validate, and compare JSON data",
        icon: FileJson,
        href: "/tools/json-formatter",
        gradient: "from-emerald-500 to-teal-600",
    },
    {
        title: "Image Converter",
        description: "Convert images between formats and resize",
        icon: Image,
        href: "/tools/image-converter",
        gradient: "from-pink-500 to-rose-600",
    },
    {
        title: "Network Tools",
        description: "Ping, traceroute, and IP lookup utilities",
        icon: Network,
        href: "/tools/ping",
        gradient: "from-orange-500 to-amber-600",
    },
    {
        title: "HAR Viewer",
        description: "Analyze HAR files from network requests",
        icon: Archive,
        href: "/tools/har-viewer",
        gradient: "from-indigo-500 to-blue-600",
    },
];

const stats = [
    { label: "Tools", value: "21+", icon: Zap },
    { label: "Categories", value: "5", icon: Code2 },
    { label: "Ready to Use", value: "100%", icon: Star },
];

export default function Home() {
    return (
        <div className="relative overflow-hidden">
            {/* Hero Section with Enhanced Background */}
            <section className="relative container mx-auto px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    {/* Mesh Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />

                    {/* Animated Gradient Orbs */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-br from-primary/25 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                    {/* Radial Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/50 to-background" />
                </div>

                <div className="max-w-5xl mx-auto text-center animate-fade-in relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">21+ Professional Developer Tools</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        Developer Tools{" "}
                        <span className="text-gradient">Platform</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                        A comprehensive collection of developer utilities for AI, coding, file processing, and networking.
                        Everything you need in one beautiful platform.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-12">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={stat.label}
                                    className="animate-slide-up p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                                    <div className="text-3xl md:text-4xl font-bold mb-1 text-gradient">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>

                    <Link
                        href="#tools"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-primary text-white rounded-full font-semibold hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
                    >
                        Explore Tools
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>

            {/* Featured Tools Section */}
            <section id="tools" className="container mx-auto px-8 pb-16">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Featured <span className="text-gradient">Tools</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Most popular and powerful tools to supercharge your development workflow
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredTools.map((tool, index) => {
                        const Icon = tool.icon;
                        return (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                className="animate-scale"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <Card className="group h-full border-border/50 backdrop-blur-sm bg-card/80 transition-all duration-300 hover:border-primary/50 overflow-hidden relative">
                                    {/* Gradient overlay on hover */}
                                    <div className={`absolute transition-opacity duration-300`} />

                                    <CardHeader className="relative">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.gradient} shadow-lg`}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                                            {tool.title}
                                        </CardTitle>
                                        <CardDescription className="leading-relaxed">
                                            {tool.description}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* All Tools Section */}
            <section className="container mx-auto px-8 pb-20">
                <Card className="backdrop-blur-sm bg-card/80 border-border/50">
                    <CardHeader>
                        <CardTitle className="text-2xl md:text-3xl">
                            All <span className="text-gradient">Available Tools</span>
                        </CardTitle>
                        <CardDescription className="text-base">
                            Browse our complete collection of developer utilities
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-8 w-1 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full" />
                                    <h3 className="font-bold text-lg">AI Tools</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-muted-foreground ml-3">
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                                        AI Document Generator
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                                        AI Commit Message
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                                        PR Summary Generator
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full" />
                                    <h3 className="font-bold text-lg">Utilities</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-muted-foreground ml-3">
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        Password Tools
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        UUID Generator
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        Color Picker
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        JSON Tools
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        CSV Converter
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-8 w-1 bg-gradient-to-b from-pink-500 to-rose-600 rounded-full" />
                                    <h3 className="font-bold text-lg">File & Media</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-muted-foreground ml-3">
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                                        PDF Tools
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                                        Image Converter
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                                        Video to GIF
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                                        OCR Tools
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-8 w-1 bg-gradient-to-b from-orange-500 to-amber-600 rounded-full" />
                                    <h3 className="font-bold text-lg">Network</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-muted-foreground ml-3">
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                        Ping Tool
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                        Traceroute
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                        IP Lookup
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                        CURL Builder
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
                                    <h3 className="font-bold text-lg">Diff Tools</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-muted-foreground ml-3">
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Text Diff
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        JSON Diff
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-full" />
                                    <h3 className="font-bold text-lg">Other</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-muted-foreground ml-3">
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                        HAR Viewer
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                        Responsive Tester
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
