'use client'

import { addBookmark } from '@/app/actions'
import { useRef, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'

export default function AddBookmark() {
    const formRef = useRef<HTMLFormElement>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        try {
            await addBookmark(formData)
            formRef.current?.reset()
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form
            ref={formRef}
            action={handleSubmit}
            className="w-full max-w-2xl mx-auto mb-10 p-6 bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl transition-all hover:bg-gray-800/40"
        >
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        name="title"
                        placeholder="Bookmark Title"
                        required
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 text-white"
                    />
                </div>
                <div className="flex-[2]">
                    <input
                        name="url"
                        type="url"
                        placeholder="https://example.com"
                        required
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 text-white"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[120px]"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            <span>Add</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
