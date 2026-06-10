import { getSession } from "@/hooks/get-session";
import { role } from "@/modules/admin/ui/config/auth/role.user";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

export async function POST(req: Request) {
    const session = await getSession();
    const userRole = session?.user.role;

    if (userRole !== role.superadmin && userRole !== role.admin) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ambil extension asli
    const fileName = `${crypto.randomUUID()}.webp`;

    const uploadDir = path.join(process.cwd(), "/temp");

    // pastikan folder ada
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const optimizedBuffer = await sharp(buffer)
        .resize(1000, 1000, {
            fit: "contain",
            background: "#ffffff",
        })
        .webp({
            quality: 80,
        })
        .toBuffer();

    await writeFile(filePath, optimizedBuffer);

    return Response.json({
        url: `/temp/${fileName}`,
    });
}
