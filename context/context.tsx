import { createContext, useContext } from "react"

export type GlobalContent = {
  viewMode: string
  // eslint-disable-next-line unused-imports/no-unused-vars
  setViewMode: (value: string) => void
}
export const PaxContext = createContext<GlobalContent>({
  viewMode: "profile",
  setViewMode: () => {},
})
export const usePaxContext = () => useContext(PaxContext)
