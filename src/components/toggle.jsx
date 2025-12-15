import { useEffect, useState } from "react";
import { Button } from "primereact/button";

export default function ThemeToggle() {
    const [dark, setDark] = useState(true);

    useEffect(() => {
        document.body.className = dark ? "dark-theme" : "light-theme";
    }, [dark]);

    return (
        <Button
            label={dark ? "☀️ Light mode" : "🌙 Dark mode"}
            onClick={() => setDark(!dark)}
            className="form-button"
        />
    );
}
