# Konsept Proje (Ofis IT Destek Talepleri) — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Hedef:** Yayındaki portföy sitesine, küçük bir ofisin IT destek taleplerini takip eden konsept bir demo, proje sayfası ve ana sayfa bölümü eklemek.

**Mimari:** Mevcut demo kalıbı izlenir: kurallar ve hesaplar arayüzden ayrı saf fonksiyonlardadır (`tickets.ts`, `timing.ts`) ve test-önce yazılır; arayüz (`board.ts`) yalnızca DOM'dur. İçerik modeli `kind: 'real' | 'concept'` ile genişler; ana sayfa konsepti ayrı başlık altında çizer.

**Stack:** Değişmez (Astro, Tailwind v4, TypeScript, Vitest, Playwright + Edge, ffmpeg). Yeni bağımlılık yok.

**Spec:** `docs/helpdesk-spec.md`. Site geneli için `docs/design-spec.md`, `DECISIONS.md`, `DESIGN.md`.

## Global Constraints

- **Konsept etiketi:** Proje gerçek kullanımda değildir; ana sayfa, proje sayfası, demo ve CV bunu açıkça yazar. Hero metni ve "üç araç" ifadesi değişmez.
- **Kurgu:** Ofis adsızdır ("20 kişilik bir ofis"); kişiler soyadsız, yaygın adlardır. Gerçek kullanım iması taşıyan cümle yazılmaz.
- **Anonimlik:** Her commit'ten önce `npm run check:anonymity`; push'tan önce `npm run check:history`. `yerel-gecmis` dalı push edilmez.
- **Tasarım:** `DESIGN.md` kuralları: keskin köşe, 1px çizgi, tek kehribar vurgu, gölgesiz site denetimleri, mono yalnızca veri ve teknoloji etiketlerinde, başlık üstü etiket yok. Renkler yalnızca yedi belirteçten.
- **Erişilebilirlik:** Durum renkle birlikte metinle belirtilir; dokunma hedefi ≥ 2.75rem; eylemden sonra klavye odağı korunur; değişiklik `aria-live` ile duyurulur.
- **Güvenlik:** Kullanıcı metni DOM'a yalnızca `textContent` ile yazılır; depodan okunan veri doğrulanır.
- **Kod stili:** Değişmez veri; dosya ≤ 400 satır; fonksiyon < 50 satır; adlandırılmış sabitler; Türkçe yorum.
- **Doğrulama derlenmiş siteye karşı yapılır:** `npm run build && npx astro preview --port 4322`, betiklerde `SHOTS_BASE_URL=http://localhost:4322`. Tarayıcı açan betikler görünmez çalışır ve pencere bırakmaz.
- **Kabuk:** Çok satırlı dosya değişiklikleri Write/Edit ile yapılır (uzun satır içi betikler bu makinede bozuluyor).
- **Yayın:** Onay 4 alınmadan `main`e push edilmez. Commit'lere attribution satırı eklenmez.

## Review Focus

1. **Saat kayması** — açılış zamanı gelecekte görünürse süre "0 dk" yazmalı, eksi ya da `NaN` olmamalı. → Task 3
2. **Hedef sınırı** — süre hedefe tam eşitken talep "hedefi aştı" sayılmamalı; bir dakika sonra sayılmalı. Çözülmüş talep hiçbir zaman aşmış sayılmamalı. → Task 3
3. **Depodaki bilinmeyen değerler** — tanınmayan durum, kategori, öncelik ya da atanan içeren kayıt demoyu çökertmemeli; başlangıç verisine dönülmeli. → Task 4
4. **Başlık girdisi** — yalnızca boşluk, 80 karakterden uzun ya da HTML içeren başlık: ilk ikisi reddedilmeli, üçüncüsü düz metin olarak görünmeli. → Task 2 (doğrulama), Task 5 (tarayıcı)
5. **Eylemden sonra odak** — talep başka sütuna taşınınca klavye odağı aynı talebin üstünde kalmalı; `BODY`'ye düşmemeli. → Task 5

## Onay noktaları

| # | Ne zaman | Baran neyi onaylar |
|---|---|---|
| 3 | Task 7, kare üretiminden önce ve sonra | Maliyet (yaklaşık 11 kredi, üst sınır 20) ve kareler |
| 4 | Task 8 sonu | Yerelde çalışan demo, proje sayfası, ana sayfa bölümü; ardından yayın |

