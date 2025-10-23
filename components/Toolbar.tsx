// components/Toolbar.tsx
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog } from '@headlessui/react'
import { Editor } from '@tiptap/react'
import { useState } from 'react'
import { Button } from 'react-daisyui'

export default function Toolbar({ editor }: { editor: Editor | null }) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)

  if (!editor) return null

  return (
    <div className="toolbar">
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • Bullet
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. Number
      </button>
      <select onChange={(e) =>
        editor.chain().focus().updateAttributes('listItem', {
          style: e.target.value,
        }).run()
      }>
        <option value="disc">Disc</option>
        <option value="circle">Circle</option>
        <option value="square">Square</option>
        <option value="decimal">Decimal</option>
        <option value="lower-roman">Lower Roman</option>
      </select>
      <Button variant="ghost" size="sm" onClick={() => setIsLinkDialogOpen(true)}>
        Link
      </Button>
      <LinkDialog 
        editor={editor} 
        isOpen={isLinkDialogOpen} 
        setIsOpen={setIsLinkDialogOpen} 
      />
    </div>
  )
}

interface LinkDialogProps {
  editor: Editor | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const LinkDialog = ({ editor, isOpen, setIsOpen }: LinkDialogProps) => {
  const handleClose = () => {
    setIsOpen(false);
    editor?.commands.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const url = (form.elements.namedItem('url') as HTMLInputElement).value;
    
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                placeholder="https://example.com"
                type="url"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Insert Link</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};