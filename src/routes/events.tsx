import { CalendarComponent } from "@/components/calendar"
import { useEffect, useState } from "react"

type Event = {
  id: string
  title: string
  description: string
  start: Date
  end: Date
}

export default function EventsRoute() {
  return (
    <main className="bg-secondary h-screen min-h-screen">
      <CalendarComponent />
    </main>
  )
}