## Dosya yapısı

```
src/demos/helpdesk/
  tickets.ts    tipler, doğrulama, durum geçişleri, atama, sıralama
  timing.ts     süre, hedef, aşım, süre biçimi, özet
  seed.ts       göreli zamanlı başlangıç verisi
  storage.ts    yükleme (doğrulamalı), kaydetme, temizleme
  strings.ts    iki dilde arayüz metinleri
  board.ts      arayüz
src/components/demos/HelpdeskDemo.astro
src/pages/projeler/destek-talepleri.astro      src/pages/en/projects/helpdesk.astro
src/pages/demo/destek-talepleri.astro          src/pages/en/demo/helpdesk.astro
tests/helpdesk-tickets.test.ts  helpdesk-timing.test.ts  helpdesk-storage.test.ts
scripts/verify-helpdesk.mjs
public/media/helpdesk-*
```

---

### Task 1: İçerik modeli, yollar ve metinler

**Files:** Modify: `src/i18n/routes.ts`, `tests/routes.test.ts`, `src/content/types.ts`, `src/content/index.ts`, `src/content/projects.tr.ts`, `src/content/projects.en.ts`, `src/i18n/ui.tr.ts`, `src/i18n/ui.en.ts`, `src/components/Scene.astro` (yalnızca `SceneName`)

**Interfaces — produces:**
```ts
// routes.ts
export type ProjectPageId = 'qr-menu' | 'lobby' | 'agency' | 'helpdesk';
// yollar: helpdesk → '/projeler/destek-talepleri/' , '/en/projects/helpdesk/'
//         demo-helpdesk → '/demo/destek-talepleri/' , '/en/demo/helpdesk/'
// types.ts
export type ProjectId = 'qr-menu' | 'lobby' | 'agency' | 'helpdesk';
export interface ProjectContent { /* mevcut alanlar */ kind: 'real' | 'concept'; }
// index.ts
export function getProjects(locale: Locale): readonly ProjectContent[];        // yalnızca kind === 'real' (3 proje)
export function getConceptProjects(locale: Locale): readonly ProjectContent[]; // yalnızca kind === 'concept'
export function getProject(id: ProjectId, locale: Locale): ProjectContent;     // ikisini de bulur
// UiStrings'e eklenenler
scenarioLabel, statusLabel, showsLabel, conceptHeading, conceptBadge, conceptLead: string
// Scene.astro
export type SceneName = 'hero' | 'qr-menu' | 'lobby' | 'agency' | 'closing' | 'helpdesk';
```

- [ ] **Step 1: Başarısız testi yaz** (`tests/routes.test.ts`): tabloya dört satır (`helpdesk` ve `demo-helpdesk`, TR/EN, yukarıdaki yollar); `demoPageFor('helpdesk')` → `'demo-helpdesk'`. Yeni dosya `tests/content.test.ts`:

```ts
for (const locale of ['tr', 'en'] as const) {
  expect(getProjects(locale).map((p) => p.id)).toEqual(['qr-menu', 'lobby', 'agency']);
  expect(getProjects(locale).every((p) => p.kind === 'real')).toBe(true);
  expect(getConceptProjects(locale).map((p) => p.id)).toEqual(['helpdesk']);
  expect(getProject('helpdesk', locale).kind).toBe('concept');
}
// iki dilde aynı alanlar dolu
expect(Object.keys(getProject('helpdesk', 'tr')).sort()).toEqual(Object.keys(getProject('helpdesk', 'en')).sort());
```

- [ ] **Step 2:** `npm test` → FAIL (yol ve içerik yok).
- [ ] **Step 3:** Yolları, tipleri ve içerik erişimini yaz. Mevcut üç projeye `kind: 'real'` eklenir.
- [ ] **Step 4:** Konsept projenin metinleri spec §3'ten aynen (TR), EN doğrudan çeviri. Konsept içerikte alan eşlemesi: `sceneProblem` = "Senaryo" cümlesi, `sceneResult` = "Ne gösteriyor" cümlesi, `problem` = Senaryo paragrafı, `outcome` = Durum metni. `tags`: `['TypeScript', 'localStorage', 'TDD']`. `sceneAlt`: "Monitörün çevresine yapıştırılmış notlar, ekrandaki düzenli bir talep panosuna dönüşüyor."
- [ ] **Step 5:** Arayüz metinleri: `scenarioLabel` "Senaryo"/"Scenario", `statusLabel` "Durum"/"Status", `showsLabel` "Ne gösteriyor"/"What it shows", `conceptHeading` "Konsept çalışma"/"Concept work", `conceptBadge` "Konsept"/"Concept", `conceptLead` "Aşağıdaki proje gerçek bir işletmede kullanılmadı; otel dışında bir senaryo için kurduğum bir denemedir." / "The project below was not used at a real business; it is an exercise I built for a scenario outside the hotel."
- [ ] **Step 6:** `npm test` → PASS. `npm run build` → başarılı (sayfalar henüz yok; içerik derlenir).
- [ ] **Step 7:** Commit: `feat: konsept proje için içerik modeli, yollar ve metinler`.

