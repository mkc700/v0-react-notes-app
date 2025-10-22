"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Trash2, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Nueva Nota",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
    setIsEditing(true)
    setEditTitle(newNote.title)
    setEditContent(newNote.content)
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
    if (selectedNote?.id === id) {
      setSelectedNote(null)
      setIsEditing(false)
    }
  }

  const startEditing = (note: Note) => {
    setSelectedNote(note)
    setIsEditing(true)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const saveEdit = () => {
    if (selectedNote) {
      setNotes(
        notes.map((note) =>
          note.id === selectedNote.id
            ? {
                ...note,
                title: editTitle,
                content: editContent,
                updatedAt: Date.now(),
              }
            : note,
        ),
      )
      setSelectedNote({
        ...selectedNote,
        title: editTitle,
        content: editContent,
        updatedAt: Date.now(),
      })
      setIsEditing(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    if (selectedNote) {
      setEditTitle(selectedNote.title)
      setEditContent(selectedNote.content)
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Mis Notas</h1>
            <Button onClick={createNewNote} size="icon" className="rounded-full">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-muted-foreground text-sm">
                {searchQuery ? "No se encontraron notas" : "No hay notas. ¡Crea una nueva!"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-accent/50",
                    selectedNote?.id === note.id && "bg-accent/30 border-primary",
                  )}
                  onClick={() => {
                    setSelectedNote(note)
                    setIsEditing(false)
                  }}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold line-clamp-1 text-balance">
                        {note.title || "Sin título"}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNote(note.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2 text-pretty">
                      {note.content || "Sin contenido"}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(note.updatedAt)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="border-b border-border p-4 flex items-center justify-between bg-card">
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-2xl font-bold border-none shadow-none px-0 focus-visible:ring-0"
                    placeholder="Título de la nota"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-foreground text-balance">{selectedNote.title}</h2>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  Última modificación: {formatDate(selectedNote.updatedAt)}
                </p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={saveEdit} size="icon" variant="default">
                      <Check className="h-5 w-5" />
                    </Button>
                    <Button onClick={cancelEdit} size="icon" variant="outline">
                      <X className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => startEditing(selectedNote)} size="icon" variant="outline">
                    <Edit2 className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {isEditing ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-full resize-none border-none shadow-none focus-visible:ring-0 text-base leading-relaxed"
                  placeholder="Escribe tu nota aquí..."
                />
              ) : (
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed text-pretty">
                    {selectedNote.content || "Sin contenido"}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-6">
                  <Edit2 className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Selecciona una nota</h3>
              <p className="text-muted-foreground mb-6">Elige una nota de la lista o crea una nueva</p>
              <Button onClick={createNewNote} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Crear Nueva Nota
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
