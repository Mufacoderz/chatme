import { SkeletonBlock } from "@/components/ui/Skeleton"

export default function ProfileLoading() {
  return (
    <main className="min-h-full flex-1 overflow-y-auto bg-[var(--bg)] p-3 sm:p-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <SkeletonBlock className="h-10 w-10 rounded-xl" />
          <div className="flex flex-col gap-2">
            <SkeletonBlock className="h-4 w-32 rounded-full" />
            <SkeletonBlock className="h-3 w-48 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Akun */}
          <section>
            <SkeletonBlock className="mb-2 h-3 w-12 rounded-full" />
            <div className="neo-panel rounded-2xl bg-[var(--surface)] p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <SkeletonBlock className="h-16 w-16 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                  <SkeletonBlock className="mb-2 h-3 w-24 rounded-full" />
                  <SkeletonBlock className="h-4 w-40 rounded-full" />
                  <SkeletonBlock className="mt-2 h-3 w-32 rounded-full" />
                </div>
              </div>

              <div className="my-6 border-t-2 border-dashed border-[var(--neo-line)]" />

              <div className="divide-y divide-dashed divide-[var(--neo-line)] overflow-hidden rounded-xl border-2 border-[var(--neo-line)] bg-[var(--surface2)]">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-4">
                    <SkeletonBlock className="h-9 w-9 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <SkeletonBlock className="mb-1.5 h-2 w-20 rounded-full" />
                      <SkeletonBlock className="h-3 w-36 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Aktivitas */}
          <section>
            <SkeletonBlock className="mb-2 h-3 w-14 rounded-full" />
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="neo-card rounded-xl bg-[var(--surface)] p-4 text-center">
                  <SkeletonBlock className="mx-auto mb-2 h-3 w-3 rounded-md" />
                  <SkeletonBlock className="mx-auto mb-2 h-6 w-12 rounded-md" />
                  <SkeletonBlock className="mx-auto h-2 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </section>

          {/* Preferensi */}
          <section>
            <SkeletonBlock className="mb-2 h-3 w-16 rounded-full" />
            <SkeletonBlock className="h-12 w-full rounded-xl" />
          </section>

          {/* Sesi */}
          <section>
            <SkeletonBlock className="mb-2 h-3 w-10 rounded-full" />
            <SkeletonBlock className="h-12 w-full rounded-xl" />
          </section>

          {/* Danger Zone */}
          <section>
            <SkeletonBlock className="mb-2 h-3 w-20 rounded-full" />
            <SkeletonBlock className="h-16 w-full rounded-xl" />
          </section>
        </div>
      </div>
    </main>
  )
}
