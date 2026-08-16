import { Client } from "@upstash/qstash";

process.loadEnvFile(".env");

const qstashUrl = process.env.US_EAST_1_QSTASH_URL;
const qstashToken = process.env.US_EAST_1_QSTASH_TOKEN;

if (!qstashUrl || !qstashToken) {
  console.error(
    "US_EAST_1_QSTASH_URL / US_EAST_1_QSTASH_TOKEN belum di-set di .env",
  );
  process.exit(1);
}

const destination = "https://chatme-jet.vercel.app/api/cron/check-reminders";

const client = new Client({
  token: qstashToken,
  baseUrl: qstashUrl,
});

try {
  const schedules = await client.schedules.list();

  let deleted = 0;

  for (const schedule of schedules) {
    if (schedule.destination === destination) {
      await client.schedules.delete(schedule.scheduleId);

      console.log("Schedule dihentikan:", schedule.scheduleId);
      deleted++;
    }
  }

  if (deleted === 0) {
    console.log("Tidak ada schedule check-reminders yang aktif.");
  } else {
    console.log(`Total schedule dihentikan: ${deleted}`);
  }
} catch (err) {
  console.error("Gagal menghentikan schedule QStash:", err);
  process.exit(1);
}
