# Hướng dẫn Setup n8n cho Chatbot

## Bước 1: Tạo Google Sheets

Tạo một Google Sheet mới với 3 sheets:

### Sheet 1: `Intents`
| intent_id | keywords_sv | keywords_extra | response_sv | action |
|-----------|-------------|----------------|-------------|--------|
| meny | meny, menyer, asiatisk, sushi, vietnamesisk | menu, mat | Vi har flera menyer: Sushi, Asiatisk och Sallader Bufféer. Kolla gärna våra menyer på sidan! | show_meny |
| priser | pris, priser, kostnad, pris | price, cost | Vi skickar gärna en offert baserat på antal gäster och meny. Kontakta oss via formuläret eller ring oss! | send_offer |
| allergi | allergi, allergen | allergy | Vi kan anpassa menyn efter allergier. Allergener finns angivna för varje rätt. Berätta gärna om dina allergier när du beställer. | info |
| bokning | boka, bokning, beställa, datum | book, order | För att boka behöver vi ditt namn, e-post och telefonnummer. Kan du ge mig dessa uppgifter? | collect_contact |
| maträtter | rätter, maträtter, rätter ni serverar | dishes, food | Vi serverar sushi, asiatiska rätter och sallader. Kolla gärna våra menyer för mer detaljer! | show_dishes |
| kontakt | kontakt, ringa, mejl, telefon | contact | Ring oss: 08-123 456 78 eller mejla oss via kontaktformuläret på sidan. | info |
| default | - | - | Jag förstod inte helt. Vill du veta om menyer, priser eller bokning? | ask_clarify |

### Sheet 2: `Matratter` (tùy chọn)
| id | namn_sv | beskrivning_sv | allergener | kategori |
|----|---------|----------------|------------|----------|
| 1 | Sushi | Färsk sushi med hög kvalitet | Fisk, gluten | sushi |
| 2 | Asiatisk meny | Autentiska vietnamesiska och asiatiska rätter | Gluten, soja | asiatisk |

### Sheet 3: `Kundinfo`
| timestamp | session_id | namn | epost | telefon | meddelande | intent |
|-----------|------------|------|-------|---------|------------|--------|
| (auto-filled) | (auto-filled) | (auto-filled) | (auto-filled) | (auto-filled) | (auto-filled) | (auto-filled) |

**Lưu ý:** Chia sẻ Google Sheet với service account email từ n8n (xem bước 2).

---

## Bước 2: Setup n8n Credentials

