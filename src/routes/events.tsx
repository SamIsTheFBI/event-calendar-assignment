import { CalendarComponent } from "@/components/calendar"

export default function EventsRoute() {
  const fetchEvents = async () => {
    const headers = { 'Authorization': `Bearer ${token}` }
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/events/`, { headers })
      if (response.ok) {
        const fetchedEvents = await response.json()
        console.log(fetchedEvents)
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }

  let token = localStorage.getItem('token') || ''
  if (token === '') {
    console.log('No token!!')
    return <main>Sign in first!</main>
  }

  fetchEvents()
  return (
    <main className="bg-secondary h-screen min-h-screen">
      <CalendarComponent />
    </main>
  )
}