### Task 2: Talep kuralları (TDD)

**Files:** Create: `src/demos/helpdesk/tickets.ts`, `tests/helpdesk-tickets.test.ts`

**Interfaces — produces:**
```ts
export type TicketStatus = 'new' | 'inProgress' | 'waiting' | 'resolved';
export type TicketCategory = 'hardware' | 'software' | 'account' | 'network';
export type TicketPriority = 'low' | 'normal' | 'urgent';
export type TicketAction = 'start' | 'wait' | 'resume' | 'resolve' | 'reopen';
export const STATUSES: readonly TicketStatus[];      // sütun sırası: new, inProgress, waiting, resolved
export const CATEGORIES: readonly TicketCategory[];
export const PRIORITIES: readonly TicketPriority[];  // low, normal, urgent
export const ASSIGNEES: readonly string[];           // ['Deniz', 'Emre']
export const TITLE_MIN = 3; export const TITLE_MAX = 80;
export const REQUESTER_MIN = 2; export const REQUESTER_MAX = 40;
export interface Ticket {
  id: string; title: string; category: TicketCategory; priority: TicketPriority;
  requester: string; assignee: string | null; status: TicketStatus;
  openedAt: number;            // epoch ms
  resolvedAt: number | null;   // epoch ms
}
export interface TicketDraft { title: string; category: string; priority: string; requester: string }
export type DraftError = 'titleLength' | 'categoryInvalid' | 'priorityInvalid' | 'requesterLength';
export type DraftValidation = { ok: true; ticket: Ticket } | { ok: false; errors: Partial<Record<keyof TicketDraft, DraftError>> };
export type ActionError = 'notAllowed' | 'unassigned';
export type AssignError = 'resolved' | 'unknownAssignee';
export type Result<E> = { ok: true; ticket: Ticket } | { ok: false; error: E };
export function validateDraft(draft: TicketDraft, id: string, now: number): DraftValidation; // status 'new', assignee null
export function allowedActions(status: TicketStatus): readonly TicketAction[];
export function applyAction(ticket: Ticket, action: TicketAction, now: number): Result<ActionError>;
export function assign(ticket: Ticket, assignee: string | null): Result<AssignError>;
export function replaceTicket(tickets: readonly Ticket[], next: Ticket): Ticket[];  // aynı id'li kaydı değiştirir
export function sortForColumn(tickets: readonly Ticket[]): Ticket[];  // urgent → normal → low; eşitlikte eski açılış üstte
export function groupByStatus(tickets: readonly Ticket[]): Record<TicketStatus, Ticket[]>;  // her grup sortForColumn ile sıralı
```

- [ ] **Step 1: Başarısız testleri yaz**

