# Two Read - API Reference

## Overview

Two Read uses Supabase as its backend. All API calls are made through the Supabase client.

**Base URL:** `https://[PROJECT_REF].supabase.co`

## Authentication

All authenticated endpoints require the JWT token in the Authorization header:
```
Authorization: Bearer [ACCESS_TOKEN]
```

### Sign Up
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      username: 'username'
    }
  }
})
```

### Sign In
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Sign Out
```javascript
const { error } = await supabase.auth.signOut()
```

### Reset Password
```javascript
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'user@example.com'
)
```

---

## Users

### Get Current User Profile
```javascript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single()
```

### Update User Profile
```javascript
const { data, error } = await supabase
  .from('users')
  .update({
    username: 'newname',
    daily_goal_minutes: 15,
    motivation: 'culture',
    reading_obstacles: ['time', 'focus']
  })
  .eq('id', userId)
```

### Complete Onboarding
```javascript
const { data, error } = await supabase
  .from('users')
  .update({
    language: 'fr',
    motivation: 'culture',
    daily_goal_minutes: 10,
    reading_obstacles: ['time'],
    reading_reason: 'personal',
    notifications_enabled: true,
    onboarding_completed: true
  })
  .eq('id', userId)
```

### Get User Stats
```javascript
const { data, error } = await supabase
  .rpc('get_user_stats', { p_user_id: userId })
```

**Response:**
```json
{
  "streak_count": 8,
  "longest_streak": 15,
  "total_books_read": 5,
  "total_pages_read": 1250,
  "total_minutes_read": 3600,
  "reader_level": "regulier",
  "division": "argent",
  "books_in_progress": 2,
  "active_duos": 1,
  "achievements_count": 12
}
```

---

## Books

### Get All Books
```javascript
const { data, error } = await supabase
  .from('books')
  .select('*')
  .order('title')
```

### Get Featured Books
```javascript
const { data, error } = await supabase
  .from('books')
  .select('*')
  .eq('is_featured', true)
  .order('read_count', { ascending: false })
```

### Get Book by ID
```javascript
const { data, error } = await supabase
  .from('books')
  .select('*')
  .eq('id', bookId)
  .single()
```

### Search Books
```javascript
const { data, error } = await supabase
  .from('books')
  .select('*')
  .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
```

### Filter by Genre
```javascript
const { data, error } = await supabase
  .from('books')
  .select('*')
  .eq('genre', 'aventure')
  .eq('language', 'fr')
```

### Get Book Chapters
```javascript
const { data, error } = await supabase
  .from('book_chapters')
  .select('*')
  .eq('book_id', bookId)
  .order('chapter_number')
```

### Get Single Chapter
```javascript
const { data, error } = await supabase
  .from('book_chapters')
  .select('*')
  .eq('book_id', bookId)
  .eq('chapter_number', chapterNum)
  .single()
```

---

## User Library

### Get User Library
```javascript
const { data, error } = await supabase
  .from('v_user_library')
  .select('*')
  .eq('user_id', userId)
  .order('last_read_at', { ascending: false })
```

### Get Books In Progress
```javascript
const { data, error } = await supabase
  .from('user_books')
  .select('*, books(*)')
  .eq('user_id', userId)
  .eq('status', 'in_progress')
```

### Add Book to Library
```javascript
const { data, error } = await supabase
  .from('user_books')
  .insert({
    user_id: userId,
    book_id: bookId,
    status: 'not_started'
  })
```

### Update Reading Progress
```javascript
const { data, error } = await supabase
  .rpc('update_reading_progress', {
    p_user_id: userId,
    p_book_id: bookId,
    p_chapter: 5,
    p_position: 1250
  })
```

**Response:**
```json
{
  "chapter": 5,
  "progress": 45.5,
  "completed": false
}
```

### Set Book Rating
```javascript
const { data, error } = await supabase
  .from('user_books')
  .update({
    user_rating: 5,
    emotion_rating: 'love'
  })
  .eq('user_id', userId)
  .eq('book_id', bookId)
```

---

## Reading Sessions & Streaks

### Log Reading Session
```javascript
const { data, error } = await supabase
  .rpc('log_reading_session', {
    p_user_id: userId,
    p_book_id: bookId,
    p_minutes: 15,
    p_pages: 10
  })
```

**Response:**
```json
{
  "session_id": "uuid",
  "streak": 8,
  "date": "2026-01-17"
}
```

### Get Weekly Stats
```javascript
const { data, error } = await supabase
  .rpc('get_weekly_stats', { p_user_id: userId })
```

**Response:**
```json
{
  "days": [
    {"date": "2026-01-13", "minutes": 20, "completed": true},
    {"date": "2026-01-14", "minutes": 15, "completed": true},
    {"date": "2026-01-15", "minutes": 0, "completed": false}
  ],
  "total_minutes": 85,
  "total_pages": 42,
  "days_active": 5
}
```

### Get Reading History
```javascript
const { data, error } = await supabase
  .from('reading_sessions')
  .select('*')
  .eq('user_id', userId)
  .order('date', { ascending: false })
  .limit(30)
```

---

## Bookmarks

### Get Bookmarks for Book
```javascript
const { data, error } = await supabase
  .from('bookmarks')
  .select('*')
  .eq('user_id', userId)
  .eq('book_id', bookId)
  .order('created_at', { ascending: false })
