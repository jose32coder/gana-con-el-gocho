const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(process.cwd(), ".env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  try {
    const { data, error } = await supabase
      .from("actividades")
      .select("*")
      .limit(10)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Supabase Error:", error);
    } else {
      console.log("--- RESUMEN DE ACTIVIDADES ---");
      console.log("Total encontradas:", data?.length || 0);
      data?.forEach((act, i) => {
        console.log(
          `${i + 1}. [${act.tipo}] ${act.descripcion} (${act.created_at})`,
        );
      });
    }
  } catch (err) {
    console.error("Unexpected Error:", err);
  }
}

check();
