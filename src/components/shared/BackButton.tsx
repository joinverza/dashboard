import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  to: string;
  label: string;
  className?: string;
}

export default function BackButton({ to, label, className }: BackButtonProps) {
  return (
    <Link href={to}>
      <button
        className={cn(
          "group inline-flex items-center gap-2 text-sm font-medium text-ent-text/60 hover:text-ent-text transition-colors duration-200 mb-4",
          className
        )}
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span>{label}</span>
      </button>
    </Link>
  );
}