```

### Add Bookmark
```javascript
const { data, error } = await supabase
  .from('bookmarks')
  .insert({
    user_id: userId,
    book_id: bookId,
    chapter_number: 3,
    position: 450,
    note: 'Important passage'
  })
```

### Delete Bookmark
```javascript
const { error } = await supabase
  .from('bookmarks')
  .delete()
  .eq('id', bookmarkId)
```

---

## Highlights

### Get Highlights for Book
```javascript
const { data, error } = await supabase
  .from('highlights')
  .select('*')
  .eq('user_id', userId)
  .eq('book_id', bookId)
  .order('chapter_number', 'start_position')
```

### Add Highlight
```javascript
const { data, error } = await supabase
  .from('highlights')
  .insert({
    user_id: userId,
    book_id: bookId,
    chapter_number: 2,
    start_position: 100,
    end_position: 150,
    text_content: 'Selected text here',
    color: 'yellow',
    note: 'My note'
  })
```

### Update Highlight
```javascript
const { data, error } = await supabase
  .from('highlights')
  .update({
    note: 'Updated note',
    is_shared: true
  })
  .eq('id', highlightId)
```

### Delete Highlight
```javascript
const { error } = await supabase
  .from('highlights')
  .delete()
  .eq('id', highlightId)
```

---

## Reading Duos

### Create Duo
```javascript
const { data, error } = await supabase
  .rpc('create_reading_duo', {
    p_creator_id: userId,
    p_book_id: bookId
  })
```

**Response:**
```json
{
  "duo_id": "uuid",
  "invite_code": "ABC123",
  "expires_at": "2026-01-24T00:00:00Z"
}
```

### Join Duo
```javascript
const { data, error } = await supabase
  .rpc('join_reading_duo', {
    p_user_id: userId,
    p_invite_code: 'ABC123'
  })
```

**Response:**
```json
{
  "duo_id": "uuid",
  "book_id": "uuid",
  "partner_name": "Alex"
}
```

### Get Active Duos
```javascript
const { data, error } = await supabase
  .from('v_active_duos')
  .select('*')
  .or(`creator_id.eq.${userId},partner_id.eq.${userId}`)
  .eq('status', 'active')
```

### Check Can Advance
```javascript
const { data, error } = await supabase
  .rpc('can_advance_chapter', {
    p_duo_id: duoId,
    p_user_id: userId
  })
```

**Response:** `true` or `false`

### Update Duo Progress
```javascript
const { data, error } = await supabase
  .rpc('update_duo_progress', {
    p_duo_id: duoId,
    p_user_id: userId,
    p_chapter: 5
  })
```

**Response:**
```json
{
  "chapter": 5,
  "waiting_for": "Emma",
  "can_continue": false
}
```

### Cancel Duo
```javascript
const { error } = await supabase
  .from('reading_duos')
  .update({ status: 'cancelled' })
  .eq('id', duoId)
  .eq('creator_id', userId)
```

---

## Leaderboard

### Get Division Leaderboard
```javascript
const { data, error } = await supabase
  .from('v_leaderboard')
  .select('*')
  .eq('week_start', weekStart)
  .eq('division', 'argent')
  .order('points', { ascending: false })
  .limit(10)
```

### Get User Ranking
```javascript
const { data, error } = await supabase
  .from('weekly_leaderboard')
  .select('*')
  .eq('user_id', userId)
  .eq('week_start', weekStart)
  .single()
```

---

## Achievements

### Get All Achievements
```javascript
const { data, error } = await supabase
  .from('achievements')
  .select('*')
  .order('category', 'requirement_value')
```

### Get User Achievements
```javascript
const { data, error } = await supabase
  .from('user_achievements')
  .select('*, achievements(*)')
  .eq('user_id', userId)
  .order('earned_at', { ascending: false })
```

---

## User Preferences

### Get Preferences
```javascript
const { data, error } = await supabase
  .from('user_preferences')
  .select('*')
  .eq('user_id', userId)
  .single()
```

### Update Preferences
```javascript
const { data, error } = await supabase
  .from('user_preferences')
  .upsert({
    user_id: userId,
    theme: 'sepia',
    font_size: 'large',
    font_family: 'serif',
    line_spacing: 'spacious'
  })
```

---

## Notifications

### Get Notifications
```javascript
const { data, error } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(20)
```

### Get Unread Count
```javascript
const { count, error } = await supabase
  .from('notifications')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId)
  .is('read_at', null)
```

### Mark as Read
```javascript
const { error } = await supabase
  .from('notifications')
  .update({ read_at: new Date().toISOString() })
  .eq('id', notificationId)
```

### Mark All as Read
```javascript
const { error } = await supabase
  .from('notifications')
  .update({ read_at: new Date().toISOString() })
  .eq('user_id', userId)
  .is('read_at', null)
```

---

## Error Handling

All Supabase calls return `{ data, error }`. Always check for errors:

```javascript
const { data, error } = await supabase.from('books').select('*')

if (error) {
  console.error('Error:', error.message)
  // Handle error appropriately
  return
}

// Use data safely
console.log(data)
```

Common error codes:
- `PGRST116`: Row not found (single query)
- `23505`: Unique constraint violation
- `42501`: RLS policy violation
- `22P02`: Invalid input syntax
