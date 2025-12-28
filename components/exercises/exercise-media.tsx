'use client'

import { useState } from 'react'

interface ExerciseMediaProps {
    src: string
    alt: string
}

export function ExerciseMedia({ src, alt }: ExerciseMediaProps) {
    const [error, setError] = useState(false)

    if (error) return null

    return (
        <div className="relative w-full h-full min-h-[300px] overflow-hidden group">
            <img
                src={src}
                alt={alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={() => setError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    )
}
