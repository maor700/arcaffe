import { useState, useEffect } from "react"

export const useCssAsStringLoader = (cssFiles: string[]): string => {
    const [finalCss, setFinalCss] = useState<string>('');

    useEffect(() => {
        cssFiles.forEach(cssDataUrl => {
            setFinalCss(finalCss + (atob(cssDataUrl.split("base64,")?.[1] ?? '')));
        });
    },[]);

    return finalCss
}