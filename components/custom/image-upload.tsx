"use client";

import { appToast } from "@/components/custom/app-toast";
import { useUploadThing } from "@/components/uploadthing";
import { useDeleteImage } from "@/hooks/use-remove-image";
import { useUploadImage } from "@/hooks/use-upload-image";
import { cn } from "@/lib/utils";
import { useDropzone } from "@uploadthing/react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

// ==================== SINGLE IMAGE UPLOAD ====================

interface SingleImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove: () => void;
    disabled?: boolean;
    className?: string;
    pathName: string; // Add pathName prop
}

export function SingleImageUpload({
    value,
    onChange,
    onRemove,
    disabled,
    className,
    pathName,
}: SingleImageUploadProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const { uploadImage, isUploading, progress } = useUploadImage({
        pathName: pathName,
    });

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const url = await uploadImage(acceptedFiles[0]);
                onChange(url);
                setIsUploaded(true);
            }
        },
        [uploadImage, onChange],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".svg"] },
        maxFiles: 1,
        disabled: disabled || isUploading,
    });

    const { deleteImage } = useDeleteImage({
        onSuccess: () => {
            onRemove();
            setIsUploaded(false);
        },
        onError: err => {
            appToast.error(err.message);
        },
    });

    const handleRemove = async () => {
        if (!value || isDeleting) return;
        setIsDeleting(true);
        try {
            await deleteImage(value);
        } catch {
            appToast.error("Failed to delete image");
        } finally {
            setIsDeleting(false);
        }
    };

    // If image exists, show preview with delete button
    if (value) {
        return (
            <div
                className={cn(
                    "relative group rounded-xl overflow-hidden border border-border bg-muted/30",
                    "w-full aspect-video",
                    className,
                )}
            >
                <Image
                    src={value}
                    alt="Uploaded image"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Success gradient */}
                <div
                    className={cn(
                        "absolute inset-x-0 top-0 h-24 z-1 transition-all duration-700",
                        isUploaded
                            ? "bg-linear-to-b from-emerald-500/80 via-emerald-400/30 to-transparent opacity-100"
                            : "opacity-0",
                    )}
                />

                {/* Dark hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

                {/* Delete button */}
                <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isDeleting || disabled}
                    className={cn(
                        "absolute top-2 right-2 z-10",
                        "flex items-center justify-center",
                        "size-8 rounded-full",
                        "bg-destructive/90 text-destructive-foreground",
                        "opacity-0 group-hover:opacity-100",
                        "hover:bg-destructive hover:scale-110",
                        "transition-all duration-200",
                        "shadow-lg backdrop-blur-sm",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                >
                    {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
                </button>
            </div>
        );
    }

    // Dropzone
    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative cursor-pointer rounded-xl border-2 border-dashed",
                "w-full aspect-video",
                "flex flex-col items-center justify-center gap-3",
                "transition-all duration-300 ease-out",
                isDragActive
                    ? "border-primary bg-primary/5 scale-[1.02] shadow-lg shadow-primary/10"
                    : "border-muted-foreground/25 bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
                (disabled || isUploading) && "opacity-50 cursor-not-allowed",
                className,
            )}
        >
            <input {...getInputProps()} />
            {/* Liquid progress overlay */}
            {isUploading ? (
                <div className="absolute inset-0 z-20 overflow-hidden">
                    <div
                        className="absolute bottom-0 left-0 w-full bg-emerald-500/70 backdrop-blur-sm transition-all duration-300"
                        style={{
                            height: `${progress}%`,
                        }}
                    />

                    {/* Animated waves */}
                    <div
                        className="absolute left-0 w-[200%] h-10 bg-emerald-400/40 blur-md animate-pulse"
                        style={{
                            bottom: `calc(${progress}% - 20px)`,
                        }}
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-black/50 backdrop-blur-md px-4 py-2 text-white text-sm font-semibold">
                            {progress}%
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div
                        className={cn(
                            "rounded-full p-3 transition-colors duration-300",
                            isDragActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                        )}
                    >
                        <ImagePlus className="size-8" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-sm font-medium text-foreground">
                            {isDragActive ? "Drop image here" : "Drag & drop image"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            or{" "}
                            <span className="text-primary font-medium underline underline-offset-2">
                                click to select
                            </span>
                        </p>
                        <p className="text-xs text-muted-foreground/60">PNG, JPG, WEBP • Max 4MB</p>
                    </div>
                </>
            )}
        </div>
    );
}

// ==================== MULTIPLE IMAGE UPLOAD ====================

