import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
    return (
        <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-glass">
            <div className="flex h-16 items-center px-6 justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Developer Tools
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Professional utilities for developers
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