### Google Sheets Credential:
1. Vào **Settings** → **Credentials** → **Add Credential** → **Google Sheets API**
2. Chọn **Service Account**
3. Tạo Service Account mới trên Google Cloud Console:
   - Vào [Google Cloud Console](https://console.cloud.google.com/)
   - Tạo project mới hoặc chọn project có sẵn
   - Enable **Google Sheets API**
   - Tạo **Service Account** → Download JSON key
   - Copy email của service account (dạng `xxx@xxx.iam.gserviceaccount.com`)
   - Chia sẻ Google Sheet với email này (quyền Editor)
4. Upload JSON key vào n8n credential

---

## Bước 3: Tạo n8n Workflow

### Workflow cơ bản (không dùng AI):

```
1. Webhook (POST)
   ↓
2. Code Node - Extract Intent (từ khóa matching)
   ↓
3. Google Sheets - Read Intents sheet
   ↓
4. Switch Node - Theo action
   ├─ show_meny → Format reply với menu info
   ├─ collect_contact → Check conversation state
   │   ├─ Chưa đủ → Ask for info
   │   └─ Đủ → Write to Kundinfo sheet
   └─ default → Return response_sv
   ↓
5. Respond to Webhook
```

### Chi tiết từng node:

#### Node 1: Webhook
- **Method:** POST
- **Path:** `/chat` (hoặc tên bạn muốn)
- **Response Mode:** Respond to Webhook
- **Output:** Body sẽ có `{ message, sessionId, conversation }`

#### Node 2: Code - Extract Intent
```javascript
const message = $input.item.json.message.toLowerCase();
const keywords = {
  meny: ['meny', 'menyer', 'asiatisk', 'sushi', 'vietnamesisk', 'menu', 'mat'],
  priser: ['pris', 'priser', 'kostnad', 'price', 'cost'],
  allergi: ['allergi', 'allergen', 'allergy'],
  bokning: ['boka', 'bokning', 'beställa', 'datum', 'book', 'order'],
  maträtter: ['rätter', 'maträtter', 'dishes', 'food'],
  kontakt: ['kontakt', 'ringa', 'mejl', 'telefon', 'contact']
};

let intent = 'default';
for (const [key, words] of Object.entries(keywords)) {
  if (words.some(word => message.includes(word))) {
    intent = key;
    break;
  }
}

return { json: { intent, message: $input.item.json.message, sessionId: $input.item.json.sessionId, conversation: $input.item.json.conversation } };
```

#### Node 3: Google Sheets - Read Intents
- **Operation:** Read
- **Document ID:** (ID của Google Sheet)
- **Sheet Name:** `Intents`
- **Range:** `A:E` (hoặc toàn bộ)
- **Filter:** `intent_id = {{ $json.intent }}`

#### Node 4: Switch - Theo action
- **Mode:** Rules
- **Rules:**
  - `{{ $json.action }}` equals `show_meny` → Node format menu
  - `{{ $json.action }}` equals `collect_contact` → Node check contact info
  - `{{ $json.action }}` equals `info` → Node return response
  - Default → Node return response

#### Node 5: Respond to Webhook
- **Response Body:**
```json
{
  "reply": "{{ $json.response_sv }}",
  "action": "{{ $json.action }}"
}
```

---

## Bước 4: Lấy Webhook URL

1. Sau khi tạo workflow, **Save** và **Activate** workflow
2. Copy **Production URL** từ Webhook node
3. URL sẽ có dạng: `https://your-n8n-instance.com/webhook/chat` hoặc `https://your-n8n-instance.com/webhook/xxxx-xxxx-xxxx`

---

## Bước 5: Cấu hình Next.js

1. Tạo file `.env.local` trong root của `catering-app/`:
```env
N8N_CHAT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat
```

2. Restart dev server để load biến môi trường mới

---

## Bước 6: Test

1. Mở website và click vào chatbot
2. Gửi tin nhắn: "Vad har ni för menyer?"
3. Kiểm tra:
   - Chatbot trả lời đúng
   - n8n workflow chạy thành công
   - (Nếu có) Google Sheet được cập nhật

---

## Nâng cao: Thêm AI Intent Classification

Nếu muốn dùng AI để phân tích intent chính xác hơn:

### Thêm OpenAI Node sau Webhook:

1. **Node:** OpenAI
2. **Operation:** Chat
3. **Model:** `gpt-3.5-turbo` hoặc `gpt-4`
4. **System Message:**
```
Du är en chatbot för Catering Tanne. Klassificera användarens avsikt till exakt en av dessa: meny, priser, allergi, bokning, maträtter, kontakt, default. Svara bara med ett ord.
```
5. **User Message:** `{{ $json.message }}`
6. **Output:** Parse response để lấy intent (chỉ lấy từ đầu tiên)

---

## Troubleshooting

### Chatbot không trả lời:
- Kiểm tra `N8N_CHAT_WEBHOOK_URL` trong `.env.local`
- Kiểm tra n8n workflow đã được Activate chưa
- Xem logs trong n8n Execution History

### Google Sheets không được đọc/ghi:
- Kiểm tra Service Account đã được chia sẻ Sheet chưa
- Kiểm tra credential trong n8n đúng chưa
- Kiểm tra Sheet ID và Sheet name đúng chưa

### Intent không đúng:
- Thêm nhiều từ khóa vào `keywords_sv` và `keywords_extra`
- Hoặc chuyển sang dùng AI classification
