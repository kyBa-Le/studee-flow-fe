export function TeacherHeader() {
    return (
        <header className="bg-white shadow-sm px-6 py-4 border-b">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="font-bold text-orange-500">StudeeFlow</span>
            </div>
            <nav className="space-x-24 text-sm">
                <a href="#" className="text-gray-500 hover:text-orange-500 no-underline">
                Home
                </a>
                <a href="#" className="text-gray-500 hover:text-orange-500 no-underline">
                Profile
                </a>
            </nav>
            <div className="flex items-center gap-4">
                <i data-feather="help-circle" className="w-5 h-5"></i>
                <div className="relative">
                <i data-feather="bell" className="w-5 h-5"></i>
                </div>
            </div>
            </div>
        </header>
    );
}