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
import type { Folder, FolderItem } from "@/types"
import { useRouter, useParams } from "next/navigation"

export default function FolderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const folderId = params.id as string

  const [folder, setFolder] = useState<Folder | null>(null)
  const [items, setItems] = useState<FolderItem[]>([])
  const [filteredItems, setFilteredItems] = useState<FolderItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // 🔥 Carrega pasta e items
  const loadFolderData = async () => {
    try {
      setIsLoading(true)
      const data = await getFolder(folderId)
      setFolder(data)
      // @ts-ignore - items vem do backend
      const itemsList = data.items || []
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

  // 🔥 Toggle expandir item
  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!folder) return null

  return (
    <div className="container mx-auto py-8 space-y-6">
      
      {/* Header com volta */}
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

      {/* Título da Pasta */}
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
                <span>📦 {items.length} item{items.length !== 1 && 's'}</span>
                <span>📅 Criada em {new Date(folder.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Barra de Busca */}
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

      {/* Lista de Items */}
      {filteredItems.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <p className="text-muted-foreground text-lg">
            {searchTerm 
              ? `Nenhum item encontrado para "${searchTerm}"`
              : "Nenhum item nesta pasta ainda. Use o chat para adicionar dados!"
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isExpanded = expandedItems.has(item.id)
            
            return (
              <Card 
                key={item.id}
                className="p-6 hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  
                  {/* Header do Item */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-2xl text-foreground mb-2">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {item.itemType && (
                          <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            {item.itemType}
                          </span>
                        )}
                        {item.tags && item.tags.map((tag, idx) => (
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

                  {/* Dados do Item (Preview) */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(item.content).slice(0, isExpanded ? undefined : 4).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            {key}
                          </span>
                          <span className="text-base text-foreground font-medium">
                            {typeof value === 'object' 
                              ? JSON.stringify(value, null, 2)
                              : String(value)
                            }
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Botão Expandir/Recolher */}
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

                  {/* Footer - Data de criação */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Criado em {new Date(item.createdAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Botão de Atualizar */}
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