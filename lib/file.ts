import fs from "fs/promises";
import path from "path";

import { DOCS_DIR } from "@/constants/config";

export async function saveBase64ToFile(base64: string, filename: string) {
    const buffer = Buffer.from(base64, "base64");

    const dir = path.join(process.cwd(), DOCS_DIR);
    await fs.mkdir(dir, { recursive: true });

    const filePath = path.join(dir, filename);
    await fs.writeFile(filePath, buffer);

    return filePath;
}
