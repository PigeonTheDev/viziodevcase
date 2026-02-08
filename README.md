# Vizio - Team-Based Social Media MVP

Team-based social media platform built with Next.js 15 + Supabase. Vizio AI case study project.

**Tech Stack:** Next.js 15, Supabase, TypeScript, Tailwind CSS

## Features

- ✅ **Auth:** Email/password + Google OAuth
- ✅ **Team System:** Each user belongs to one team
- ✅ **Post Sharing:** Create posts on behalf of your team
- ✅ **Follow System:** Teams can follow each other
- ✅ **Global Feed:** View all posts (no auth required)
- ✅ **RLS Security:** Database-level authorization

---

## 🗄️ Database Schema

### Tables

**`teams`** - Team information

- `id`, `name`, `handle` (unique), `created_at`

**`profiles`** - User → Team mapping

- `user_id` (PK), `team_id` (FK)
- **1 user = 1 team** (enforced by PK)

**`posts`** - Team posts

- `id`, `team_id`, `content`, `created_at`
- NO `user_id` (collaborative posting)

**`team_follows`** - Follow relationships

- `follower_team_id`, `followed_team_id`
- Composite PK, CHECK constraint (prevents self-follow)

### RLS Policies

**Security Layers:**

1. Database (RLS policies)
2. Backend (API validation)
3. Middleware (route protection)
4. Frontend (UI state)

**Important Policies:**

- `posts`: Public read, team-scoped write
- `profiles`: Own profile read, write BLOCKED
- `team_follows`: Team-scoped follow/unfollow

**Database Constraints:**

- `teams.handle`: UNIQUE constraint (prevents duplicate handles)
- `team_follows`: Composite PK (prevents duplicate follows)
- `team_follows`: CHECK constraint → `follower_team_id <> followed_team_id` (prevents self-follow)
- `profiles.user_id`: PK enforcement (1 user = 1 team)

**Helper Function:**

```sql
my_team_id(uuid) → uuid
```

Security definer function, used in RLS policies.

---

### Provisioning Approach

**Decision:** Admin provisioning (NO self-signup)

**How It Works:**

Script (`scripts/provision.ts`) follows these steps:

1. **User Check:** Search for existing auth user by email
   - If exists: Use existing user
   - If not: Create new auth user (`email_confirm: true`)

2. **Team Check:** Check if user already has a team

   ```typescript
   SELECT team_id, teams(name, handle) FROM profiles WHERE user_id = ?
   ```

   - If exists: **ERROR** - "User already belongs to team X"
   - If not: Continue

3. **Team Upsert:** Create/update team by handle

   ```sql
   INSERT INTO teams (name, handle) VALUES (?, ?)
   ON CONFLICT (handle) DO UPDATE SET name = EXCLUDED.name
   ```

4. **Profile Link:** Create User → Team mapping

   ```sql
   INSERT INTO profiles (user_id, team_id) VALUES (?, ?)
   ```

   - Primary Key violation → Duplicate prevention

5. **(Optional)** Create demo post (`--post` flag)

### Public Feed

Feed is viewable by everyone (no auth required)

### 5. Multi-Layer Validation

**Example:** Self-follow prevention

- Layer 1: Database CHECK constraint
- Layer 2: API validation (`targetTeamId !== myTeamId`)
- Layer 3: Frontend (button hidden)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # Backend endpoints (HTTP layer)
│   ├── login/            # Auth flow
│   ├── teams/            # Teams page
│   └── page.tsx          # Home feed
├── components/           # UI components
├── lib/
│   ├── db/              # Data access (business logic)
│   ├── supabase/        # Supabase clients
│   ├── models/          # TypeScript types
│   └── auth.ts
├── middleware.ts        # Session + route protection
└── globals.css

database/
└── schema.sql           # PostgreSQL schema + RLS

scripts/
└── provision.ts         # User/team provisioning
```

---

## 🔄 What I Would Improve With More Time

### High Priority

**1. Self-Service Signup Flow**

- Current: Admin provisioning via script
- Future: Signup wizard with team creation
- Email verification flow
- Team invite links (existing members invite new users)
- Admin role for team management

**2. Optimistic UI Updates**

- Current: Page refresh after mutations
- Future: Instant UI updates with rollback on error
- React Query or SWR for cache management
- Undo actions for follow/unfollow

**3. Pagination**

- Current: Limited to first 20 posts
- Future: Cursor-based pagination (keyset pagination)
- Infinite scroll or "Load More" button
- Efficient for large datasets

**4. Real-Time Feed Updates**

- Current: Manual refresh required
- Future: Supabase Realtime subscriptions
- New posts appear automatically
- Live follow/unfollow updates
- Online presence indicators

### Medium Priority

**5. Enhanced Content**

- Image uploads (Supabase Storage)
- Video support
- Rich text editor (Markdown, mentions, hashtags)
- Link previews
- Post reactions/likes

**6. Team Profiles**

- Dedicated team profile pages (`/teams/[handle]`)
- Team bio, avatar, banner image
- Team member list with roles
- Team-specific post feed
- Team statistics (followers, posts count)

**7. Advanced Following Features**

- Followers count and following count
- Mutual follows indicator
- Follow suggestions algorithm
- Follower-only feed (vs global feed)
- Block/mute functionality

**8. Performance Optimizations**

- Virtual scrolling for long feeds
- Image optimization (Next.js Image component)
- CDN integration for static assets
- Database query optimization (EXPLAIN ANALYZE)
- Caching layer (Redis) for hot data

### Nice to Have

**9. Security Enhancements**

- Rate limiting (Upstash Rate Limit)
- CAPTCHA for authentication
- Content moderation tools
- Audit logs for sensitive actions
- IP-based access control

**10. Analytics & Monitoring**

- Post views and engagement metrics
- Team growth analytics
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Database query performance dashboard

**11. Testing**

- Unit tests (Vitest)
- Integration tests
- E2E tests (Playwright) for critical flows
- Visual regression tests
- Load testing

**12. Accessibility & i18n**

- ARIA labels and semantic HTML
- Keyboard navigation
- Screen reader optimization
- High contrast mode
- Multi-language support (i18n)

---

- **TEST USERS**
  testavengers@test.com Password123

  testjusticeleague@test.com Password123
