# Baran Berkay Bostan — Portföy

Kişisel portföy sitem: [baranbostan1.github.io](https://baranbostan1.github.io)

Bir otelin resepsiyonunda çalışırken işin içindeki eksikleri gördüm ve aynı işletme için üç dijital araç geliştirdim. Bu site o üç aracı, çalışan demolarıyla birlikte anlatıyor:

- **QR Menü** — QR kodla açılan dijital menü
- **Lobi Bilgi Ekranı** — TV'de 7/24 açık kalan bilgi paneli (canlı saat, döviz kuru, hava durumu)
- **Acenta Fatura ve Ödeme Takibi** — acenta bazında bakiye gösteren dahili araç

Demolardaki otel, restoran, acenta adları ve tüm tutarlar kurgusaldır.

## Nasıl yapıldı

Sorunun tespiti, ürün kararları ve doğrulama bende; kodu AI araçlarıyla (Claude Code) ürettim, okuyup yönlendirdim. Sahne görüntüleri yapay zekâ ile üretildi ([üretim kaydı](docs/media-prompts.md)). Alınan kararlar ve gerekçeleri [DECISIONS.md](DECISIONS.md) dosyasında.

- [Astro](https://astro.build) (statik çıktı), Tailwind CSS, TypeScript
- Türkçe (`/`) ve İngilizce (`/en/`)
- Backend ve veritabanı yok; demolar tamamen tarayıcıda çalışır
- Acenta bakiye mantığı test-önce (TDD) yazıldı; birim testleri Vitest ile

## Yerelde çalıştırma

Node.js 22.12 ya da üstü gerekir.

```bash
npm install
npm run dev
```

Testler ve derleme:

```bash
npm test
npm run build
```

Derleme, repoya girmeyen yerel bir kelime listesiyle anonimlik denetimi yapar. Liste yoksa yerelde derleme durur; denetimi atlayıp derlemek için `CI=true npm run build` kullanılabilir.

---

# Baran Berkay Bostan — Portfolio

My personal portfolio: [baranbostan1.github.io/en](https://baranbostan1.github.io/en/)

While working at a hotel front desk I saw what was missing in the day-to-day work and built three digital tools for the same business. This site presents them, each with a working demo:

- **QR Menu** — a digital menu opened by QR code
- **Lobby Information Display** — an always-on information panel for a TV (live clock, exchange rates, weather)
- **Agency Invoice and Payment Tracker** — an internal tool showing the balance per travel agency

The hotel, restaurant and agency names in the demos, and all amounts, are fictional.

## How it was built

Spotting the problem, the product decisions and the verification are mine; I produced the code with AI tools (Claude Code), reading and steering it. The scene footage is AI-generated. Built with Astro (static output), Tailwind CSS and TypeScript; no backend, no database.

```bash
npm install
npm run dev
```
