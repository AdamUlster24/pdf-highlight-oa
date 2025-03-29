// app/components/ChatSidebar.tsx
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send } from "lucide-react"
import { Button } from "./Button"

type Message = {
  role: "user" | "assistant"
  content: string
}

interface ChatSidebarProps {
  pdfUploaded: boolean
  isOpen: boolean
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ pdfUploaded, isOpen}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return

    // Add user message
    const newMessages: Message[] = [...messages, { role: "user" as const, content: inputMessage }]
    setMessages(newMessages)
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      // Temporary AI response
      const aiResponse = {
        role: "assistant" as const,
        content: `Here's information about "${inputMessage}" from the PDF.`,
      }
      setMessages([...newMessages, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  // Auto-scroll to the bottom of chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Add welcome message when PDF is uploaded
  useEffect(() => {
    if (pdfUploaded && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "I've analyzed your PDF. Ask me any questions about its content!",
        },
      ])
    }
  }, [pdfUploaded, messages.length])

  if (!isOpen) return null

  return (
    <div className="bg-white border-l border-gray-200 w-80 flex flex-col h-[100vh] shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="font-medium">Chat with PDF</h3>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        {pdfUploaded ? (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">Upload a PDF to start chatting</div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <form
          className="flex items-center space-x-2"
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
        >
          <input
            ref={chatInputRef}
            type="text"
            placeholder="Ask about the PDF..."
            className="flex-grow px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={!pdfUploaded}
          />
          <Button type="submit" size="icon" disabled={!pdfUploaded || !inputMessage.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}