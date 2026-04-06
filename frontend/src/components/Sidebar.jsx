const NAV_ITEMS = [
  { id: 'chat', icon: '💬', label: 'Chat' },
  { id: 'about', icon: 'ℹ️', label: 'About' },
  { id: 'contact', icon: '📞', label: 'Contact' },
]

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-20 md:w-56 bg-gradient-to-b from-indigo-800 to-indigo-950 min-h-screen flex flex-col text-white">
      {/* Logo */}
      <div className="px-3 py-6 text-center border-b border-indigo-700">
        <span className="text-3xl">🎓</span>
        <h1 className="hidden md:block text-sm font-bold mt-1 leading-tight">College Helpdesk</h1>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
              activeTab === item.id
                ? 'bg-indigo-600 text-white'
                : 'text-indigo-300 hover:bg-indigo-700/50 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="hidden md:inline text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-indigo-700 text-center">
        <span className="hidden md:inline text-xs text-indigo-400">AI Study Assistant</span>
        <span className="md:hidden text-xs text-indigo-400">AI</span>
      </div>
    </div>
  )
}

export default Sidebar
