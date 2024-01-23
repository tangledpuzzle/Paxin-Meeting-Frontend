"use client"

import React, { ReactNode, useState } from "react"
import { PaxContext } from "@/context/context"

interface IProps {
  children: ReactNode
}

const App: React.FC<IProps> = ({ children }) => {
  const [viewMode, setViewMode] = useState<string>("profile")
  const [postMode, setPostMode] = useState<string>("all")
  const [currentPlan, setCurrentPlan] = useState<string>("BASIC")

  return (
    <PaxContext.Provider
      value={{
        viewMode,
        setViewMode,
        postMode,
        setPostMode,
        currentPlan,
        setCurrentPlan,
      }}
    >
      {children}
    </PaxContext.Provider>
  )
}

export default App
