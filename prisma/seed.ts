import prisma from "@/lib/prisma";

async function main() {
    console.log("🌱 Seeding AppConfig...");

    const appConfig = await prisma.appConfig.upsert({
        where: {
            id: "default-app-config", // pakai id tetap biar tidak duplicate
        },
        update: {},
        create: {
            id: "default-app-config",

            // identity
            shopName: "Toko Default",
            ownerName: "Owner",
            address: "Alamat toko",
            phone: "08123456789",
            email: "default@email.com",

            // optional
            website: null,
            npwp: null,
            nib: null,

            // pricing
            isPpnEnabled: true,
            ppn: 0.11, // 11% ppn

            // media
            logoUrl: "",
            bannerUrl: "",
        },
    });

    console.log("✅ AppConfig seeded:", appConfig.id);
    const brands = [
        "Castrol",
        "Shell",
        "Pertamina",
        "Total Energies",
        "Motul",
        "Mobil 1",
        "Fuchs",
        "Liqui Moly",
        "Valvoline",
        "Repsol",
        "Idemitsu",
        "ENEOS",
        "Amsoil",
        "Gulf Oil",
        "Federal Oil",
        "Top 1",
        "Agip",
        "Petronas",
        "Lucas Oil",
        "Havoline",

        "Astra Oil",
        "Berkah Lubricants",
        "Cipta Oli Nusantara",
        "Duta Pelumas",
        "Energi Prima Oil",
        "FastLube",
        "Global Petro",
        "Hexa Oil",
        "IndoLube",
        "Jaya Oli Makmur",
        "Kencana Oil",
        "LubeMax",
        "Mega Pelumas",
        "Nusantara Oil",
        "Optima Lube",
        "Prima Petro",
        "QuickLube",
        "Raja Oli",
        "Sinar Pelumas",
        "Turbo Oil",

        "UltraLube",
        "Vortex Oil",
        "West Petro",
        "Xtreme Lube",
        "Yamaha Oil",
        "Zenix Oil",
        "Alpha Petro",
        "Beta Oil",
        "Corsa Lube",
        "Delta Petro",
        "Eagle Oil",
        "Falcon Lube",
        "Galaxy Oil",
        "Helix Petro",
        "Ion Lube",
        "Jet Oil",
        "Kappa Petro",
        "Lambda Oil",
        "Matrix Lube",
        "Nova Oil",

        "Omega Petro",
        "Pioneer Oil",
        "Quantum Lube",
        "Rapid Oil",
        "Sigma Petro",
        "Titan Oil",
        "Union Lube",
        "Vector Oil",
        "Wave Petro",
        "Xeno Oil",
        "Yield Lube",
        "Zenith Oil",
        "Artha Oil",
        "Bima Petro",
        "Cakra Oil",
        "Dharma Lube",
        "Esa Petro",
        "Fajar Oil",
        "Gema Lube",
        "Harta Petro",

        "Inti Oil",
        "Jati Lube",
        "Karya Petro",
        "Lestari Oil",
        "Mandiri Lube",
        "Naga Petro",
        "Oasis Oil",
        "Pusaka Lube",
        "Rimba Petro",
        "Surya Oil",
        "Tirta Lube",
        "Utama Petro",
        "Vista Oil",
        "Wira Lube",
        "Xpress Oil",
        "Yudha Petro",
        "Zafira Oil",
        "Andalas Lube",
        "Borneo Petro",
        "Celebes Oil",
    ];

    const data = brands.map(name => ({
        name,
        logoUrl: null,
    }));

    await prisma.brand.createMany({
        data,
        skipDuplicates: true,
    });

    console.log(`✅ Seeded ${data.length} brands`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
