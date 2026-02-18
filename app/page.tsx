import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BookmarkList from '@/components/BookmarkList'
import AddBookmark from '@/components/AddBookmark'
import { signOut } from './actions'
import { LogOut } from 'lucide-react'

export default async function Home() {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white selection:bg-blue-500/30">

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500"></div>
                        <span className="font-bold text-xl tracking-tight">Bookmark Manager</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400 hidden sm:block">
                            {user.email}
                        </span>
                        <form action={signOut}>
                            <button
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                                title="Sign out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="pt-24 px-4 pb-20 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4">
                        Your Digital Library
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Save, organize, and access your favorite links from anywhere. Real-time updates across all your devices.
                    </p>
                </div>

                <AddBookmark />

                <BookmarkList initialBookmarks={bookmarks ?? []} />
            </div>

        </main>
    )
}
