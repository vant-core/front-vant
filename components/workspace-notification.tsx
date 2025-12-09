"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderOpen, ChevronRight, CheckCircle2 } from "lucide-react"
import type { WorkspaceAction } from "@/types"
import { useRouter } from "next/navigation"

interface WorkspaceNotificationProps {
  workspace: WorkspaceAction
}

export default function WorkspaceNotification({ workspace }: WorkspaceNotificationProps) {
  const router = useRouter()

  const handleOpenFolder = () => {
    if (workspace.folder?.id) {
      router.push(`/workspace/folders/${workspace.folder.id}`)
    } else if (workspace.item?.folderId) {
      router.push(`/workspace/folders/${workspace.item.folderId}`)
    }
  }

  const handleOpenWorkspace = () => {
    router.push("/workspace")
  }

  // 🔥 CASO 1: Pasta criada
  if (workspace.action === "folder_created" && workspace.folder) {
    return (
      <Card className="mt-3 p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">
                ✨ Pasta criada com sucesso!
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl">{workspace.folder.icon}</span>
                <span className="font-semibold text-green-800 dark:text-green-200">
                  {workspace.folder.name}
                </span>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleOpenFolder}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              Abrir Pasta
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // 🔥 CASO 2: Item adicionado
  if (workspace.action === "item_added" && workspace.item && workspace.folder) {
    return (
      <Card className="mt-3 p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                ✅ Dados salvos na pasta
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{workspace.folder.icon}</span>
                  <span className="font-semibold text-blue-800 dark:text-blue-200">
                    {workspace.folder.name}
                  </span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 ml-10">
                  → {workspace.item.title}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleOpenFolder}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <FolderOpen className="w-4 h-4" />
                Ver Pasta
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleOpenWorkspace}
                className="border-blue-200 dark:border-blue-800"
              >
                Ver Workspace
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // 🔥 CASO 3: Pastas listadas
  if (workspace.action === "folders_listed" && workspace.folders) {
    return (
      <Card className="mt-3 p-4 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 space-y-2">
            <p className="font-medium text-purple-900 dark:text-purple-100">
              📂 {workspace.folders.length} pasta{workspace.folders.length !== 1 && 's'} encontrada{workspace.folders.length !== 1 && 's'}
            </p>
            <Button
              size="sm"
              onClick={handleOpenWorkspace}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Ver Workspace
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // 🔥 CASO 4: Items encontrados
  if (workspace.action === "items_searched" && workspace.items) {
    return (
      <Card className="mt-3 p-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 space-y-2">
            <p className="font-medium text-amber-900 dark:text-amber-100">
              🔍 {workspace.count} resultado{workspace.count !== 1 && 's'} encontrado{workspace.count !== 1 && 's'}
            </p>
            <Button
              size="sm"
              onClick={handleOpenWorkspace}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Ver Workspace
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // 🔥 CASO 5: Pasta deletada
  if (workspace.action === "folder_deleted") {
    return (
      <Card className="mt-3 p-4 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-red-900 dark:text-red-100">
              🗑️ Pasta deletada com sucesso
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return null
}