```ts
// geçiş tablosu (spec §4.2) — tamamı
expect(allowedActions('new')).toEqual(['start']);
expect(allowedActions('inProgress')).toEqual(['wait', 'resolve']);
expect(allowedActions('waiting')).toEqual(['resume', 'resolve']);
expect(allowedActions('resolved')).toEqual(['reopen']);
// 4 durum × 5 eylem: izinli olanlar hedef duruma gider, diğerleri { ok:false, error:'notAllowed' } ve talep değişmez
// start: new → inProgress; wait: inProgress → waiting; resume: waiting → inProgress;
// resolve: inProgress|waiting → resolved (resolvedAt = now); reopen: resolved → inProgress (resolvedAt = null)
// atanmamış talep işleme alınamaz
expect(applyAction({ ...t, status: 'new', assignee: null }, 'start', NOW)).toEqual({ ok: false, error: 'unassigned' });
// atama
expect(assign({ ...t, status: 'new' }, 'Deniz')).toMatchObject({ ok: true, ticket: { assignee: 'Deniz' } });
expect(assign({ ...t, status: 'waiting', assignee: 'Deniz' }, null)).toMatchObject({ ok: true, ticket: { assignee: null } });
expect(assign({ ...t, status: 'resolved' }, 'Emre')).toEqual({ ok: false, error: 'resolved' });
expect(assign(t, 'Bilinmeyen')).toEqual({ ok: false, error: 'unknownAssignee' });
// değişmezlik: applyAction ve assign girdiyi değiştirmez (Object.freeze edilmiş talep fırlatmaz)
// doğrulama — Review Focus 4
expect(validateDraft({ title: '  Yazıcı   çalışmıyor ', category: 'hardware', priority: 'urgent', requester: ' Ayşe ' }, 'id1', NOW)).toEqual({
  ok: true,
  ticket: { id: 'id1', title: 'Yazıcı çalışmıyor', category: 'hardware', priority: 'urgent', requester: 'Ayşe', assignee: null, status: 'new', openedAt: NOW, resolvedAt: null },
});
for (const title of ['', '   ', 'ab', 'x'.repeat(81)]) /* errors.title === 'titleLength' */;
expect(validateDraft({ ...ok, title: 'x'.repeat(80) }, 'i', NOW).ok).toBe(true);
expect(validateDraft({ title: '', category: 'yok', priority: 'acil', requester: 'A' }, 'i', NOW)).toEqual({
  ok: false, errors: { title: 'titleLength', category: 'categoryInvalid', priority: 'priorityInvalid', requester: 'requesterLength' },
});
// HTML içeren başlık geçerlidir ve olduğu gibi saklanır (kaçış arayüzün işi: textContent)
expect(validateDraft({ ...ok, title: '<img src=x onerror=alert(1)>' }, 'i', NOW)).toMatchObject({ ok: true, ticket: { title: '<img src=x onerror=alert(1)>' } });
// sıralama ve gruplama
// sortForColumn: [low/eski, urgent/yeni, normal, urgent/eski] → [urgent/eski, urgent/yeni, normal, low]; girdiyi değiştirmez
// groupByStatus: dört anahtar da her zaman vardır (boş dizi dahil)
// replaceTicket: yalnızca aynı id'li kayıt değişir; yeni dizi döner; id yoksa dizi aynı içerikle döner
```

- [ ] **Step 2:** `npm test` → FAIL. `tickets.ts` yazılır → PASS.
- [ ] **Step 3:** Commit: `feat: destek talebi kuralları (TDD)`.

### Task 3: Süre, hedef ve özet (TDD)

**Files:** Create: `src/demos/helpdesk/timing.ts`, `tests/helpdesk-timing.test.ts`

**Interfaces — consumes:** `Ticket`, `TicketPriority` (Task 2). **Produces:**
```ts
export const TARGET_MINUTES: Record<TicketPriority, number>;   // urgent 240, normal 1440, low 4320
export function ageMinutes(ticket: Ticket, now: number): number;           // tam dakika, aşağı yuvarlanır, en az 0
export function isOverdue(ticket: Ticket, now: number): boolean;
export function formatDuration(minutes: number, locale: Locale): string;
export interface BoardSummary { open: number; urgentOpen: number; overdue: number; longestOpenMinutes: number | null }
export function summarize(tickets: readonly Ticket[], now: number): BoardSummary;
```

- [ ] **Step 1: Başarısız testleri yaz**

