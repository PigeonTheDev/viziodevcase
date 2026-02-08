# Vizio - Team-Based Social Media MVP

Next.js 15 + Supabase ile geliştirilmiş, takım tabanlı sosyal medya platformu. Vizio AI case study projesi.

**Tech Stack:** Next.js 15, Supabase, TypeScript, Tailwind CSS

## Özellikler

- ✅ **Auth:** Email/password + Google OAuth
- ✅ **Takım Sistemi:** Her kullanıcı bir takıma ait
- ✅ **Post Paylaşma:** Takım adına gönderi oluşturma
- ✅ **Takip Sistemi:** Takımlar birbirini takip edebilir
- ✅ **Global Feed:** Tüm gönderileri görüntüle (auth gerekmeden)
- ✅ **RLS Security:** Database seviyesinde yetkilendirme

---

## 🗄️ Database Schema

### Tablolar

**`teams`** - Takım bilgileri

- `id`, `name`, `handle` (unique), `created_at`

**`profiles`** - User → Team mapping

- `user_id` (PK), `team_id` (FK)
- **1 user = 1 team** (PK ile enforce edilir)

**`posts`** - Takım gönderileri

- `id`, `team_id`, `content`, `created_at`
- `user_id` YOK (collaborative posting)

**`team_follows`** - Takip ilişkileri

- `follower_team_id`, `followed_team_id`
- Composite PK, CHECK constraint (self-follow engelleme)

### RLS Policies

**Güvenlik Katmanları:**

1. Database (RLS policies)
2. Backend (API validation)
3. Middleware (route protection)
4. Frontend (UI state)

**Önemli Policies:**

- `posts`: Public read, team-scoped write
- `profiles`: Own profile read, write BLOCKED
- `team_follows`: Team-scoped follow/unfollow

**Database Constraints:**

- `teams.handle`: UNIQUE constraint (duplicate handle engelleme)
- `team_follows`: Composite PK (duplicate follow engelleme)
- `team_follows`: CHECK constraint → `follower_team_id <> followed_team_id` (self-follow engelleme)
- `profiles.user_id`: PK enforcement (1 user = 1 team)

**Helper Function:**

```sql
my_team_id(uuid) → uuid
```

Security definer function, RLS policies'de kullanılır.

---

### Provisioning Yaklaşımı

**Karar:** Admin provisioning (self-signup YOK)

**Nasıl Çalışıyor:**

Script (`scripts/provision.ts`) şu adımları takip eder:

1. **User Check:** Email ile mevcut auth user aranır
   - Varsa: Mevcut user kullanılır
   - Yoksa: Yeni auth user oluşturulur (`email_confirm: true`)

2. **Team Check:** User'ın zaten team'i var mı kontrol edilir

   ```typescript
   SELECT team_id, teams(name, handle) FROM profiles WHERE user_id = ?
   ```

   - Varsa: **ERROR** - "User already belongs to team X"
   - Yoksa: Devam edilir

3. **Team Upsert:** Handle'a göre team oluşturulur/güncellenir

   ```sql
   INSERT INTO teams (name, handle) VALUES (?, ?)
   ON CONFLICT (handle) DO UPDATE SET name = EXCLUDED.name
   ```

4. **Profile Link:** User → Team mapping oluşturulur

   ```sql
   INSERT INTO profiles (user_id, team_id) VALUES (?, ?)
   ```

   - Primary Key violation → Duplicate prevention

5. **(Opsiyonel)** Demo post oluşturulur (`--post` flag)

### Public Feed

Feed herkes görebilir (auth gerekmez)

### 5. Multi-Layer Validation

**Örnek:** Self-follow prevention

- Layer 1: Database CHECK constraint
- Layer 2: API validation (`targetTeamId !== myTeamId`)
- Layer 3: Frontend (button hidden)

## 📁 Proje Yapısı

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

## What I Would Improve With More Time

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

- **Database Detayları:** `database/README.md`
- **Schema SQL:** `database/schema.sql`
- **Provision Docs:** `scripts/provision.ts` (inline comments)

### PDF Gereksinimleri

✅ Authentication (email + Google OAuth)  
✅ Team-based model (1 user = 1 team)  
✅ Posts (team-owned)  
✅ Follow system (team-to-team)  
✅ Global feed (public)  
✅ RLS policies  
✅ Clean architecture  
✅ Documented approach (provisioning)

### Öne Çıkan Noktalar

- **Defense in depth:** Database + Backend + Frontend validation
- **Production patterns:** Admin provisioning, RLS, cookies
- **Clean code:** Separation of concerns, type safety
- **Performance:** Indexes, Server Components (SSR)
- **Security mindset:** RLS policies, helper functions

- **TEST USERS**
  testavengers@test.com Password123

testjusticeleague@test.com Password123
