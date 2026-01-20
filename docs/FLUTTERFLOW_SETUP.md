# FlutterFlow Setup Guide - Two Read

## 1. Create FlutterFlow Project

1. Go to [flutterflow.io](https://flutterflow.io)
2. Create new project named "TwoRead"
3. Select "Blank App" template
4. Enable "Use Supabase" in project settings

## 2. Connect Supabase

### In Supabase Dashboard:
1. Create new project "tworead"
2. Go to Settings > API
3. Copy **Project URL** and **anon public** key

### In FlutterFlow:
1. Go to Settings > Supabase
2. Paste Project URL
3. Paste Anon Key
4. Click "Get Schema" to import tables

## 3. Run Database Migrations

In Supabase SQL Editor, run in order:
1. `migrations/001_initial_schema.sql`
2. `migrations/002_rls_policies.sql`
3. `migrations/003_functions.sql`
4. `seed/001_achievements.sql`
5. `seed/002_sample_books.sql`

## 4. Configure Authentication

### Supabase:
1. Authentication > Providers > Enable Email
2. Authentication > Email Templates > Customize (French)
3. URL Configuration > Set redirect URLs

### FlutterFlow:
1. Settings > Authentication > Enable Supabase Auth
2. Set Initial Page: WelcomePage
3. Set Logged In Page: HomePage

## 5. Theme Configuration

### Colors (App Settings > Theme):
```
Primary: #4CAF50
Primary Dark: #2E7D32
Primary Light: #81C784
Secondary: #FF9800
Accent: #FFC107
Background: #FAFAFA
Surface: #FFFFFF
Error: #F44336
```

### Typography:
- Font Family: Nunito (or Poppins)
- Heading 1: 24px Bold
- Heading 2: 20px SemiBold
- Body: 16px Regular
- Caption: 12px Medium

## 6. Custom Types

Create these Custom Data Types:

### ReaderTheme
```
- name: String
- backgroundColor: Color
- textColor: Color
```

### DuoStatus
```
- duoId: String
- partnerName: String
- partnerChapter: int
- canAdvance: bool
```

## 7. App State Variables

Create in Settings > App State:

| Variable | Type | Default |
|----------|------|---------|
| currentUserId | String | "" |
| currentBookId | String | "" |
| readerTheme | String | "light" |
| fontSize | int | 16 |
| isReading | bool | false |

## 8. Page Structure

Create these pages:

### Auth Flow
- WelcomePage
- SignUpPage
- SignInPage
- ForgotPasswordPage

### Onboarding Flow
- OnboardingLanguage
- OnboardingMotivation
- OnboardingGoal
- OnboardingObstacles
- OnboardingNotifications
- OnboardingReason
- OnboardingConfirm

### Main App (with NavBar)
- HomePage (Tab 1)
- LibraryPage (Tab 2)
- CommunityPage (Tab 3)
- ProfilePage (Tab 4)

### Secondary Pages
- ReaderPage
- BookDetailPage
- DuoInvitePage
- DuoJoinPage
- SettingsPage
- PaywallPage

## 9. Navigation Setup

### Bottom NavBar Configuration:
```
Tab 1: Accueil (Home icon) -> HomePage
Tab 2: Bibliotheque (Book icon) -> LibraryPage
Tab 3: Communaute (People icon) -> CommunityPage
Tab 4: Profil (Person icon) -> ProfilePage
```

### NavBar Style:
- Background: White
- Active Color: #4CAF50
- Inactive Color: #9E9E9E
- Show Labels: true

## 10. Supabase Queries

### Get Current User
```sql
SELECT * FROM users WHERE id = [Authenticated User UID]
```

### Get User Library
```sql
SELECT * FROM v_user_library
WHERE user_id = [uid]
ORDER BY last_read_at DESC
```

### Get Active Duo
```sql
SELECT * FROM v_active_duos
WHERE (creator_id = [uid] OR partner_id = [uid])
AND status = 'active'
```

### Get Weekly Stats
```sql
SELECT * FROM reading_sessions
WHERE user_id = [uid]
AND date >= [week_start]
ORDER BY date
```

### Get Leaderboard
```sql
SELECT * FROM v_leaderboard
WHERE week_start = [current_week]
AND division = [user_division]
ORDER BY points DESC
LIMIT 10
```

## 11. Custom Actions

### Log Reading Session
Call function: `log_reading_session(user_id, book_id, minutes, pages)`

### Create Duo
Call function: `create_reading_duo(creator_id, book_id)`

### Join Duo
Call function: `join_reading_duo(user_id, invite_code)`

### Update Progress
Call function: `update_reading_progress(user_id, book_id, chapter, position)`

### Check Duo Advance
Call function: `can_advance_chapter(duo_id, user_id)`

## 12. Useful Widgets

### CircularProgress (for book progress)
- Use Stack widget
- Bottom: Circle with grey stroke
- Top: Circle with green stroke (progress %)
- Center: Book cover image

### StreakBadge
- Row with flame icon + text
- Conditional color based on streak count

### WeekCalendar
- Row of 7 CircleAvatars
- Check mark for completed days
- Highlight current day

## 13. Reader Page Setup

### PageView Configuration:
- Axis: Horizontal
- Physics: PageScrollPhysics
- Controller: Create PageController

### Gesture Detection:
- Tap center: Toggle controls visibility
- Swipe: Next/Previous page

### Theme Switching:
Store in App State, apply to:
- Background color
- Text color
- Status bar style

## 14. Testing Checklist

Before publishing:
- [ ] Auth flow works (signup, login, logout)
- [ ] Onboarding saves all data
- [ ] Books display correctly
- [ ] Reader navigation works
- [ ] Streaks calculate properly
- [ ] Duo creation/joining works
- [ ] Duo blocking works
- [ ] Leaderboard displays

## 15. Export & Deploy

### iOS:
1. FlutterFlow > Export Code
2. Open in Xcode
3. Configure signing
4. Archive > Upload to App Store Connect

### Android:
1. FlutterFlow > Export Code
2. Run: `flutter build appbundle`
3. Upload AAB to Google Play Console