```ts
const MIN = 60_000;
// süre
expect(ageMinutes(open(NOW - 45 * MIN), NOW)).toBe(45);
expect(ageMinutes(open(NOW - 59_999), NOW)).toBe(0);
expect(ageMinutes(resolved(NOW - 300 * MIN, NOW - 100 * MIN), NOW)).toBe(200);   // çözülmüşte açılıştan çözüme
// Review Focus 1: saat kayması
expect(ageMinutes(open(NOW + 10 * MIN), NOW)).toBe(0);
expect(ageMinutes(resolved(NOW, NOW - 5 * MIN), NOW)).toBe(0);
expect(Number.isNaN(ageMinutes({ ...open(NOW), openedAt: Number.NaN }, NOW))).toBe(false);
// Review Focus 2: hedef sınırı
expect(isOverdue(open(NOW - 240 * MIN, 'urgent'), NOW)).toBe(false);   // tam hedefte aşmış değil
expect(isOverdue(open(NOW - 241 * MIN, 'urgent'), NOW)).toBe(true);
expect(isOverdue(open(NOW - 1441 * MIN, 'normal'), NOW)).toBe(true);
expect(isOverdue(open(NOW - 4320 * MIN, 'low'), NOW)).toBe(false);
expect(isOverdue(resolved(NOW - 9999 * MIN, NOW - 1 * MIN, 'urgent'), NOW)).toBe(false);  // çözülmüş hiç aşmaz
// 'waiting' durumundaki talep de açık sayılır ve aşabilir
// biçim
expect(formatDuration(0, 'tr')).toBe('0 dk');      expect(formatDuration(45, 'tr')).toBe('45 dk');
expect(formatDuration(60, 'tr')).toBe('1 sa');     expect(formatDuration(200, 'tr')).toBe('3 sa 20 dk');
expect(formatDuration(1440, 'tr')).toBe('1 gün');  expect(formatDuration(3120, 'tr')).toBe('2 gün 4 sa');
expect(formatDuration(45, 'en')).toBe('45 min');   expect(formatDuration(200, 'en')).toBe('3 h 20 min');
expect(formatDuration(3120, 'en')).toBe('2 d 4 h');
expect(formatDuration(-5, 'tr')).toBe('0 dk');     // eksi süre yazılmaz
// gün gösteriminde dakika yazılmaz: 1501 dk → '1 gün 1 sa'
// özet
expect(summarize([], NOW)).toEqual({ open: 0, urgentOpen: 0, overdue: 0, longestOpenMinutes: null });
// 5 talep: 1 çözülmüş (sayılmaz), 2 acil açık (biri aşmış), 1 normal açık 3000 dk (aşmış), 1 düşük açık 10 dk
// → { open: 4, urgentOpen: 2, overdue: 2, longestOpenMinutes: 3000 }
```

- [ ] **Step 2:** `npm test` → FAIL. `timing.ts` yazılır → PASS.
- [ ] **Step 3:** Commit: `feat: destek talebi süre, hedef ve özet hesabı (TDD)`.

### Task 4: Başlangıç verisi ve depolama

**Files:** Create: `src/demos/helpdesk/seed.ts`, `src/demos/helpdesk/storage.ts`, `tests/helpdesk-storage.test.ts`

**Interfaces — consumes:** Task 2, Task 3; `KeyValueStore` tipi `src/demos/agency/storage.ts` içinden içe aktarılır. **Produces:**
```ts
// seed.ts
export function materializeSeed(now: number): Ticket[];   // 9 talep; zamanlar now'a göre
// storage.ts
export const HELPDESK_STORAGE_KEY = 'portfolio.helpdesk-demo.v1';
export function loadTickets(store: KeyValueStore | null, now: number): Ticket[];  // yoksa/geçersizse materializeSeed(now)
export function saveTickets(store: KeyValueStore | null, tickets: readonly Ticket[]): boolean;
export function clearTickets(store: KeyValueStore | null): void;
```

- [ ] **Step 1: Başarısız testleri yaz**

