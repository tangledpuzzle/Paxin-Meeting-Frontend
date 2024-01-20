// import React, { useState } from "react"

import { IoQrCodeOutline } from "react-icons/io5"
import { LuScanLine } from "react-icons/lu"
import { RxCopy } from "react-icons/rx"
import QRCode from "react-qr-code"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface QRCodeModalProps {
  children?: React.ReactNode
  qrcode: string
}

export function QRCodeModal({ qrcode, children }: QRCodeModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" size="icon" className="rounded-full">
            <IoQrCodeOutline className="h-5 w-5 text-white" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-lg sm:mx-auto">
        <div className="flex flex-col items-center">
          <Badge
            variant="outline"
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          >
            <LuScanLine className="h-6 w-6" />
          </Badge>
          <div className="text-xl font-semibold">Scan the Code</div>
          <div className="text-center text-sm">
            Please Scan the QR Code Code inside the area. Scanning will start
            automatically.
          </div>
          <QRCode value={qrcode} className="mt-4" />
        </div>
        <div className="relative my-2 flex w-full justify-center">
          <div className="absolute top-[50%] z-[-1] h-[2px] w-full rounded-full bg-muted"></div>
          <div className="bg-background px-4">OR</div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Input
            type="text"
            placeholder="Enter the code"
            value={qrcode}
            readOnly
          />
          <Button variant="outline" size="icon">
            <RxCopy className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
