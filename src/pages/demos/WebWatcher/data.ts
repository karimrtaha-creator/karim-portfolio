export interface WatchedPage {
  id: string
  name: string
  threshold: number
  waiting: number
  answered: number
  longestWaitingSeconds: number
  monitoring: boolean
}

export const INITIAL_PAGES: WatchedPage[] = [
  { id: 'p1', name: 'Call Queue — Downtown', threshold: 5, waiting: 2, answered: 34, longestWaitingSeconds: 48, monitoring: true },
  { id: 'p2', name: 'Call Queue — Nasr City', threshold: 5, waiting: 1, answered: 21, longestWaitingSeconds: 15, monitoring: true },
  { id: 'p3', name: 'Support Inbox — Overflow', threshold: 8, waiting: 3, answered: 12, longestWaitingSeconds: 102, monitoring: false },
]

export interface WatcherEvent {
  at: string
  page: string
  message: string
}