```ts
// başlangıç verisi (spec §4.6)
const seed = materializeSeed(NOW);
expect(seed).toHaveLength(9);
for (const status of STATUSES) expect(seed.some((t) => t.status === status)).toBe(true);
expect(seed.some((t) => isOverdue(t, NOW))).toBe(true);
expect(seed.some((t) => t.assignee === null && t.status === 'new')).toBe(true);
expect(seed.every((t) => t.openedAt <= NOW)).toBe(true);
expect(seed.filter((t) => t.status === 'resolved').every((t) => t.resolvedAt !== null && t.resolvedAt >= t.openedAt)).toBe(true);
expect(seed.filter((t) => t.status !== 'resolved').every((t) => t.resolvedAt === null)).toBe(true);
expect(seed.filter((t) => t.status !== 'new').every((t) => t.assignee !== null)).toBe(true);   // işlemdeki her talep atanmış
expect(new Set(seed.map((t) => t.id)).size).toBe(9);
// zaman kaydırılınca veri de kayar
expect(materializeSeed(NOW + 86_400_000)[0].openedAt - seed[0].openedAt).toBe(86_400_000);
// yükleme
expect(loadTickets(null, NOW)).toEqual(seed);
expect(loadTickets(fakeStore({}), NOW)).toEqual(seed);
// Review Focus 3: bozuk ya da tanınmayan değerler → başlangıç verisi
for (const bad of ['{bozuk', '', 'null', '{}', '[null]', JSON.stringify([{ id: 1 }]),
  JSON.stringify([{ ...valid, status: 'kapalı' }]), JSON.stringify([{ ...valid, category: 'x' }]),
  JSON.stringify([{ ...valid, priority: 'x' }]), JSON.stringify([{ ...valid, assignee: 'Bilinmeyen' }]),
  JSON.stringify([{ ...valid, title: '' }]), JSON.stringify([{ ...valid, openedAt: 'dün' }]),
  JSON.stringify([{ ...valid, status: 'resolved', resolvedAt: null }]),
  JSON.stringify([{ ...valid, status: 'new', resolvedAt: 5 }]),
  JSON.stringify([valid, { ...valid }])])          // yinelenen id
  expect(loadTickets(fakeStore({ [HELPDESK_STORAGE_KEY]: bad }), NOW)).toEqual(seed);
expect(loadTickets(throwingStore(), NOW)).toEqual(seed);
// boş liste geçersizdir (talep silinemediği için boş pano oluşamaz): '[]' → başlangıç verisi
// gidiş-dönüş: saveTickets ile yazılan liste loadTickets ile aynen döner; fazladan alanlar atılır
// saveTickets: null ve fırlatan depoda false döner
```

- [ ] **Step 2:** `npm test` → FAIL. `seed.ts` (göreli dakikalarla dokuz uydurma talep; kişiler soyadsız; başlıklar gündelik ofis sorunları) ve `storage.ts` yazılır → PASS.
- [ ] **Step 3:** `npm run check:anonymity` → temiz. Commit: `feat: destek talebi başlangıç verisi ve depolama`.

### Task 5: Demo arayüzü, proje ve demo sayfaları

**Files:** Create: `src/demos/helpdesk/strings.ts`, `src/demos/helpdesk/board.ts`, `src/components/demos/HelpdeskDemo.astro`, `src/pages/projeler/destek-talepleri.astro`, `src/pages/en/projects/helpdesk.astro`, `src/pages/demo/destek-talepleri.astro`, `src/pages/en/demo/helpdesk.astro`, `scripts/verify-helpdesk.mjs` · Modify: `src/layouts/Project.astro`

**Interfaces — consumes:** Task 1–4'ün tamamı; `getStore` (`src/demos/agency/storage.ts`). **Produces:** `initHelpdeskBoard(root: HTMLElement): void`; `HELPDESK_STRINGS: Record<Locale, HelpdeskStrings>`.

