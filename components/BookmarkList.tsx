'use client'

import { createClient } from '@/lib/supabase/client'
import { Bookmark } from '@/types/custom'
import { useEffect, useState } from 'react'
import { deleteBookmark } from '@/app/actions'
import { Trash2, ExternalLink, Globe } from 'lucide-react'

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const supabase = createClient()

    useEffect(() => {
        // Determine the current user to filter events if necessary (though RLS handles security)
        // We can just listen to the 'bookmarks' table changes.
        // Since we have RLS, we only receive events for rows we have access to.

        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((current) => [payload.new as Bookmark, ...current])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((current) => current.filter((b) => b.id !== payload.old.id))
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((current) => current.map((b) => b.id === payload.new.id ? (payload.new as Bookmark) : b))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const handleDelete = async (id: string) => {
        // Optimistic update
        setBookmarks(bookmarks.filter(b => b.id !== id))
        await deleteBookmark(id)
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
                    <Globe className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-300">No bookmarks yet</h3>
                <p className="text-gray-500 mt-2">Add your first bookmark above to get started.</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="group relative p-5 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
                >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => handleDelete(bookmark.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete bookmark"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400">
                            <Globe className="w-5 h-5" />
                        </div>
                    </div>

                    <h3 className="font-semibold text-lg text-white mb-1 truncate pr-8" title={bookmark.title}>
                        {bookmark.title}
                    </h3>

                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-blue-400 truncate block transition-colors flex items-center gap-1 group/link"
                    >
                        <span className="truncate">{bookmark.url}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                </div>
            ))}
        </div>
    )
}
