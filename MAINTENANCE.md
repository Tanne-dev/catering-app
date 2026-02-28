# Underhåll och innehåll

Kort guide för att uppdatera innehåll och konfiguration utan att ändra kod överallt.

## Datafiler (ändra innehåll här)

| Fil | Innehåll |
|-----|----------|
| `src/data/contact.ts` | Telefon, e-post, svarstid |
| `src/data/site.ts` | Sidtitel, beskrivning, webbadress, sökord (SEO) |
| `src/data/testimonials.ts` | Kundomdömen (namn, betyg, text, datum) |
| `src/data/services.ts` | Tjänster (t.ex. Cateringleverans) |
| `src/data/vara-tjanster-content.ts` | Texter för Våra tjänster, leverans, villkor, sushimeny m.m. |
| `src/data/asiatisk-menu.ts` | Asiatisk meny |
| `src/data/dish-slider-images.ts` | Lista över bilder i "Rätter vi serverat" |

## Miljövariabler (valfritt)

- `.env.local`: `RESEND_API_KEY` – API-nyckel från [resend.com](https://resend.com) för att skicka e-post (Skicka förfrågan, Skicka omdöme). `RESEND_FROM` – avsändaradress (måste verifieras i Resend; använd `onboarding@resend.dev` för test). `RESEND_WEBHOOK_SECRET` – webhook signing secret (whsec_...) om du konfigurerar Resend webhooks.
- `.env.local`: `NEXT_PUBLIC_SITE_URL` – canonical URL (t.ex. `https://cateringtanne.se`) för SEO och sitemap.

## Nya bilder

- Lägg bilder i `public/` eller `public/dishes/`.
- Uppdatera referenser i rätt datafil eller komponent.

## Bygg och deploy

```bash
npm ci
npm run build
npm run start
```

Se `DEPLOY.md` för publicering.
