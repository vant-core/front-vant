"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, FolderOpen, ChevronRight, Loader2 } from "lucide-react"
import { getFolders, deleteFolder } from "@/services/api"
import type { FolderWithCount } from "@/types"
import { useRouter } from "next/navigation"

export default function FolderManagement() {
  const router = useRouter()

  const [folders, setFolders] = useState<FolderWithCount[]>([])
  const [rootFolders, setRootFolders] = useState<FolderWithCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  /* -------------------------------------------------------
     LOAD FOLDERS + BUILD HIERARCHY
  ------------------------------------------------------- */
  const loadFolders = async () => {
    try {
      setIsLoading(true)

      const data = await getFolders()

      // 🔥 Criar um mapa pra organizar pastas por parentId
      const map = new Map<string, FolderWithCount[]>()

      data.forEach((folder) => {
        const parent = folder.parentId ?? "root"
        if (!map.has(parent)) map.set(parent, [])
        map.get(parent)!.push(folder)
      })

      // 🔥 Pastas raiz = sem parentId
      const roots = map.get("root") ?? []

      // 🔥 Adicionar subpastas no objeto correto
      roots.forEach((folder) => {
        folder.subFolders = map.get(folder.id) ?? []
      })

      setFolders(data)
      setRootFolders(roots)
    } catch (error) {
      console.error("❌ Erro ao carregar pastas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFolders()
  }, [])

  /* -------------------------------------------------------
     DELETE FOLDER
  ------------------------------------------------------- */
  const handleDeleteFolder = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar a pasta "${name}"? Todos os items serão removidos.`)) {
      return
    }

    try {
      setDeletingId(id)
      await deleteFolder(id)

      // Atualiza o front-end
      setRootFolders(rootFolders.filter((f) => f.id !== id))
      alert("✅ Pasta deletada com sucesso!")
    } catch (error) {
      console.error("❌ Erro ao deletar pasta:", error)
      alert("Erro ao deletar pasta. Tente novamente.")
    } finally {
      setDeletingId(null)
    }
  }

  const handleOpenFolder = (folderId: string) => {
    router.push(`/workspace/folders/${folderId}`)
  }

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meu Workspace</h1>
          <p className="text-muted-foreground mt-1">
            Organize seus dados em pastas criadas automaticamente pela IA
          </p>
        </div>
        <Button onClick={loadFolders} variant="outline" className="flex items-center gap-2">
          Atualizar
        </Button>
      </div>

      <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          💡 <strong>Dica:</strong> As pastas são criadas automaticamente quando você conversa com a IA.
          Experimente: "Crie uma pasta Eventos/Coca-Cola/Financeiro".
        </p>
      </Card>

      {/* -------------------------------------------------------
         ROOT FOLDERS GRID (CORRETO AGORA)
      ------------------------------------------------------- */}
      {rootFolders.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <div className="space-y-3">
            <p className="text-muted-foreground">Nenhuma pasta ainda.</p>
            <p className="text-sm text-muted-foreground">
              Comece conversando com a IA para criar pastas automaticamente! 🚀
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {rootFolders.map((folder) => (
            <Card
              key={folder.id}
              className="p-5 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
              style={{ borderLeft: `4px solid ${folder.color}` }}
            >
              <div className="absolute -right-4 -bottom-4 text-8xl opacity-5 pointer-events-none">
                {folder.icon}
              </div>

              <div className="space-y-4 relative z-10">

                {/* HEADER */}
                <div className="flex items-start justify-between">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleOpenFolder(folder.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl">{folder.icon}</span>
                      <h3 className="font-bold text-foreground text-xl truncate group-hover:text-primary transition-colors">
                        {folder.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* INFO */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{folder.itemCount}</span>{" "}
                    item{folder.itemCount !== 1 && "s"}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {new Date(folder.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleOpenFolder(folder.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <FolderOpen className="w-4 h-4" />
                    Abrir
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteFolder(folder.id, folder.name)}
                    disabled={deletingId === folder.id}
                    className="flex items-center justify-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {deletingId === folder.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* SUBPASTAS (AGORA CORRETO) */}
                {folder.subFolders && folder.subFolders.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Subpastas:</p>

                    <div className="flex flex-wrap gap-2">
                      {folder.subFolders.map((sub) => (
                        <span
                          key={sub.id}
                          className="text-xs px-2 py-1 bg-secondary rounded-full flex items-center gap-1"
                        >
                          {sub.icon} {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </Card>
          ))}

        </div>
      )}
    </div>
  )
}
