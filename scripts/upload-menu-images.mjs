#!/usr/bin/env node
/**
 * Upload ảnh menu từ public/ lên Supabase Storage.
 * Chạy: node scripts/upload-menu-images.mjs
 * Cần: public/dishes/*.png, public/sushi-*.png, public/sallad-*.png
 */
import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");

// Load .env.local
try {
  const envPath = join(root, ".env.local");
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf8");
    content.split("\n").forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    });
  }
} catch (_) {}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_ANON_KEY trong .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);
const BUCKET = "menu-images";

async function uploadFile(localPath, storagePath) {
  const buf = readFileSync(localPath);
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buf, {
    contentType: "image/png",
    upsert: true,
  });
  if (error) throw error;
  console.log("  ✓", storagePath);
}

async function main() {
  const uploaded = [];
  if (existsSync(join(publicDir, "dishes"))) {
    const files = readdirSync(join(publicDir, "dishes")).filter((f) => /\.(png|jpg|jpeg|webp|gif)$/i.test(f));
    for (const f of files) {
      await uploadFile(join(publicDir, "dishes", f), `dishes/${f}`);
      uploaded.push(`/dishes/${f}`);
    }
  }
  const rootFiles = existsSync(publicDir) ? readdirSync(publicDir) : [];
  for (const f of rootFiles) {
    if (/^(sushi-|sallad-|vara-tjanster).*\.(png|jpg|jpeg|webp|gif)$/i.test(f)) {
      await uploadFile(join(publicDir, f), f);
      uploaded.push(`/${f}`);
    }
  }
  if (uploaded.length === 0) {
    console.log("Không tìm thấy ảnh trong public/dishes/ hoặc public/sushi-*.png");
    console.log("Thêm ảnh vào các thư mục trên rồi chạy lại.");
    return;
  }
  const baseUrl = url.replace(/\/$/, "") + "/storage/v1/object/public/" + BUCKET;
  console.log("\nĐã upload", uploaded.length, "ảnh. Chạy SQL sau trong Supabase SQL Editor:\n");
  console.log("-- Cập nhật menu_items sang URL Supabase Storage");
  console.log(`UPDATE menu_items SET image = '${baseUrl}' || substring(image from 2) WHERE image IS NOT NULL AND image LIKE '/%' AND image NOT LIKE 'http%';`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
