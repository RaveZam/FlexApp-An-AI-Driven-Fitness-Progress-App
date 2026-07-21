const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PlateauRequest = {
  exerciseName: string;
  muscleGroup: string | null;
  weight: number;
  reps: number;
  sessionsStuck: number;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as Partial<PlateauRequest>;
    const { exerciseName, muscleGroup, weight, reps, sessionsStuck } = body;

    if (!exerciseName || typeof weight !== "number" || typeof reps !== "number") {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt =
      `You are a concise strength coach. A lifter is stuck at ${weight} lb x ${reps} reps ` +
      `on ${exerciseName}${muscleGroup ? ` (${muscleGroup})` : ""} for the last ${sessionsStuck ?? 3} ` +
      `sessions with no improvement. In ONE short sentence (max 30 words), give a specific new ` +
      `weight to use (either drop the load or microload it up, whichever fits this lift and rep ` +
      `range), combined with one or two concrete technique cues for this specific exercise ` +
      `(tempo, contraction focus, partials, mind-muscle connection, dropset, etc.) that would ` +
      `matter most for it. Be prescriptive with numbers, not vague. No preamble, no greeting, just the tip.`;

    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return new Response(JSON.stringify({ error: `Gemini error: ${errText}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await geminiRes.json();
    const tip: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!tip) {
      return new Response(JSON.stringify({ error: "No tip generated" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ tip }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
