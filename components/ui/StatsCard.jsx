import React from "react";
import Card from "../atoms/Card";
import { BookOpen } from "lucide-react";

const StatsCard = ({ icon, value, label }) => {
  const IconComponent = icon;

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-[#0F7490]/10 rounded-xl flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-[#0F7490]" />
        </div>
        <div>
          <p className="text-2xl font-bold text-[#202938]">{value}</p>
          <p className="text-sm text-[#202938]/60">{label}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
