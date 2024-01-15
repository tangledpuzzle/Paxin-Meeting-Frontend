"use client"

import React, { ReactNode, useState } from "react"
import { PaxContext } from "@/context/context"

interface IProps {
  children: ReactNode
}

const App: React.FC<IProps> = ({ children }) => {
  const [viewMode, setViewMode] = useState<string>("profile")

  return (
    <PaxContext.Provider
      value={{
        viewMode,
        setViewMode,
      }}
    >
      {children}
    </PaxContext.Provider>
  )
}

export default App
