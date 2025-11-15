"use client";
import { useEffect } from "react";
import { Button } from "@heroui/react";
import { SunMoon } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useTheme } from "next-themes";

const ThemeChangeButton = () => {
  const { theme, setTheme } = useTheme();
  console.log("theme", theme);
  const toggleThemeMode = () => {
    console.log("theme", theme);
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  // // Apply the theme to <html> whenever it changes
  // useEffect(() => {
  // 	if (theme === "dark") {
  // 		document.documentElement.classList.add("dark");
  // 	} else {
  // 		document.documentElement.classList.remove("dark");
  // 	}
  // }, [theme]);

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
