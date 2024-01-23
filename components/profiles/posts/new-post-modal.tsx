"use client"

import { TfiWrite } from "react-icons/tfi"
import ReactSelect from "react-select"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/common/file-uploader"

import "react-quill/dist/quill.snow.css"
import "@/styles/editor.css"

const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false

interface NewPostModalProps {
  children: React.ReactNode
}

const cityOptions = [
  {
    label: "Moscow",
    value: "moscow",
  },
  {
    label: "Singapore",
    value: "singapore",
  },
]

const categoryOptions = [
  {
    label: "Moscow",
    value: "moscow",
  },
  {
    label: "Singapore",
    value: "singapore",
  },
]

const hashtagOptions = [
  {
    label: "Moscow",
    value: "moscow",
  },
  {
    label: "Singapore",
    value: "singapore",
  },
]

export function NewPostModal({ children }: NewPostModalProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video", "code-block"],
      ["clean"],
    ],
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "align",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "code-block",
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90%] w-full overflow-y-auto sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
        <DialogHeader className="flex flex-row items-center gap-3">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <TfiWrite className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle>Writing a Post</DialogTitle>
            <DialogDescription>
              You can write a new post here.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" name="title" className="" />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="subtitle" className="text-right">
              Subtitle
            </Label>
            <Input id="subtitle" name="subtitle" className="" />
          </div>
          <div>
            <Label htmlFor="subtitle" className="text-right">
              Content
            </Label>
            <ReactQuill
              theme="snow"
              modules={modules}
              formats={formats}
              placeholder="Type your content here..."
              className="placeholder:text-white"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="city">City</Label>
              <ReactSelect
                isMulti
                name="city"
                id="city"
                options={cityOptions}
                classNames={{
                  input: () => "dark:text-white text-black",
                  control: () =>
                    "!flex !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50",
                  option: () =>
                    "!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer",
                  menu: () => "!bg-muted",
                }}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <ReactSelect
                isMulti
                name="category"
                id="category"
                options={categoryOptions}
                classNames={{
                  input: () => "dark:text-white text-black",
                  control: () =>
                    "!flex !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50",
                  option: () =>
                    "!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer",
                  menu: () => "!bg-muted",
                }}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="hashtag">Hashtags</Label>
              <ReactSelect
                isMulti
                name="hashtag"
                id="hashtag"
                options={hashtagOptions}
                classNames={{
                  input: () => "dark:text-white text-black",
                  control: () =>
                    "!flex !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50",
                  option: () =>
                    "!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer",
                  menu: () => "!bg-muted",
                }}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" className="" />
              </div>
              <div>
                <Label htmlFor="numberofdays">Number of Days</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                      <SelectItem value="90">90</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div>
          <ImageUpload />
        </div>

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
