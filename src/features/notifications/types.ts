export interface NotificationItem {
  id: string
  category: string
  template_key: string
  template_data: { title?: string; source?: string }
  created_at: string
  read_at: string | null
  target_type: string
  target_id: string
}

export interface Inbox {
  items: NotificationItem[]
  next_cursor: string | null
  cutoff: string
}
