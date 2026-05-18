import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync("flexapp.db");
  }
  return db;
}

export async function initDb(): Promise<void> {
  const database = getDb();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS user_workout_plans (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_workouts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_workout_exercises (
      id TEXT PRIMARY KEY,
      workout_id TEXT NOT NULL REFERENCES user_workouts(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      catalog_exercise_id TEXT,
      target_sets INTEGER NOT NULL,
      target_reps INTEGER NOT NULL,
      position INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS user_workout_exercises_workout_id_idx ON user_workout_exercises(workout_id);

    CREATE TABLE IF NOT EXISTS user_workout_days (
      workout_id TEXT NOT NULL REFERENCES user_workouts(id) ON DELETE CASCADE,
      day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
      created_at TEXT NOT NULL,
      PRIMARY KEY (workout_id, day_of_week)
    );
    CREATE INDEX IF NOT EXISTS user_workout_days_day_idx ON user_workout_days(day_of_week);

    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id TEXT PRIMARY KEY,
      active_plan_id TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workout_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      workout_id TEXT NOT NULL,
      plan_id TEXT,
      name TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'cancelled')),
      started_at TEXT NOT NULL,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS workout_sessions_user_status_idx ON workout_sessions(user_id, status);

    CREATE TABLE IF NOT EXISTS session_exercises (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
      source_exercise_id TEXT,
      catalog_exercise_id TEXT,
      name TEXT NOT NULL,
      target_sets INTEGER NOT NULL,
      target_reps INTEGER NOT NULL,
      position INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS session_exercises_session_idx ON session_exercises(session_id);

    CREATE TABLE IF NOT EXISTS session_sets (
      id TEXT PRIMARY KEY,
      session_exercise_id TEXT NOT NULL REFERENCES session_exercises(id) ON DELETE CASCADE,
      set_index INTEGER NOT NULL,
      target_reps INTEGER NOT NULL,
      actual_reps INTEGER,
      weight REAL,
      completed INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT
    );
    CREATE INDEX IF NOT EXISTS session_sets_exercise_idx ON session_sets(session_exercise_id);

    CREATE TABLE IF NOT EXISTS outbox (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      operation TEXT NOT NULL CHECK (operation IN ('create', 'update', 'delete')),
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL,
      synced_at TEXT
    );
    CREATE INDEX IF NOT EXISTS outbox_pending_idx ON outbox(synced_at) WHERE synced_at IS NULL;
  `);

  // Idempotent column additions for existing installs
  try {
    await database.execAsync(
      "ALTER TABLE user_workout_exercises ADD COLUMN catalog_exercise_id TEXT;"
    );
  } catch {
    // Column already exists — ignore
  }

  try {
    await database.execAsync("ALTER TABLE user_workouts ADD COLUMN plan_id TEXT;");
  } catch {
    // Column already exists — ignore
  }

  try {
    await database.execAsync(
      "ALTER TABLE user_workouts ADD COLUMN days_of_week TEXT NOT NULL DEFAULT '';"
    );
  } catch {
    // Column already exists — ignore
  }

  try {
    await database.execAsync(
      "CREATE INDEX IF NOT EXISTS user_workouts_plan_id_idx ON user_workouts(plan_id);"
    );
  } catch {
    // Index already exists — ignore
  }

  // One-shot backfill: copy any pre-existing CSV days_of_week into the junction
  try {
    const rows = database.getAllSync<{ id: string; days_of_week: string | null }>(
      "SELECT id, days_of_week FROM user_workouts WHERE days_of_week IS NOT NULL AND days_of_week <> ''"
    );
    const now = new Date().toISOString();
    database.withTransactionSync(() => {
      for (const r of rows) {
        for (const part of (r.days_of_week ?? "").split(",")) {
          const d = parseInt(part, 10);
          if (Number.isInteger(d) && d >= 0 && d <= 6) {
            database.runSync(
              "INSERT OR IGNORE INTO user_workout_days (workout_id, day_of_week, created_at) VALUES (?, ?, ?)",
              [r.id, d, now]
            );
          }
        }
      }
    });
  } catch {
    // Backfill is best-effort — junction may not exist yet on a partial migration; safe to ignore
  }
}
