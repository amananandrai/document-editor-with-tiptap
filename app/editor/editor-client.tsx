"use client"

import dynamic from "next/dynamic"

const RichEditor = dynamic(() => import("../../components/editor/rich-editor").then((m) => m.RichEditor), {
  ssr: false,
})

export default function EditorClient() {
  return <RichEditor />
}