interface MultiImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    disabled?: boolean;
    maxFiles?: number;
    className?: string;
}

export function MultiImageUpload({ value = [], onChange, disabled, maxFiles = 5, className }: MultiImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [deletingUrls, setDeletingUrls] = useState<Set<string>>(new Set());

    const { startUpload } = useUploadThing("productImages", {
        onClientUploadComplete: res => {
            if (res) {
                const newUrls = res.map(r => r.ufsUrl);
                onChange([...value, ...newUrls]);
                appToast.success(`${res.length} images uploaded successfully`);
            }
            setIsUploading(false);
        },
        onUploadError: (error: Error) => {
            appToast.error(`Upload failed: ${error.message}`);
            setIsUploading(false);
        },
        onUploadBegin: () => {
            setIsUploading(true);
        },
    });

    const remainingSlots = maxFiles - value.length;

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > remainingSlots) {
                appToast.error(`Max ${maxFiles} images. Remaining slots: ${remainingSlots}`);
                return;
            }
            if (acceptedFiles.length > 0) {
                startUpload(acceptedFiles);
            }
        },
        [startUpload, remainingSlots, maxFiles],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".svg"] },
        maxFiles: remainingSlots,
        disabled: disabled || isUploading || remainingSlots <= 0,
    });

    const handleRemove = async (url: string) => {
        if (deletingUrls.has(url)) return;
        setDeletingUrls(prev => new Set(prev).add(url));
        try {
            const res = await fetch("/api/uploadthing/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            if (!res.ok) throw new Error("Failed to delete");
            onChange(value.filter(v => v !== url));
            appToast.success("Image deleted successfully");
        } catch {
            appToast.error("Failed to delete image");
        } finally {
            setDeletingUrls(prev => {
                const next = new Set(prev);
                next.delete(url);
                return next;
            });
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Image grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {value.map((url, index) => {
                        const isThisDeleting = deletingUrls.has(url);
                        return (
                            <div
                                key={`${url}-${index}`}
                                className="relative group rounded-xl overflow-hidden border border-border bg-muted/30 aspect-video"
                            >
                                <Image
                                    src={url}
                                    alt={`Uploaded image ${index + 1}`}
                                    fill
                                    className={cn(
                                        "object-cover transition-all duration-300",
                                        isThisDeleting ? "opacity-40 blur-sm scale-95" : "group-hover:scale-105",
                                    )}
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                                {/* Delete button */}
                                <button
                                    type="button"
                                    onClick={() => handleRemove(url)}
                                    disabled={isThisDeleting || disabled}
                                    className={cn(
                                        "absolute top-1.5 right-1.5 z-10",
                                        "flex items-center justify-center",
                                        "size-7 rounded-full",
                                        "bg-destructive/90 text-destructive-foreground",
                                        "opacity-0 group-hover:opacity-100",
                                        "hover:bg-destructive hover:scale-110",
                                        "transition-all duration-200",
                                        "shadow-lg backdrop-blur-sm",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                    )}
                                >
                                    {isThisDeleting ? (
                                        <Loader2 className="size-3.5 animate-spin" />
                                    ) : (
                                        <X className="size-3.5" />
                                    )}
                                </button>
                                {/* Index badge */}
                                <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md">
                                    {index + 1}/{value.length}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Upload dropzone */}
            {remainingSlots > 0 && (
                <div
                    {...getRootProps()}
                    className={cn(
                        "relative cursor-pointer rounded-xl border-2 border-dashed",
                        "w-full py-8",
                        "flex flex-col items-center justify-center gap-3",
                        "transition-all duration-300 ease-out",
                        isDragActive
                            ? "border-primary bg-primary/5 scale-[1.01] shadow-lg shadow-primary/10"
                            : "border-muted-foreground/25 bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
                        (disabled || isUploading) && "opacity-50 cursor-not-allowed",
                    )}
                >
                    <input {...getInputProps()} />
                    {isUploading ? (
                        <>
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                                <Loader2 className="size-8 text-primary animate-spin" />
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Uploading image...</p>
                        </>
                    ) : (
                        <>
                            <div
                                className={cn(
                                    "rounded-full p-2.5 transition-colors duration-300",
                                    isDragActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                                )}
                            >
                                <Upload className="size-6" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium text-foreground">
                                    {isDragActive ? "Drop image here" : "Add image"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Drag & drop or{" "}
                                    <span className="text-primary font-medium underline underline-offset-2">
                                        click to select
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground/60">
                                    Max {maxFiles} images • PNG, JPG, WEBP • Max 4MB/image •{remainingSlots} slots
                                    remaining
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
