import { createContext, useContext } from "react"

export type GlobalContent = {
  viewMode: string
  postMode: string
  // eslint-disable-next-line unused-imports/no-unused-vars
  setViewMode: (value: string) => void
  // eslint-disable-next-line unused-imports/no-unused-vars
  setPostMode: (value: string) => void
}
export const PaxContext = createContext<GlobalContent>({
  viewMode: "profile",
  postMode: "all",
  setViewMode: () => {},
  setPostMode: () => {},
})
export const usePaxContext = () => useContext(PaxContext)