- [ ] **Step 1:** `strings.ts`: durum, kategori, öncelik ve eylem adları; özet etiketleri ("Açık talep", "Acil", "Hedefi aşan", "En uzun bekleyen"); form etiketleri ve dört `DraftError` mesajı; "Atanmamış"; "Hedefi aştı"; "Önce talebi birine atayın."; duyuru şablonları ("Talep {status} durumuna alındı", "Talep {name} adlı kişiye atandı", "Talep açıldı: {title}"); "Bu durumda talep yok"; "Bu demodaki kişiler ve talepler uydurmadır."; depolama notu; sıfırlama onayı; "Deneyin" başlığı ve üç madde.
- [ ] **Step 2:** `Project.astro`: `project.kind === 'concept'` ise başlık yanında `conceptBadge`, "Sorun" yerine `scenarioLabel`, "Sonuç" yerine `statusLabel`. Rozet düz metindir (çerçeveli, keskin köşeli, kehribar); başlığın üstünde değil, yanında durur.
- [ ] **Step 3:** `HelpdeskDemo.astro`: not satırları; dört değerli özet (`<dl>`, "veri şeridi" kalıbı); "Yeni talep" formu; dört sütun (`<section>` + `<h3>` + `<ul>`); sıfırlama düğmesi; `role="status" aria-live="polite"` duyuru alanı. Sunucuda `materializeSeed(Date.now())` ile başlangıç talepleri eylem düğmesi olmadan çizilir (JavaScript yokken okunur). Düzen: ≥ 1024px dört sütun, altında tek sütun. Stiller `DESIGN.md`'ye uyar.
- [ ] **Step 4:** `board.ts`: durum `{ tickets, now }`; her eylem saf fonksiyonla yeni liste üretir, kaydeder, yeniden çizer. Talep kutusu: başlık, "kategori · öncelik", talep eden, atama `<select>`i (çözülmüşte devre dışı), süre ve varsa "Hedefi aştı", izinli eylem düğmeleri. Yeniden çizimden sonra odak, eylemin yapıldığı talebin ilk düğmesine (yoksa kutunun kendisine, `tabindex="-1"`) geri verilir. `unassigned` hatasında mesaj duyurulur ve odak o talebin atama alanına gider. Süreler 60 sn'de bir yenilenir; yenileme odağı ve açık seçim alanını bozmaz (yalnızca süre ve işaret metinleri güncellenir). Tüm metin `textContent` ile yazılır.
- [ ] **Step 5:** Dört sayfa: proje sayfaları `Project` düzeniyle (`id="helpdesk"`), demo sayfaları `DemoPage` düzeniyle.
- [ ] **Step 6:** `scripts/verify-helpdesk.mjs` (diğer doğrulama betikleriyle aynı kalıp; görünmez tarayıcı; 1440 / 768 / 360):
  - başlangıç: 9 talep, dört sütun başlığı, özet değerleri dolu, "Konsept" rozeti ve "Durum" başlığı görünür, "Sonuç" başlığı yok
  - atanmamış yeni talepte "İşleme al" → "Önce talebi birine atayın." duyurulur, talep yerinde kalır, odak atama alanında
  - ata → işleme al → kullanıcıyı bekle → devam et → çöz → yeniden aç: her adımda talep doğru sütunda, "Açık talep" sayısı doğru
  - **Review Focus 5:** her eylemden sonra `document.activeElement` aynı talebin içinde (`BODY` değil)
  - boş form → dört alan hatasından ilgili olanlar; odak ilk hatalı alanda; talep eklenmez
  - **Review Focus 4:** başlığı `<img src=x onerror=alert(1)>` olan talep açılır; panoda `img` öğesi yok, metin olduğu gibi görünür
  - 81 karakterlik başlık reddedilir
  - yenileme sonrası talepler durur; sıfırlama başlangıç verisine döndürür; depoya `{bozuk` yazılıp yenilenince demo açılır
  - depolama kapalıyken not görünür ve talep bellekte eklenir
  - yatay taşma yok; yakalanmamış hata ve konsol hatası yok; dil değiştirici karşı sayfaya gider
- [ ] **Step 7:** `npm run build`; önizleme sunucusu; `SHOTS_BASE_URL=http://localhost:4322 node scripts/verify-helpdesk.mjs` → tümü geçer. Betik sonunda açık tarayıcı penceresi kalmadığı doğrulanır.
- [ ] **Step 8:** Commit: `feat: destek talepleri demosu ve proje sayfası`.

### Task 6: Ana sayfa bölümü ve CV

**Files:** Modify: `src/components/home/ProjectScene.astro`, `src/pages/index.astro`, `src/pages/en/index.astro`, `src/content/types.ts` (CvContent), `src/content/cv.tr.ts`, `src/content/cv.en.ts`, `src/components/CvDocument.astro`, `public/cv/*.pdf`

**Interfaces — consumes:** `getConceptProjects`, `conceptHeading`, `conceptLead`, `scenarioLabel`, `showsLabel` (Task 1).

