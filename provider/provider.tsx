"use client"

import React, { ReactNode, useEffect, useState } from "react"
import { PaxContext } from "@/context/context"
import axios from "axios"

interface IProps {
  children: ReactNode
}

const App: React.FC<IProps> = ({ children }) => {
  const [viewMode, setViewMode] = useState<string>("profile")
  const [postMode, setPostMode] = useState<string>("all")
  const [currentPlan, setCurrentPlan] = useState<string>("BASIC")
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    if (process.browser) {
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "wss:"
      const _socket = new WebSocket(
        `${wsProtocol}//go.paxintrade.com/socket.io/`
      )

      _socket.onmessage = (received) => {
        console.log("Socket message: ", received.data)
        try {
          const data = JSON.parse(received.data)

          if (data?.session) {
            console.log("Socket message: ", data?.session)
            axios.defaults.headers.common["session"] = data?.session
          }
        } catch (error) {}
      }

      const intervalId = setInterval(() => {
        if (_socket.readyState === WebSocket.OPEN) {
          _socket.send(
            JSON.stringify({
              messageType: "ping",
              data: [],
            })
          )
        }
      }, 5000)

      setSocket(_socket)

      return () => {
        clearInterval(intervalId)
        _socket.close()
      }
    }
  }, [])

  return (
    <PaxContext.Provider
      value={{
        viewMode,
        setViewMode,
        postMode,
        setPostMode,
        currentPlan,
        setCurrentPlan,
        socket,
        setSocket,
      }}
    >
      {children}
    </PaxContext.Provider>
  )
}

export default App
