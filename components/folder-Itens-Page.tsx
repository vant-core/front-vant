"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Trash2, 
  Search, 
  Filter,
  Loader2,
  Calendar,
  Tag
} from "lucide-react"
import { getFolder, deleteItem } from "@/services/api"
import type { Folder, FolderItem } from "@/types"
import { useRouter, useParams } from "next/navigation"

export default function FolderItemsPage() {
  const router = useRouter()
  const params = useParams()
  const folderId = params.id as string

  const [folder, setFolder] = useState<Folder | null>(null)
  const [items, setItems] = useState<FolderItem[]>([])
  const [filteredItems, setFilteredItems] = useState<FolderItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<FolderItem | null>(null)

  // 🔥 Carrega pasta e items
  const loadFolderData = async () => {
    try {
      setIsLoading(true)
      const data = await getFolder(folderId)
      setFolder(data)
      // @ts-ignore - items vem do backend
      setItems(data.items || [])
      // @ts-ignore
      setFilteredItems(data.items || [])
    } catch (error) {
      console.error("❌ Erro ao carregar pasta:", error)
      alert("Erro ao carregar dados da pasta")
      router.push("/workspace")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFolderData()
  }, [folderId])

  // 🔥 Filtrar items por busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = items.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(term)
      const contentMatch = JSON.stringify(item.content).toLowerCase().includes(term)
      const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(term))
      return titleMatch || contentMatch || tagsMatch
    })

    setFilteredItems(filtered)
  }, [searchTerm, items])

  // 🔥 Deletar item
  const handleDeleteItem = async (id: string, title: string) => {
    if (!confirm(`Deletar "${title}"?`)) return

    try {
      setDeletingId(id)
      await deleteItem(id)
      const newItems = items.filter((item) => item.id !== id)
      setItems(newItems)
      setFilteredItems(newItems)
      alert("✅ Item deletado!")
    } catch (error) {
      console.error("❌ Erro ao deletar item:", error)
      alert("Erro ao deletar item")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!folder) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/workspace")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{folder.icon}</span>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{folder.name}</h1>
                {folder.description && (
                  <p className="text-muted-foreground mt-1">{folder.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {items.length} item{items.length !== 1 && 's'}
        </div>
      </div>

      {/* Busca */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar items por título, conteúdo ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-none shadow-none focus-visible:ring-0"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
            >
              Limpar
            </Button>
          )}
        </div>
      </Card>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <p className="text-muted-foreground">
            {searchTerm 
              ? `Nenhum item encontrado para "${searchTerm}"`
              : "Nenhum item nesta pasta ainda"
            }
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <Card 
              key={item.id}
              className="p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
            >
              <div className="space-y-3">
                {/* Header do item */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {item.title}
                    </h3>
                    {item.itemType && (
                      <span className="inline-block text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {item.itemType}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteItem(item.id, item.title)
                    }}
                    disabled={deletingId === item.id}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-2 py-1 bg-secondary rounded-full flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Preview do conteúdo */}
                <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
                  {Object.entries(item.content).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2 text-sm">
                      <span className="font-medium text-muted-foreground min-w-[100px]">
                        {key}:
                      </span>
                      <span className="text-foreground">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                  {Object.keys(item.content).length > 3 && (
                    <p className="text-xs text-muted-foreground italic">
                      + {Object.keys(item.content).length - 3} campos adicionais
                    </p>
                  )}
                </div>

                {/* Conteúdo expandido */}
                {selectedItem?.id === item.id && (
                  <div className="border-t border-border pt-3 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Todos os dados:</p>
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2 max-h-[300px] overflow-auto">
                      {Object.entries(item.content).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2 text-sm">
                          <span className="font-medium text-muted-foreground min-w-[120px]">
                            {key}:
                          </span>
                          <span className="text-foreground flex-1">
                            {typeof value === 'object' 
                              ? JSON.stringify(value, null, 2)
                              : String(value)
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleString('pt-BR')}
                  </div>
                  <button 
                    className="text-primary hover:underline"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedItem(selectedItem?.id === item.id ? null : item)
                    }}
                  >
                    {selectedItem?.id === item.id ? "Ocultar detalhes" : "Ver todos os dados"}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}