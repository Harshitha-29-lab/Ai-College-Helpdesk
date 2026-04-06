import { useState } from 'react'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'

function App() {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {activeTab === 'chat' && <Chat />}

        {activeTab === 'about' && (
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">About Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The <strong>AI College Helpdesk</strong> is a smart assistant built to help students get quick answers about exams, subjects, timings, fees, library, and results.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Powered by <strong>Google Gemini AI</strong> with a keyword fallback system, this helpdesk is available 24/7 and saves all conversations for future reference.
            </p>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mt-4">
              <h3 className="font-semibold text-indigo-700 mb-2">Tech Stack</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Frontend: React + Tailwind CSS</li>
                <li>• Backend: Python FastAPI</li>
                <li>• AI: Google Gemini</li>
                <li>• Database: Supabase (PostgreSQL)</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6">Contact Information</h2>
            <div className="space-y-4">
              {[
                { icon: '🏫', label: 'Administration Office', detail: 'Room 1, Ground Floor — 9 AM to 4 PM' },
                { icon: '💳', label: 'Accounts Office', detail: 'Room 12 — 10 AM to 1 PM' },
                { icon: '📖', label: 'Library', detail: 'Building B — 9 AM to 5 PM' },
                { icon: '📞', label: 'Helpline', detail: '+91-XXXXXXXXXX' },
                { icon: '📧', label: 'Email', detail: 'helpdesk@college.edu' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
