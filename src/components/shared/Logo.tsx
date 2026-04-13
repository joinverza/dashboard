
import React from "react";
import ontiverLogo from "@/assets/ONTIVER Green.svg";

export const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <img src={ontiverLogo} alt="Ontiver logo" className={className} />
  );
};