- [ ] **Step 1:** `ProjectScene.astro`: konseptte terimler `scenarioLabel` ve `showsLabel`; başlık yanında `conceptBadge`. Yeni prop `headingLevel?: 2 | 3` (varsayılan 2): başlık etiketi buna göre `h2` ya da `h3` çizilir, görünüm aynı kalır.
- [ ] **Step 2:** Ana sayfalar: `#projeler` bloğundan sonra, "Nasıl çalışıyorum"dan önce yeni bir blok: görünür `<h2>` (`conceptHeading`, Headline ölçüsünde), altında `conceptLead` paragrafı, sonra konsept `ProjectScene` (h3 düzeyinde başlık; başlık sırası H2 → H3 korunur). Görüntü henüz yoksa `Scene` yer tutucu çizer; `check-build.mjs` bu aşamada `helpdesk` sahnesini aramaz (Task 7'de eklenir).
- [ ] **Step 3:** CV: `CvContent`'e `conceptNote: string` ("Konsept" / "Concept"); `CvDocument.astro` projeler listesinin sonuna konsept projeyi `{title} ({conceptNote})` biçiminde ekler. `npm run build:cv` ile PDF'ler yenilenir; betik "1 sayfa" bildirmelidir. İki sayfaya taşarsa yazdırma düzeninde proje özetleri arası boşluk daraltılır ve yeniden üretilir.
- [ ] **Step 4:** Doğrulama: `dist/sitemap-0.xml` içinde 12 adres (iki yeni proje sayfası dahil, demo sayfaları hariç); ana sayfada hero metni değişmemiş (`grep` ile "üç" cümlesi); `verify-cinematic.mjs` hâlâ 26/26.
- [ ] **Step 5:** Commit: `feat: ana sayfada konsept bölümü ve cv satırı`.

### Task 7: Sahne görüntüsü

**Files:** Modify: `scripts/encode-media.mjs` (`SCENES`), `scripts/check-build.mjs` (`SCENES`), `tests/check-build.test.ts` (sahne listesi), `docs/media-prompts.md` · Create: `media-src/helpdesk*.png|mp4` (repoya girmez), `public/media/helpdesk-*`

- [ ] **Step 1: Onay 3 (maliyet).** `balance` okunur; iki kare (GPT Image 2.5, 2K, orta kalite, 1 kredi) ve bir klip (Kling 3.0 Pro, 5 sn, sessiz, 8,75 kredi) için tahmini 11 kredi ve kalan bakiye Baran'a söylenir.
- [ ] **Step 2:** Çapa kare (başlangıç): gece, koyu ahşap masa, kapalı bir monitör; monitörün kenarlarına ve masaya üst üste yapıştırılmış sarı ve turuncu yapışkan notlar; notlardaki yazı okunmaz çizgiler. Sıcak kehribar lamba ışığı, soğuk koyu gölge; sol üçte bir sakin. İnsan, okunabilir yazı, logo, marka yok.
- [ ] **Step 3:** Bitiş karesi çapa kareden türetilir: aynı kadraj; notlar yok; monitör açık ve dört sütunlu düzenli bir pano gösteriyor (kutular ve çubuklar; okunabilir yazı yok).
- [ ] **Step 4: Onay 3 (kareler).** İki kare Baran'a gösterilir. Onaylanınca klip: notlar tek tek kalkıp ekrana doğru kaybolur, ekran açılır, sütunlar dolar; kamera sabit.
- [ ] **Step 5:** Kare ve klip tam boyutta incelenir (okunabilir yazı, logo, tanınabilir yer varsa reddedilir). `SCENES` listelerine `helpdesk` eklenir (`check-build.test.ts` önce güncellenir ve başarısız olduğu görülür); `node scripts/encode-media.mjs helpdesk`; `docs/media-prompts.md` güncellenir.
- [ ] **Step 6:** `npm test`, `npm run build` → derleme sonrası denetim "6 sahne" bildirir. Commit: `feat: konsept bölümünün sahne görüntüsü`.

### Task 8: Doğrulama ve yayın

- [ ] **Step 1:** `npm test` → tümü geçer. `npm run build` → temiz; `npm run check:history` → temiz.
- [ ] **Step 2:** Derlenmiş siteye karşı: `verify-helpdesk`, `verify-cinematic`, `verify-qr-menu`, `verify-agency`, `verify-lobby`, `verify-review-fixes` → tümü geçer.
- [ ] **Step 3:** `scripts/lighthouse.mjs` yol listesine iki yeni proje sayfası eklenir; mobil ve masaüstü ölçülür; eşikler karşılanır. Ölçüm sonrası açık tarayıcı penceresi kalmadığı pencere listesiyle doğrulanır.
- [ ] **Step 4:** `scripts/capture-review.mjs` sayfa listesine yeni proje sayfası eklenir; görüntüler alınır ve gözle bakılır: ana sayfada konsept bölümü, proje sayfası, demo (1440 ve 360).
- [ ] **Step 5:** `DESIGN.md`'ye yeni bileşen (talep kutusu, pano sütunu, konsept rozeti) kısa birer satırla eklenir; `PROGRESS.md` ve `DECISIONS.md` güncellenir.
- [ ] **Step 6: Onay 4.** Baran'a yerelde gösterilir (tarayıcı paneli + görüntüler). Onaydan sonra `git push origin main`; yayın akışı izlenir; canlı adreste yeni sayfalar 200 döner ve `verify-helpdesk` canlıya karşı bir kez çalıştırılır.
