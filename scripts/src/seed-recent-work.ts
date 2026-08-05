/**
 * One-time seed: copies all hardcoded photography/videography content into
 * the recent_work table with active = false so nothing appears in the carousel
 * until explicitly promoted via the portal.
 *
 * Run: pnpm --filter @workspace/scripts run seed-recent-work
 * Safe to run multiple times — skips existing rows by embed_url.
 */

import { db, recentWorkTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// Build a date N minutes ago so ordering is preserved (first item = oldest)
function dateAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60 * 1000);
}

type SeedItem = {
  type: "photo" | "video";
  embedUrl: string;
  title: string;
  category: "Music" | "Sports" | "Hospitality & Events" | "Snow";
  active: boolean;
  aspectRatio: string;
  altText?: string;
  minutesAgo: number;
};

// Items are listed oldest-first within each category so that
// sorting by date_added DESC in the portal reflects natural discovery order.
const SEED_ITEMS: SeedItem[] = [
  // ── VIDEOS ────────────────────────────────────────────────────────────────

  // Music
  { type: "video", title: "Red Clay Strays", category: "Music", aspectRatio: "9/16",
    embedUrl: "https://www.youtube.com/embed/r_59JjsZaz4?controls=0&modestbranding=1&rel=0&playsinline=1",
    active: false, minutesAgo: 30000 },

  // Sports
  { type: "video", title: "Roll South", category: "Sports", aspectRatio: "16/9",
    embedUrl: "https://www.youtube-nocookie.com/embed/XG2WVE4Y0cg?si=u48GD5YMB6n6GxiH&controls=0",
    active: false, minutesAgo: 29990 },
  { type: "video", title: "Glenbrook South Football", category: "Sports", aspectRatio: "16/9",
    embedUrl: "https://www.youtube-nocookie.com/embed/u4KPLhTTo3g?si=V7RTadZUw6uKyaJp&controls=0",
    active: false, minutesAgo: 29980 },
  { type: "video", title: "Glenbrook South Hockey", category: "Sports", aspectRatio: "16/9",
    embedUrl: "https://www.youtube-nocookie.com/embed/vSOkSNK1-E4?si=QA3ee9odZ2WRs7Jj&controls=0",
    active: false, minutesAgo: 29970 },
  { type: "video", title: "Crystal Ridge Park Follow Cam", category: "Sports", aspectRatio: "9/16",
    embedUrl: "https://www.youtube.com/embed/VwkKoKVDU3g?modestbranding=1&rel=0&playsinline=1&controls=0",
    active: false, minutesAgo: 29960 },
  { type: "video", title: "Alpine Valley Park Follow Cam #1", category: "Snow", aspectRatio: "9/16",
    embedUrl: "https://www.youtube.com/embed/o5AmOaYRXjw?modestbranding=1&rel=0&playsinline=1&controls=0",
    active: false, minutesAgo: 29950 },
  { type: "video", title: "Alpine Valley Park Follow Cam #3", category: "Snow", aspectRatio: "9/16",
    embedUrl: "https://www.youtube.com/embed/p-lvvaiAmOQ?modestbranding=1&rel=0&playsinline=1&controls=0",
    active: false, minutesAgo: 29940 },
  { type: "video", title: "Alpine Valley Park Follow Cam #2", category: "Snow", aspectRatio: "9/16",
    embedUrl: "https://www.youtube.com/embed/_H6hO0xat2s?modestbranding=1&rel=0&playsinline=1&controls=0",
    active: false, minutesAgo: 29930 },

  // Hospitality & Events
  { type: "video", title: "Ovvio", category: "Hospitality & Events", aspectRatio: "16/9",
    embedUrl: "https://www.youtube-nocookie.com/embed/vXhoXWMxVr0?si=hyk8Th8K5eyMKj-_&controls=0",
    active: false, minutesAgo: 29920 },
  { type: "video", title: "Ovvio II", category: "Hospitality & Events", aspectRatio: "16/9",
    embedUrl: "https://www.youtube-nocookie.com/embed/STKgmNhSFP0?si=CTtxMoX7NUXfw3bd&controls=0",
    active: false, minutesAgo: 29910 },
  { type: "video", title: "Alpine Valley Resorts Wedding", category: "Hospitality & Events", aspectRatio: "16/9",
    embedUrl: "https://www.youtube-nocookie.com/embed/ROQukR7EJgA?si=yfDztzVF7diBHTo4&controls=0",
    active: false, minutesAgo: 29900 },
  { type: "video", title: "Lake Forest Chiro", category: "Hospitality & Events", aspectRatio: "9/16",
    embedUrl: "https://www.youtube.com/embed/xlhhCYGaEqo?si=3GockmbNT9IHYxb0&controls=0&modestbranding=1&rel=0&playsinline=1",
    active: false, minutesAgo: 29890 },

  // ── PHOTOS ────────────────────────────────────────────────────────────────

  // Lord Huron
  { type: "photo", title: "Lord Huron live at Salt Shed", category: "Music", altText: "LORD HURON",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165049/AnnaMariaIsland-154_orakkw.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 28000 },
  { type: "photo", title: "Lord Huron concert photography", category: "Music", altText: "LORD HURON",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165048/AnnaMariaIsland-161_ovbkfe.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 27990 },
  { type: "photo", title: "Lord Huron stage performance", category: "Music", altText: "LORD HURON",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165047/AnnaMariaIsland-165_jfisyj.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 27980 },
  { type: "photo", title: "Lord Huron live music photography", category: "Music", altText: "LORD HURON",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165047/AnnaMariaIsland-172_dbxs4c.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 27970 },
  { type: "photo", title: "Lord Huron night concert", category: "Music", altText: "LORD HURON",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165041/AnnaMariaIsland-150_11.15.58_PM_aogf1u.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 27960 },
  { type: "photo", title: "Lord Huron Salt Shed Chicago", category: "Music", altText: "LORD HURON",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165040/AnnaMariaIsland-149_x04adk.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 27950 },
  { type: "photo", title: "Lord Huron concert crowd", category: "Music", altText: "LORD HURON",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165040/AnnaMariaIsland-144_inm6bg.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 27940 },
  { type: "photo", title: "Lord Huron stage lights", category: "Music", altText: "LORD HURON",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165033/AnnaMariaIsland-152_jyt3l4.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 27930 },

  // Red Clay Strays
  { type: "photo", title: "Red Clay Strays live concert", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164977/Night1RCS-09_wuu7ay.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 27000 },
  { type: "photo", title: "Red Clay Strays concert photography", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164975/Night2RCS-59_usmzzf.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26990 },
  { type: "photo", title: "Red Clay Strays stage performance", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164975/Night2RCS-64_bpfi3t.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26980 },
  { type: "photo", title: "Red Clay Strays night two", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164972/Night2RCS-10_hiaddn.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26970 },
  { type: "photo", title: "Red Clay Strays band members", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164971/Night2RCS-07_p3qppu.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26960 },
  { type: "photo", title: "Red Clay Strays live music", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164970/Night2RCS-06_ucgm4p.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26950 },
  { type: "photo", title: "Red Clay Strays night one", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164965/Night1RCS-33_df5kvd.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26940 },
  { type: "photo", title: "Red Clay Strays concert crowd", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164964/Night2RCS-55_ygkrrw.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26930 },
  { type: "photo", title: "Red Clay Strays stage", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164963/Night2RCS-05_d6xzpj.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26920 },
  { type: "photo", title: "Red Clay Strays guitarist", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164961/Night1RCS-10_wya5lw.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26910 },
  { type: "photo", title: "Red Clay Strays vocalist", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164959/Night1RCS-15_ov3rwk.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26900 },
  { type: "photo", title: "Red Clay Strays performance", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164956/Night2RCS-41_v8ds1l.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26890 },
  { type: "photo", title: "Red Clay Strays live show", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164955/Night1RCS-08_hj1ypp.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26880 },
  { type: "photo", title: "Red Clay Strays on stage", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164954/Night1RCS-19_qkusse.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26870 },
  { type: "photo", title: "Red Clay Strays concert detail", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164953/Night1RCS-26_jluiwb.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26860 },
  { type: "photo", title: "Red Clay Strays artist portrait", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164945/Night1RCS-07_aupuor.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26850 },
  { type: "photo", title: "Red Clay Strays night two close-up", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164944/Night2RCS-40_vrfj1x.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26840 },
  { type: "photo", title: "Red Clay Strays stage energy", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164942/Night1RCS-18_tb08k0.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26830 },
  { type: "photo", title: "Red Clay Strays wide shot", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164941/Night2RCS-25_dus8ln.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26820 },
  { type: "photo", title: "Red Clay Strays detail shot", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164940/Night2RCS-12_qyksgh.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26810 },
  { type: "photo", title: "Red Clay Strays live atmosphere", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164937/Night1RCS-16_eddgji.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26800 },
  { type: "photo", title: "Red Clay Strays concert final", category: "Music", altText: "RED CLAY STRAYS",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779164932/Night2RCS-13_tvecxe.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 26790 },

  // Snow photos
  { type: "photo", title: "Alpine snow photography", category: "Snow",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779239394/Alpine12_19-11_wfa9cx.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 20000 },
  { type: "photo", title: "Winter alpine landscape", category: "Snow",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779239392/Alpine12_19-08_r9s9hk.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 19990 },
  { type: "photo", title: "Snow scene photography", category: "Snow",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779239389/Alpine12_19-10_ymeprj.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 19980 },
  { type: "photo", title: "Alpine winter photography", category: "Snow",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779239388/Alpine12_19-03_xsp8jf.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 19970 },
  { type: "photo", title: "Snow landscape", category: "Snow",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779239387/Alpine12_19-06_brpy2b.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 19960 },

  // Events / Hospitality photos
  { type: "photo", title: "Event photography Chicago", category: "Hospitality & Events",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165080/DSC00952_nugqp9.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 15000 },
  { type: "photo", title: "Live event coverage", category: "Hospitality & Events",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165079/DSC01061_irfldl.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 14990 },
  { type: "photo", title: "Event photography detail", category: "Hospitality & Events",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165079/DSC01052_grjok2.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 14980 },
  { type: "photo", title: "Event photographer Chicago", category: "Hospitality & Events",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165079/DSC00948_xboict.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 14970 },
  { type: "photo", title: "Event photography atmosphere", category: "Hospitality & Events",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165078/DSC00909_rldanc.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 14960 },
  { type: "photo", title: "Event coverage photography", category: "Hospitality & Events",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165075/DSC00959_zkhvwk.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 14950 },
  { type: "photo", title: "Event photography moments", category: "Hospitality & Events",
    embedUrl: "https://res.cloudinary.com/dgqwzy1a0/image/upload/v1779165071/DSC00912_igdl4x.jpg",
    active: false, aspectRatio: "16/9", minutesAgo: 14940 },
];

async function seed() {
  console.log(`Seeding ${SEED_ITEMS.length} items into recent_work...`);
  let inserted = 0;
  let skipped = 0;

  for (const item of SEED_ITEMS) {
    // Check if this URL already exists
    const existing = await db
      .select({ id: recentWorkTable.id })
      .from(recentWorkTable)
      .where(eq(recentWorkTable.embedUrl, item.embedUrl));

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    await db.insert(recentWorkTable).values({
      type: item.type,
      embedUrl: item.embedUrl,
      title: item.title,
      category: item.category,
      active: item.active,
      aspectRatio: item.aspectRatio,
      altText: item.altText ?? null,
      dateAdded: dateAgo(item.minutesAgo),
    });
    inserted++;
  }

  console.log(`Done. Inserted: ${inserted}, Skipped (already exist): ${skipped}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
