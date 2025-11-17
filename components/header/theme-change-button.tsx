"use client";
import { Button } from "@heroui/react";
import { SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeChangeButton = () => {
  const { theme, setTheme } = useTheme();
  const toggleThemeMode = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <div>
      <Button
        onPress={toggleThemeMode}
        variant="flat"
        aria-label="Toggle Theme"
        isIconOnly>
        <SunMoon />
      </Button>
    </div>
  );
};

export default ThemeChangeButton;
