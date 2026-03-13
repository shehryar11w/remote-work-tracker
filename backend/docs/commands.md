docker exec -it backend-db-1 psql -U postgres -d database_project
docker compose up -d --build 
docker compose down 
docker ps 
docker logs backend-backend-1
npx react-native run-android
npx react-native doctor
docker compose logs -f
cd C:\ngrok-v3-stable-windows-amd64

DROP TABLE IF EXISTS 
    organizations, roles, departments, users, refresh_tokens, projects, attendance, work_sessions, payroll, payroll_entries, performance_reviews, compliance_rules, compliance_violations, project_members, tasks, task_comments, task_attachments, goals, kpis, courses, course_enrollments, wellness_logs, notifications, activity_logs
CASCADE;