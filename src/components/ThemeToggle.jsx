
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-background/80 text-foreground border border-border/40 backdrop-blur-md hover:bg-accent/30 transition-all duration-200"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-background/95 backdrop-blur-md border border-border/40 text-foreground shadow-lg rounded-md min-w-[8rem] p-1"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer px-3 py-2 rounded-md text-sm hover:bg-accent/30 hover:text-primary transition"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer px-3 py-2 rounded-md text-sm hover:bg-accent/30 hover:text-primary transition"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer px-3 py-2 rounded-md text-sm hover:bg-accent/30 hover:text-primary transition"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  );
}
