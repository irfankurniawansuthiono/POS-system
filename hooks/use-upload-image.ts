import axios from "axios";
import { useCallback, useState } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
type UseUploadImageProps = {
    pathName: string;
    onSuccess?: (url: string) => void;
    onError?: (error: Error) => void;
};

export function useUploadImage({ pathName, onSuccess, onError }: UseUploadImageProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const uploadImage = useCallback(
        async (file: File) => {
            try {
                setIsUploading(true);
                setProgress(0);

                const formData = new FormData();
                formData.append("file", file);
                formData.append("pathname", pathName);

                const res = await axios.post("/api/upload", formData, {
                    onUploadProgress(progressEvent) {
                        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                        setProgress(percent);
                    },
                });

                onSuccess?.(res.data.url);
                return res.data.url;
            } catch (err: any) {
                onError?.(err);
                throw err;
            } finally {
                setIsUploading(false);
                setTimeout(() => {
                    setProgress(0);
                }, 800);
            }
        },
        [pathName, onSuccess, onError],
    );

    return {
        uploadImage,
        progress,
        isUploading,
    };
}
