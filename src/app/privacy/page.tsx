import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kebijakan Privasi — Chatme",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-10 sm:py-16">
      <article className="mx-auto w-full max-w-2xl">
        <h1 className="font-sora text-2xl font-black text-[var(--text)]">
          Kebijakan Privasi Chatme
        </h1>
        <p className="mt-1 text-xs text-[var(--text3)]">
          Berlaku sejak: [ISI TANGGAL PUBLISH]
        </p>

        <div className="mt-6 space-y-5 text-[var(--text2)]">
          <section>
            <h2 className="font-sora text-base font-bold text-[var(--text)]">1. Pendahuluan</h2>
            <p className="mt-1 text-sm leading-relaxed">
              Chatme (&quot;kami&quot;, &quot;layanan&quot;) adalah aplikasi catatan personal
              dan pengingat berbasis chat, dikembangkan sebagai proyek independen oleh
              Fadil. Kebijakan ini menjelaskan data apa yang kami kumpulkan dari kamu
              (&quot;pengguna&quot;), untuk apa data itu dipakai, dan hak yang kamu punya
              atas data tersebut.
            </p>
          </section>

          <section>
            <h2 className="font-sora text-base font-bold text-[var(--text)]">2. Data yang kami kumpulkan</h2>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              <li>
                <strong>Data akun (via Google Sign-In):</strong> nama, alamat email, dan
                foto profil. Kami tidak pernah melihat atau menyimpan password Google
                kamu — proses login sepenuhnya ditangani oleh Google.
              </li>
              <li>
                <strong>Data yang kamu buat sendiri di aplikasi:</strong> nama & ikon
                room, isi catatan, checklist beserta isinya, dan waktu pengingat yang
                kamu atur.
              </li>
              <li>
                <strong>Data teknis:</strong> cookie sesi login, supaya kamu tetap masuk
                tanpa perlu login ulang tiap kunjungan.
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              Kami tidak menggunakan layanan analitik atau pelacak pihak ketiga apa pun.
            </p>
          </section>

          <section>
            <h2 className="font-sora text-base font-bold text-[var(--text)]">3. Bagaimana kami menggunakan data</h2>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              <li>Menjalankan fungsi inti aplikasi: menampilkan catatan kamu, mengirim pengingat, menyimpan progres checklist.</li>
              <li>Menjaga kamu tetap login antar sesi.</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              Kami <strong>tidak</strong> menggunakan isi catatan kamu untuk iklan,
              melatih model AI, atau tujuan apa pun di luar menjalankan layanan ini
              untuk kamu.
            </p>
          </section>

          <section>
            <h2 className="font-sora text-base font-bold text-[var(--text)]">4. Berbagi data</h2>
            <p className="mt-1 text-sm leading-relaxed">
              Kami tidak menjual atau membagikan data kamu ke pihak ketiga untuk
              kepentingan pemasaran. Data hanya diproses oleh penyedia infrastruktur
              yang memang dibutuhkan supaya Chatme bisa berjalan:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              <li><strong>Google</strong> — untuk proses autentikasi (Sign in with Google).</li>
              <li><strong>Vercel</strong> — sebagai penyedia hosting aplikasi.</li>
              <li><strong>Neon</strong> — sebagai penyedia database tempat data kamu disimpan.</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              Ketiganya memproses data atas nama kami, bukan untuk kepentingan mereka
              sendiri.
            </p>
          </section>

          <section>
            <h2 className="font-sora text-base font-bold text-[var(--text)]">5. Penyimpanan &amp; keamanan</h2>
            <p className="mt-1 text-sm leading-relaxed">
              Data disimpan di database Neon (PostgreSQL) dan tetap ada selama akun
              kamu aktif. Kami menerapkan praktik keamanan standar (koneksi
              terenkripsi/HTTPS, sesi login yang ditandatangani), tapi seperti layanan
              digital pada umumnya, kami tidak bisa menjamin keamanan 100%.
            </p>
          </section>

          <section>
            <h2 className="font-sora text-base font-bold text-[var(--text)]">6. Hak kamu</h2>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              <li>
                <strong>Akses &amp; koreksi:</strong> kamu bisa melihat, mengubah, atau
                menghapus catatan kamu sendiri kapan saja langsung dari aplikasi.
              </li>
              <li>
                <strong>Hapus akun:</strong> kamu bisa menghapus akun beserta seluruh
                data terkait (room, catatan, checklist, pengingat) secara permanen
                lewat menu <strong>Hapus Akun</strong> di halaman Profil. Tindakan ini
                tidak bisa dibatalkan.
              </li>
              <li>
                Pertanyaan lain soal data kamu bisa dikirim ke{" "}
                <a href="mailto:[EMAIL_KONTAK_KAMU]" className="underline">
                  [EMAIL_KONTAK_KAMU]
                </a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-sora text-base font-bold text-[var(--text)]">7. Retensi data</h2>
            <p className="mt-1 text-sm leading-relaxed">
              Data kamu disimpan selama akun masih ada. Begitu akun dihapus, seluruh
              data terkait dihapus permanen dari database kami.
            </p>
          </section>

          <section>
            <h2 className="font-sora text-base font-bold text-[var(--text)]">8. Anak-anak</h2>
            <p className="mt-1 text-sm leading-relaxed">
              Chatme tidak ditujukan untuk anak-anak di bawah usia 13 tahun, dan kami
              tidak sengaja mengumpulkan data dari mereka.
            </p>
          </section>

          <section>
            <h2 className="font-sora text-base font-bold text-[var(--text)]">9. Perubahan kebijakan</h2>
            <p className="mt-1 text-sm leading-relaxed">
              Kebijakan ini bisa diperbarui sewaktu-waktu, misalnya saat kami menambah
              fitur baru yang mengumpulkan data tambahan. Tanggal &quot;Berlaku
              sejak&quot; di atas akan diperbarui setiap ada perubahan.
            </p>
          </section>

          <section>
            <h2 className="font-sora text-base font-bold text-[var(--text)]">10. Kontak</h2>
            <p className="mt-1 text-sm leading-relaxed">
              Ada pertanyaan soal privasi atau data kamu? Hubungi{" "}
              <a href="mailto:[EMAIL_KONTAK_KAMU]" className="underline">
                [EMAIL_KONTAK_KAMU]
              </a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
