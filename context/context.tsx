import { createContext, useContext } from "react"

export type GlobalContent = {
  viewMode: string
  postMode: string
  currentPlan: string
  socket: WebSocket | null
  // eslint-disable-next-line unused-imports/no-unused-vars
  setViewMode: (value: string) => void
  // eslint-disable-next-line unused-imports/no-unused-vars
  setPostMode: (value: string) => void
  // eslint-disable-next-line unused-imports/no-unused-vars
  setCurrentPlan: (value: string) => void
  // eslint-disable-next-line unused-imports/no-unused-vars
  setSocket: (value: WebSocket | null) => void
}
export const PaxContext = createContext<GlobalContent>({
  viewMode: "profile",
  postMode: "all",
  currentPlan: "BASIC",
  socket: null,
  setViewMode: () => {},
  setPostMode: () => {},
  setCurrentPlan: () => {},
  setSocket: () => {},
})
export const usePaxContext = () => useContext(PaxContext)
