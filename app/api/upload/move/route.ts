import { getSession } from "@/hooks/get-session";
import { role } from "@/modules/admin/ui/config/auth/role.user";
import { unlink } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    const session = await getSession();
    const userRole = session?.user.role;

    if (userRole !== role.superadmin && userRole !== role.admin) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, pathName } = await req.json();
    if (!url || !pathName) {
        return Response.json({ error: "No URL or pathName provided" }, { status: 400 });
    }
    console.log("Request to move file with URL:", url);
    try {
        // ubah URL jadi path file
        const filePath = path.join(process.cwd(), url);
        const newFilePath = path.join(process.cwd(), "images", pathName);

        await unlink(filePath);
        await unlink(newFilePath);

        return Response.json({ success: true, message: "File moved successfully", url: newFilePath }, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: "Failed to move file" }, { status: 500 });
    }
}
