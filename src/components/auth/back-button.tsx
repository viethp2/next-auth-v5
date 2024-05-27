"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ href, label }) => {
  return (
    <Button variant="link" className="font-normal w-full" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};
