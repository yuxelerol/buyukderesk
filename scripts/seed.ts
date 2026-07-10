import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@eskisehirbuyukderesk.com.tr" },
    update: {},
    create: {
      email: "admin@eskisehirbuyukderesk.com.tr",
      name: "Admin",
      password: adminPassword,
      role: "admin",
    },
  });

  // Site settings
  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      clubName: "Eskişehir Büyükdere Spor Kulübü",
      slogan: "Birlikte Daha Güçlü",
      address: "Büyükdere, Eskişehir, Türkiye",
      phone: "+90 222 000 00 00",
      email: "info@eskisehirbuyukderesk.com.tr",
      aboutText:
        "Eskişehir Büyükdere Spor Kulübü, Büyükdere bölgesinin köklü spor kulüplerinden biridir. Kulübümüz, gençlere spor bilinci kazandırmak, toplumu spor aracılığıyla bir araya getirmek ve bölgemizi futbol alanında en iyi şekilde temsil etmek amacıyla kurulmuştur. Birlik ve dayanışma ruhuyla hareket eden kulübümüz, her geçen gün büyüyerek yoluna devam etmektedir.",
      historyText:
        "Eskişehir Büyükdere Spor Kulübü, bölgenin spor tarihinde önemli bir yere sahiptir. Kuruluşundan bu yana birçok başarıya imza atan kulübümüz, yetiştirdiği sporcularla Türk futboluna önemli katkılarda bulunmuştur. Siyah ve kırmızı renklerini gururla taşıyan kulübümüz, taraftarlarının desteğiyle her zaman daha ileriye gitmeyi hedeflemektedir.",
      mapsEmbed: "",
    },
  });

  // News
  const newsData = [
    {
      id: "news-1",
      title: "Yeni Sezon Hazırlıkları Başladı",
      content:
        "Eskişehir Büyükdere Spor Kulübü, yeni sezon hazırlıklarına büyük bir heyecanla başladı. Teknik kadromuz, oyuncularımızla birlikte yoğun bir kamp dönemine girdi.",
      summary: "Takımımız yeni sezon için yoğun kamp çalışmalarına başladı.",
      publishDate: new Date("2026-07-01"),
    },
    {
      id: "news-2",
      title: "Alt Yapı Seçmeleri Yakında",
      content:
        "Kulübümüzün alt yapı seçmeleri yakında gerçekleştirilecektir. 8-16 yaş aralığındaki gençler seçmelere katılabilir. Detaylı bilgi için kulüp sekreterliği ile iletişime geçebilirsiniz.",
      summary: "8-16 yaş aralığındaki gençler için alt yapı seçmeleri yakında yapılacak.",
      publishDate: new Date("2026-07-05"),
    },
  ];

  for (const news of newsData) {
    await prisma.news.upsert({
      where: { id: news.id },
      update: {},
      create: news,
    });
  }

  // Activities
  const activitiesData = [
    {
      id: "act-1",
      title: "Yaz Futbol Okulu",
      description:
        "Büyükdere Spor Kulübü Yaz Futbol Okulu, 7-14 yaş arası çocuklar için profesyonel antrenörler eşliğinde futbol eğitimi sunmaktadır.",
      activityDate: new Date("2026-07-15"),
    },
    {
      id: "act-2",
      title: "Taraftar Buluşması",
      description:
        "Sezon açılışı öncesinde tüm taraftarlarımızı kulüp tesislerinde düzenlenecek buluşmaya davet ediyoruz.",
      activityDate: new Date("2026-08-01"),
    },
  ];

  for (const act of activitiesData) {
    await prisma.activity.upsert({
      where: { id: act.id },
      update: {},
      create: act,
    });
  }

  // Board members
  const boardData = [
    { id: "board-1", name: "Yönetim Kurulu Başkanı", title: "Başkan", sortOrder: 1 },
    { id: "board-2", name: "Yönetim Kurulu Üyesi", title: "Başkan Yardımcısı", sortOrder: 2 },
  ];

  for (const member of boardData) {
    await prisma.boardMember.upsert({
      where: { id: member.id },
      update: {},
      create: member,
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
