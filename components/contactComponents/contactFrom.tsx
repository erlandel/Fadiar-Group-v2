"use client"

import React from "react"

import { useState } from "react"
import { Send } from "lucide-react"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    alert("¡Mensaje enviado correctamente!")
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div className="bg-gray/5 rounded-xl shadow-2xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary border-b-2 border-accent pb-2 inline-block mb-6">
        Envíenos un Mensaje
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
          
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Su nombre"
              required
              className="w-full px-4 py-2.5 border border-gray rounded-lg text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            />
          </div>
          <div className="space-y-2">
          
            <input
              id="email"
              name="email"
              type="email"
              placeholder="su@email.com"
              required
              className="w-full px-4 py-2.5 border border-gray rounded-lg text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
       
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Asunto del mensaje"
            required
            className="w-full px-4 py-2.5 border border-gray rounded-lg text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
          />
        </div>

        <div className="space-y-2">
      
          <textarea
            id="message"
            name="message"
            placeholder="Escriba su mensaje aquí..."
            rows={4}
            required
            className="w-full px-4 py-2.5 border border-gray rounded-lg text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent hover:bg-accent disabled:bg-accent/60 text-primary font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            "Enviando..."
          ) : (
            <>
              <Send className="w-5 h-5" strokeWidth={3} />
              Enviar Mensaje
            </>
          )}
        </button>
      </form>
    </div>
  )
}
