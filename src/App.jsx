import { useState, useRef, useEffect } from 'react'
import "./index.css"
function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Memora Clone Demo' },
    { id: 2, title: 'How to use React' },
    { id: 3, title: 'JavaScript Basics' }
  ])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user'
    }
    setMessages([...messages, userMessage])
    setInput('')

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        text: `This is a simulated response to: "${input}"`,
        sender: 'ai'
      }
      setMessages(prevMessages => [...prevMessages, aiMessage])
    }, 1000)
  }

  const handleNewChat = () => {
    setMessages([])
  }

  return (
    <div className="flex h-screen w-full bg-white text-slate-500">
      {/* Sidebar */}
      <div className="w-64 bg-[#202123] text-white flex flex-col">
        <button className="m-3 p-3 border border-white/50 rounded bg-transparent flex items-center gap-2 cursor-pointer transition-colors duration-300 hover:bg-white/10 " onClick={handleNewChat}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          New chat
        </button>
        <div className="flex-1 overflow-y-auto p-3">
          {chatHistory.map(chat => (
            <div key={chat.id} className="p-3 mb-3 cursor-pointer overflow-hidden rounded text-ellipsis whitespace-nowrap hover:bg-white/10 transition-colors duration-300">
              {chat.title}
            </div>
          ))}
        </div>
        <div className="border-t border-white/25 p-3">
          <div className="user-info">Memora Clone</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 flex flex-col overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="empty-state">
              <h1 style={{ textAlign: 'center', marginTop: '100px' }}>Memora Clone</h1>
              <p style={{ textAlign: 'center', color: '#666' }}>Send a message to start a conversation</p>
            </div>
          ) : (
            messages.map(message => (
              <div key={message.id} className={`max-w-[80%] p-2 mb-5 flex w-full rounded-full ${message.sender === 'user' ? 'bg-gray-100': 'border border-gray-200'}`}>
                <div className={`h-full w-10 flex items-center justify-center rounded-full ${message.sender}-avatar`}>
                  {message.sender === 'user' ? 'U' : 'AI'}
                </div>
                <div className="px-2 py-2 text-slate-800">
                  {message.text}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex flex-col items-center border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="relative w-full max-w-2xl ">
            <textarea
              className="w-full py-3 px-5 rounded text-base resize-none h-[50px] border border-gray-300 max-h-48 overflow-y-auto shadow focus:outline-none focus:ring-1 focus:ring-green-400 transition-all duration-150"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <button 
              type="submit" 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={!input.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
          <div className="text-sm text-slate-400 mt-3 text-center  ">
            Memora Clone - For demonstration purposes only
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
