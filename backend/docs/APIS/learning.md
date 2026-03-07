## Learnig Module
Base route:/api/v1/learning

1️⃣ Get All Courses (Employee / Manager / Admin / SUPER_ADMIN)
GET /learning/courses
Query Parameters (optional):
Parameter	Type	Description
category	string	Filter by course category
level	string	Beginner, Intermediate, Advanced
page	number	Pagination page (default 1)
limit	number	Number of courses per page (default 20)
Response (200 OK):
{
  "meta": {
    "page": 1,
    "limit": 20,
    "totalRecords": 12,
    "totalPages": 1
  },
  "data": [
    {
      "courseId": "uuid-course1",
      "title": "Advanced React Native",
      "description": "Deep dive into React Native for mobile apps",
      "category": "Development",
      "level": "Advanced",
      "durationHours": 10,
      "createdAt": "2026-03-01T10:00:00Z"
    },
    {
      "courseId": "uuid-course2",
      "title": "Effective Team Collaboration",
      "description": "Improve team productivity and communication",
      "category": "Soft Skills",
      "level": "Beginner",
      "durationHours": 3,
      "createdAt": "2026-03-02T09:00:00Z"
    }
  ]
}

2️⃣ Enroll in a Course (Employee)
POST /learning/enroll
Request Body:
{
  "userId": "uuid-employee",
  "courseId": "uuid-course1"
}
Response (201 Created):
{
  "enrollmentId": "uuid-enroll1",
  "userId": "uuid-employee",
  "courseId": "uuid-course1",
  "status": "ENROLLED",
  "enrolledAt": "2026-03-07T12:00:00Z"
}

3️⃣ Get My Enrolled Courses (Employee)
GET /learning/my-courses
Query Parameters (optional):
Parameter	Type	Description
status	string	Filter by ENROLLED, COMPLETED
page	number	Pagination page (default 1)
limit	number	Number of records per page (default 20)
Response (200 OK):
{
  "meta": {
    "page": 1,
    "limit": 20,
    "totalRecords": 2,
    "totalPages": 1
  },
  "data": [
    {
      "enrollmentId": "uuid-enroll1",
      "courseId": "uuid-course1",
      "title": "Advanced React Native",
      "status": "ENROLLED",
      "progressPercent": 40,
      "enrolledAt": "2026-03-07T12:00:00Z"
    },
    {
      "enrollmentId": "uuid-enroll2",
      "courseId": "uuid-course2",
      "title": "Effective Team Collaboration",
      "status": "COMPLETED",
      "progressPercent": 100,
      "enrolledAt": "2026-02-15T09:30:00Z"
    }
  ]
}

4️⃣ Complete Course / Update Progress (Employee)
PATCH /learning/:enrollmentId/progress
Request Body:
{
  "progressPercent": 100,
  "status": "COMPLETED"
}
Response (200 OK):
{
  "enrollmentId": "uuid-enroll1",
  "courseId": "uuid-course1",
  "progressPercent": 100,
  "status": "COMPLETED",
  "completedAt": "2026-03-07T15:00:00Z"
}

5️⃣ Recommended Courses (AI-Powered) (Employee)
GET /learning/recommendations
Query Parameters (optional):
Parameter	Type	Description
userId	string	Employee UUID
limit	number	Max recommendations (default 5)
Response (200 OK):
{
  "data": [
    {
      "courseId": "uuid-course3",
      "title": "Time Management Techniques",
      "category": "Productivity",
      "level": "Intermediate",
      "reason": "Based on your low productivity score last month"
    },
    {
      "courseId": "uuid-course4",
      "title": "Effective Communication",
      "category": "Soft Skills",
      "level": "Beginner",
      "reason": "Improves team collaboration based on your team analytics"
    }
  ]
}

6️⃣ Notes & Best Practices
1.	Role-Based Access
Role	Access
SUPER_ADMIN	CRUD on courses, view all enrollments
ADMIN	CRUD on courses, view all enrollments
MANAGER	View team enrollments, recommend courses
EMPLOYEE	View courses, enroll, track progress, get AI recommendations
2.	Optional Enhancements
•	Trigger notifications when a course is assigned or completed
•	Track progress per module inside a course
•	Integrate performance module to tie learning outcomes with employee growth
3.	Database Tables Suggestion
•	courses → stores course details
•	course_enrollments → tracks which user enrolled in which course + progress
•	learning_recommendations → optional AI suggestions

