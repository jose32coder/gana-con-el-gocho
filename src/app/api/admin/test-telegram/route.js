import { notifyAdmin } from "@/lib/notifications";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await notifyAdmin({ type: "test" });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
