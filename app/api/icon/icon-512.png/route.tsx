import { NextRequest } from "next/server";
import { generateIconPng } from "@/configuration/icon";

export const dynamic = "force-static";

export const GET = async (req: NextRequest) => generateIconPng(512);
