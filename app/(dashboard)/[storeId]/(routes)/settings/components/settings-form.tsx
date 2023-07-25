'use client'

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Store } from "@prisma/client"
import { Trash } from "lucide-react"

interface SettingsFormProps {
    initialData : Store
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  return (
    <div className="flex items-center justify-between">
        <Heading
        title="Settings"
        description="Manage store preferences" />        
        <Button
         variant="destructive"
         size="sm"
         onClick={() => {}}>
          <Trash className="h-4 w-4" />
        </Button>
    </div>
  )
}
