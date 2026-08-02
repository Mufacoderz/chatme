# AGENTS.md — Aturan Kerja

## Workflow Umum

1. **Planning dulu.** Sebelum mulai ngerjain, susun dulu daftar commit apa aja yang bakal dibuat. Catat urutan & nama commit-nya.
2. **Commit per bagian.** Commit di setiap bagian/tahap yang sudah selesai dan menurutmu sudah saatnya commit. Jangan nunggu semuanya kelar baru commit sekali.
3. **Pesan commit singkat & jelas.** Pakai format conventional commit, contoh:
   - `feat: add login google oauth`
   - `fix: ghost click pada modal chat`
   - `refactor: pisah logika auth ke hook`
   - `style: restyle delete room modal`
   - `docs: tambah AGENTS.md`
   - `chore: update dependencies`
4. **Verifikasi dulu, baru push.** Setiap kali selesai (per bagian atau keseluruhan), jalankan verifikasi/lint/build/test kalau ada, pastikan bersih. Baru `git push`.

## Aturan Lain

- Jangan commit file `.env`, `.env.example`, dan file secret lain. Pastikan tetap di `.gitignore`.
- Jangan tambah komentar kode kecuali diminta user.
- Ikuti konvensi & gaya kode yang sudah ada di repo.
- Jangan push kalau masih ada error/verifikasi gagal.
