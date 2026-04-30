CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  latest_activity TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS user_devices (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  device_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  UNIQUE(user_id, device_id),
  FOREIGN KEY (device_id) REFERENCES devices(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE refresh_session (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  invalidated_at TEXT,
  valid_to TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE refresh_token (
  id TEXT PRIMARY KEY,
  refresh_session_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  invalidated_at TEXT,
  valid_to TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (refresh_session_id) REFERENCES refresh_session(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);