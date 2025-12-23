"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Trash2, 
  Search, 
  Loader2,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp
} from "lucide-react"

import { getFolder, deleteItem } from "@/services/api"
import type { FolderItem, FolderWithCount } from "@/types"
import { useRouter, useParams } from "next/navigation"

export default function FolderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const folderId = params.id as string

  const [folder, setFolder] = useState<FolderWithCount | null>(null)
  const [items, setItems] = useState<FolderItem[]>([])
  const [filteredItems, setFilteredItems] = useState<FolderItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  /* -------------------------------------------------------
     LOAD FOLDER + ITEMS
  ------------------------------------------------------- */
  const loadFolderData = async () => {
    try {
      setIsLoading(true)
      const data = await getFolder(folderId)

      const itemsList = (data as any).items || []

      const folderWithCount: FolderWithCount = {
        ...data,
        itemCount: itemsList.length,
        subFolders: (data as any).subFolders
      }

      setFolder(folderWithCount)
      setItems(itemsList)
      setFilteredItems(itemsList)
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

  // 🔥 FIX 1: Auto-refresh quando a página ganha foco
  useEffect(() => {
    const handleFocus = () => {
      loadFolderData()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [folderId])

  // 🔥 FIX 1: Polling a cada 5 segundos para detectar mudanças
  useEffect(() => {
    const interval = setInterval(() => {
      loadFolderData()
    }, 5000) // Atualiza a cada 5 segundos

    return () => clearInterval(interval)
  }, [folderId])

  /* -------------------------------------------------------
     SEARCH FILTER
  ------------------------------------------------------- */
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

  /* -------------------------------------------------------
     EXPAND ITEM CONTENT
  ------------------------------------------------------- */
  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    newExpanded.has(itemId)
      ? newExpanded.delete(itemId)
      : newExpanded.add(itemId)

    setExpandedItems(newExpanded)
  }

  /* -------------------------------------------------------
     DELETE ITEM
  ------------------------------------------------------- */
  const handleDeleteItem = async (id: string, title: string) => {
    if (!confirm(`Deletar "${title}"?`)) return

    try {
      setDeletingId(id)
      await deleteItem(id)
      
      // 🔥 FIX 2: Remove o item dos estados imediatamente
      const newItems = items.filter((i) => i.id !== id)
      setItems(newItems)
      setFilteredItems(newItems)
      
      // 🔥 FIX 2: Atualiza o contador da pasta
      if (folder) {
        setFolder({
          ...folder,
          itemCount: newItems.length
        })
      }
      
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!folder) return null

  /* -------------------------------------------------------
     RENDER PAGE
  ------------------------------------------------------- */
  return (
    <div className="container mx-auto py-8 space-y-6">

      {/* VOLTAR */}
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
      </div>

      {/* CARD PRINCIPAL DA PASTA */}
      <Card className="p-6" style={{ borderLeft: `6px solid ${folder.color}` }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-6xl">{folder.icon}</span>

            <div>
              <h1 className="text-4xl font-bold text-foreground">{folder.name}</h1>

              {folder.description && (
                <p className="text-muted-foreground mt-2 text-lg">{folder.description}</p>
              )}

              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span>📦 {items.length} item{items.length !== 1 && "s"}</span>
                <span>
                  📅 Criada em {" "}
                  {new Date(folder.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------- */}
        {/* SUBPASTAS COMO CARDS */}
        {/* -------------------------------------------- */}
        {folder.subFolders && folder.subFolders.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3 font-medium flex items-center gap-2">
              📁 Subpastas
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {folder.subFolders.map((sub) => (
                <Card
                  key={sub.id}
                  onClick={() => router.push(`/workspace/folders/${sub.id}`)}
                  className="cursor-pointer p-4 flex items-center gap-4 rounded-xl hover:shadow-md transition border-l-4"
                  style={{ borderColor: sub.color || folder.color }}
                >
                  <div className="text-3xl">{sub.icon}</div>

                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">{sub.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Clique para abrir
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* CAMPO DE BUSCA */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por título, conteúdo ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-none shadow-none focus-visible:ring-0"
          />
          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
              Limpar
            </Button>
          )}
        </div>
      </Card>

      {/* LISTA DE ITEMS */}
      {filteredItems.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <p className="text-muted-foreground text-lg">
            {searchTerm
              ? `Nenhum item encontrado para "${searchTerm}"`
              : "Nenhum item nesta pasta ainda. Use o chat para adicionar dados!"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isExpanded = expandedItems.has(item.id)

            return (
              <Card key={item.id} className="p-6 hover:shadow-lg transition-all">
                <div className="space-y-4">

                  {/* HEADER DO ITEM */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-2xl text-foreground mb-2">{item.title}</h3>

                      <div className="flex flex-wrap gap-2">
                        {item.itemType && (
                          <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            {item.itemType}
                          </span>
                        )}

                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground gap-1"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id, item.title)}
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

                  {/* CONTEÚDO DO ITEM */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(item.content)
                        .slice(0, isExpanded ? undefined : 4)
                        .map(([key, value]) => (
                          <div key={key} className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                              {key}
                            </span>
                            <span className="text-base text-foreground font-medium">
                              {typeof value === "object"
                                ? JSON.stringify(value, null, 2)
                                : String(value)}
                            </span>
                          </div>
                        ))}
                    </div>

                    {Object.keys(item.content).length > 4 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(item.id)}
                        className="w-full mt-3 flex items-center justify-center gap-2"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Mostrar menos
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Ver todos os {Object.keys(item.content).length} campos
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Criado em{" "}
                      {new Date(item.createdAt).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>

                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* BOTÃO ATUALIZAR */}
      <div className="flex justify-center pt-4">
        <Button
          variant="outline"
          onClick={loadFolderData}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Carregando...
            </>
          ) : (
            "🔄 Atualizar"
          )}
        </Button>
      </div>
    </div>
  )
}