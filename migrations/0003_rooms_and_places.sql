DROP TABLE IF EXISTS user_devices;

CREATE TABLE IF NOT EXISTS home (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS user_home (
  id TEXT PRIMARY KEY,
  home_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT "member",
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  UNIQUE(user_id, home_id),
  FOREIGN KEY (home_id) REFERENCES home(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS room (
  id TEXT PRIMARY KEY,
  home_id TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT, 
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (home_id) REFERENCES home(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS place (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  room_id TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),  
  FOREIGN KEY (room_id) REFERENCES room(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

ALTER TABLE devices RENAME TO devices_old;

CREATE TABLE devices (
  id TEXT PRIMARY KEY,
  mac_addr TEXT NOT NULL UNIQUE,
  home_id TEXT,
  place_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (home_id) REFERENCES home(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  FOREIGN KEY (place_id) REFERENCES place(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

INSERT INTO devices (id, mac_addr, home_id, place_id, created_at)
SELECT id, mac_addr, NULL, NULL, created_at
FROM devices_old;

DROP TABLE devices_old;

ALTER TABLE sensor_readings RENAME TO sensor_readings_old;

CREATE TABLE sensor_readings (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  place_id TEXT,
  lux REAL,
  pressure REAL,
  humidity REAL,
  temperature REAL,
  battery_mv INTEGER,
  read_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (device_id) REFERENCES devices(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  FOREIGN KEY (place_id) REFERENCES place(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

INSERT INTO sensor_readings (
  id,
  device_id,
  place_id,
  lux,
  pressure,
  humidity,
  temperature,
  battery_mv,
  read_at,
  created_at
)
SELECT
  id,
  device_id,
  NULL,
  lux,
  pressure,
  humidity,
  temperature,
  battery_mv,
  read_at,
  created_at
FROM sensor_readings_old;

DROP TABLE sensor_readings_old;

CREATE INDEX IF NOT EXISTS idx_user_home_user_id
  ON user_home(user_id);

CREATE INDEX IF NOT EXISTS idx_user_home_home_id
  ON user_home(home_id);

CREATE INDEX IF NOT EXISTS idx_room_home_id
  ON room(home_id);

CREATE INDEX IF NOT EXISTS idx_place_room_id
  ON place(room_id);

CREATE INDEX IF NOT EXISTS idx_devices_home_id
  ON devices(home_id);

CREATE INDEX IF NOT EXISTS idx_devices_place_id
  ON devices(place_id);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_device_time
  ON sensor_readings(device_id, read_at DESC);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_place_time
  ON sensor_readings(place_id, read_at DESC);

