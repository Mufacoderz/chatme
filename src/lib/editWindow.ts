// Batas waktu edit catatan: 24 jam rolling sejak createdAt.
// Dipakai server (enforce) dan client (sembunyikan tombol edit) biar
// angka magic-nya gak dobel.
export const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000
