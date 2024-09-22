'use client'

import React, { useState } from 'react'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, addMonths, addWeeks, isSameMonth, isSameDay, parseISO, setHours, setMinutes } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type Event = {
  id: string
  title: string
  start: Date
  end: Date
}

export function CalendarComponent() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [view, setView] = useState<'month' | 'week'>('month')
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' })
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)

  const onDateClick = (day: Date) => {
    setSelectedDate(day)
  }

  const changeMonth = (amount: number) => {
    setCurrentDate(prevDate => addMonths(prevDate, amount))
  }

  const changeWeek = (amount: number) => {
    setCurrentDate(prevDate => addWeeks(prevDate, amount))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (newEvent.title && newEvent.start && newEvent.end) {
      const newEventObj = {
        id: Date.now().toString(),
        title: newEvent.title,
        start: parseISO(newEvent.start),
        end: parseISO(newEvent.end)
      }
      setEvents(prevEvents => [...prevEvents, newEventObj])
      setNewEvent({ title: '', start: '', end: '' })
      setIsAddEventOpen(false)
    }
  }

  const handleEditEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingEvent) {
      setEvents(prevEvents => prevEvents.map(event =>
        event.id === editingEvent.id ? editingEvent : event
      ))
      setEditingEvent(null)
    }
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id))
  }

  const renderHeader = () => {
    const dateFormat = view === 'month' ? 'MMMM yyyy' : 'MMM dd, yyyy'
    let startDate = startOfWeek(currentDate)
    let weekViewHeader = `${format(startDate, dateFormat)} to ${format(currentDate, dateFormat)}`
    let monthViewHeader = `${format(currentDate, dateFormat)}`

    return (
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={() => view === 'month' ? changeMonth(-1) : changeWeek(-1)} size="icon" className="p-0">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>
        <h2 className={cn("text-lg font-bold ", view !== 'month' && 'text-sm sm:text-lg')}>
          {
            view !== 'month' && weekViewHeader
            || monthViewHeader
          }
        </h2>
        <Button variant="outline" onClick={() => view === 'month' ? changeMonth(1) : changeWeek(1)} size="icon" className="p-0">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    )
  }

  const renderDays = () => {
    const dateFormat = 'EEEEE'
    const days = []
    let startDate = startOfWeek(currentDate)
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-xs">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      )
    }
    return <div className="grid grid-cols-7 gap-1 mb-1">{days}</div>
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const dateFormat = 'd'
    const rows = []

    let days = []
    let day = startDate
    let formattedDate = ''

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat)
        const cloneDay = day
        const dayEvents = events.filter(event =>
          isSameDay(day, event.start) || isSameDay(day, event.end) ||
          (event.start < day && event.end > day)
        )
        days.push(
          <div
            key={day.toString()}
            className={`w-full mx-auto p-1 max-md:pt-[9.9px] sm:border max-sm:rounded-full aspect-square overflow-y-clip relative ${!isSameMonth(day, monthStart) ? 'text-gray-400' : 'text-gray-700'
              } ${isSameDay(day, new Date()) ? 'bg-blue-500 shadow-blue-100 shadow-lg' : ''}
            ${selectedDate && isSameDay(day, selectedDate) ? 'max-sm:outline max-sm:outline-primary max-sm:outline-2 sm:border-primary sm:border-2' : 'border-0'}`}
            onClick={() => onDateClick(cloneDay)}
          >
            <div className={cn("text-sm font-bold text-center sm:text-right w-full sm:pr-1 overflow-y-clip", isSameDay(day, new Date()) && 'text-white')}>
              {formattedDate}
              <span className={cn("sm:hidden", dayEvents.length && 'block relative bottom-2' || 'hidden')}>
                •
              </span>
            </div>
            <div className="hidden sm:flex flex-col flex-nowrap mt-1 space-y-1 max-h-[7rem] overflow-y-auto">
              {dayEvents.map((event) => (
                <div key={event.id} className="text-xs text-left bg-blue-200 p-1 truncate min-h-6">
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 max-sm:gap-2">
          {days}
        </div>
      )
      days = []
    }
    return <div>{rows}</div>
  }

  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate)
    const endDate = endOfWeek(currentDate)
    const dateFormat = 'd'
    const rows = []

    let day = startDate
    while (day <= endDate) {
      const dayEvents = events.filter(event =>
        isSameDay(day, event.start) || isSameDay(day, event.end) ||
        (event.start < day && event.end > day)
      )
      const cloneDay = day
      rows.push(
        <div
          key={day.toString()}
          className={`sm:border max-sm:rounded-full text-center pt-[10px] max-sm:aspect-square ${isSameDay(day, new Date()) ? 'bg-blue-500' : ''}
          ${selectedDate && isSameDay(day, selectedDate) ? 'max-sm:outline max-sm:outline-primary max-sm:outline-2 sm:border-primary sm:border-2' : 'border-0'}`}
          onClick={() => onDateClick(cloneDay)}
        >
          <div className={cn("text-sm max-sm:text-xs mb-2 font-bold", isSameDay(day, new Date()) && 'text-white')}>
            {format(day, dateFormat)}
            <span className={cn("sm:hidden", dayEvents.length && 'block -mb-6' || 'hidden')}>
              •
            </span>
          </div>
          <div className="space-y-1 max-h-[calc(100%-2rem)]">
            {dayEvents.map((event) => (
              <div key={event.id} className="max-sm:hidden text-xs bg-blue-200 p-1">
                <span>{event.title}</span>
                <div className="text-[10px] text-gray-600">
                  {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
      day = addDays(day, 1)
    }
    return <div className="grid grid-cols-7 mb-4 max-sm:gap-2">{rows}</div>
  }

  const renderSelectedDateEvents = () => {
    if (!selectedDate) return null

    const selectedDateEvents = events.filter(event =>
      isSameDay(selectedDate, event.start) || isSameDay(selectedDate, event.end) ||
      (event.start < selectedDate && event.end > selectedDate)
    )

    return (
      <div className="mt-4 bg-background px-4 py-2 rounded-lg border border-border h-fit overflow-y-auto">
        <h3 className="text-lg font-semibold mb-2">
          Events for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        {selectedDateEvents.length === 0 ? (
          <p>No events scheduled for this day.</p>
        ) : (
          <ul className="space-y-2">
            {selectedDateEvents.map(event => (
              <li key={event.id} className="p-2 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{event.title}</span>
                  <div className="space-x-2">
                    <Button onClick={() => setEditingEvent(event)} size="sm" variant="outline">
                      <Pencil className="h-4 w-4 sm:mr-1" />
                      <span className="max-sm:sr-only">Edit</span>
                    </Button>
                    <Button onClick={() => handleDeleteEvent(event.id)} size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="h-4 w-4 sm:mr-1" />
                      <span className="max-sm:sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl flex max-lg:flex-wrap-reverse mx-auto px-4">
      {view === 'month' &&
        <div className="sm:max-w-sm w-full px-2 sm:px-4 h-full">
          {renderSelectedDateEvents()}
        </div>
      }
      <div className="max-w-7xl w-full p-2 sm:p-4 relative ">
        <div className="flex justify-end items-center mb-4">
          <Button
            variant="outline"
            onClick={() => {
              if (view === 'week') setView('month')
              else setView('week')
            }} size="sm" className="text-xs sm:text-sm capitalize">
            {view} view
          </Button>
        </div>
        {renderHeader()}
        {renderDays()}
        {view === 'month' ? renderCells() : renderWeekView()}
        {view === 'week' && renderSelectedDateEvents()}
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="start">Start Date and Time</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="end">End Date and Time</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Add Event</Button>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            {editingEvent && (
              <form onSubmit={handleEditEvent} className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Event Title</Label>
                  <Input
                    id="edit-title"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-start">Start Date and Time</Label>
                  <Input
                    id="edit-start"
                    type="datetime-local"
                    value={format(editingEvent.start, "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => setEditingEvent({ ...editingEvent, start: parseISO(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-end">End Date and Time</Label>
                  <Input
                    id="edit-end"
                    type="datetime-local"
                    value={format(editingEvent.end, "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => setEditingEvent({ ...editingEvent, end: parseISO(e.target.value) })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Update Event</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
        <div className="fixed bottom-4 right-4 flex flex-col space-y-2 items-end">
          <Button
            onClick={() => {
              if (selectedDate) {
                const defaultStart = setMinutes(setHours(selectedDate, 9), 0)
                const defaultEnd = setMinutes(setHours(selectedDate, 10), 0)
                setNewEvent({
                  title: '',
                  start: format(defaultStart, "yyyy-MM-dd'T'HH:mm"),
                  end: format(defaultEnd, "yyyy-MM-dd'T'HH:mm")
                })
                setIsAddEventOpen(true)
              } else {
                setNewEvent({
                  title: '',
                  start: '',
                  end: ''
                })
                setIsAddEventOpen(true)
              }
            }}
            className="rounded-lg max-sm:px-3 shadow-lg sm:min-h-14 flex gap-2"
          >
            <Plus className="size-5 sm:size-9" />
            <span className="sm:text-lg">Add Event</span>
          </Button>
          <Button
            variant="outline"
            onClick={goToToday}
            className="rounded-lg max-sm:px-3 shadow-lg sm:min-h-14 flex gap-2"
          >
            <CalendarIcon className="size-5 sm:size-9" />
            <span className="sm:text-lg">Go to Today</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
