# Agent/Device Registration API

Base route: /api/v1/agent

## 1️⃣ Register Device
POST /register
Request Body:
{
  "userId": "uuid-user",
  "os": "Windows 11",
  "hostname": "DESKTOP-1234"
}
Response (201 Created):
{
  "deviceId": "uuid-device",
  "registeredAt": "2026-03-13T10:00:00Z"
}

## 2️⃣ Heartbeat (Update Last Seen)
POST /heartbeat
Request Body:
{
  "deviceId": "uuid-device"
}
Response (200 OK):
{
  "deviceId": "uuid-device",
  "lastSeen": "2026-03-13T10:05:00Z"
}

## Device Table Fields
- device_id (UUID, PK)
- user_id (UUID, FK)
- os (string)
- hostname (string)
- registered_at (timestamp)
- last_seen (timestamp)
- is_active (boolean)

## Notes
- Devices must be registered before being used for attendance or activity logging.
- Each device is linked to a user.
- Heartbeat endpoint updates the last_seen timestamp for device monitoring.
