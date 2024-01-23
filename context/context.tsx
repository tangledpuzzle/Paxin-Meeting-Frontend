import { createContext, useContext } from "react"

export type GlobalContent = {
  viewMode: string
  postMode: string
  currentPlan: string
  // eslint-disable-next-line unused-imports/no-unused-vars
  setViewMode: (value: string) => void
  // eslint-disable-next-line unused-imports/no-unused-vars
  setPostMode: (value: string) => void
  // eslint-disable-next-line unused-imports/no-unused-vars
  setCurrentPlan: (value: string) => void
}
export const PaxContext = createContext<GlobalContent>({
  viewMode: "profile",
  postMode: "all",
  currentPlan: "BASIC",
  setViewMode: () => {},
  setPostMode: () => {},
  setCurrentPlan: () => {},
})
export const usePaxContext = () => useContext(PaxContext)
