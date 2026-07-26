# SMS-Next.js — School Management System

A modern, feature-rich **School Management System** built with **Next.js 14** and **React 18**. Manage students, teachers, classes, and attendance with a clean, responsive interface that supports dark/light themes.

---

## ✨ Features

### ✅ Currently Implemented

| Module         | Description                                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Dashboard**  | Overview metrics — total students, teachers, classes, and today's attendance breakdown (Present/Absent/Late). Recent activity lists for students, teachers, and classes. |
| **Students**   | View all student records in a sortable/filterable table. Filter by class. Click a row to see a detailed profile. Add new students via modal form.                        |
| **Teachers**   | View teacher directory with key info. Click through to individual teacher profiles showing teaching overview and contact details. Add new teachers via modal form.       |
| **Classes**    | View class list with section, room, and assigned teacher. Add new classes via modal form with teacher assignment from dropdown.                                          |
| **Attendance** | Two-column layout: Mark Attendance form on the left, Today's records table on the right. Supports Present/Absent/Late statuses with optional notes.                      |

### 🚧 Placeholder Pages (Under Development)

| Module          | Description                                                                  |
| --------------- | ---------------------------------------------------------------------------- |
| **Assignments** | Future assignment system for viewing, submitting, and grading assignments.   |
| **Courses**     | Future course management — chapters, topics, and curriculum planning.        |
| **Exams**       | Future examination system — create exams, view results, performance reports. |
| **Fees**        | Future fee management — fee structures, payment tracking, invoices.          |
| **Timetable**   | Future timetable management — class schedules, periods, teacher allocation.  |

---

## 🛠️ Tech Stack

| Technology  | Version                                                  |
| ----------- | -------------------------------------------------------- |
| **Next.js** | 14.2.35                                                  |
| **React**   | 18.3.1                                                   |
| **Node**    | 18+ (required)                                           |
| **Icons**   | lucide-react ^0.453.0                                    |
| **Styling** | Custom CSS with CSS custom properties (light/dark theme) |
| **Data**    | In-memory JavaScript store (no database required)        |

---

## 📁 Project Structure

```
SMS-Next.js/
├── app/
│   ├── page.jsx              # Dashboard page
│   ├── layout.jsx            # Root layout (Sidebar + Header + Content)
│   ├── globals.css           # All styles (light/dark theme, responsive)
│   ├── api/
│   │   ├── dashboard/route.js
│   │   ├── students/route.js
│   │   ├── teachers/route.js
│   │   ├── teachers/[id]/route.js
│   │   ├── classes/route.js
│   │   └── attendance/route.js
│   ├── assignments/page.jsx
│   ├── attendance/page.jsx
│   ├── classes/page.jsx
│   ├── courses/page.jsx
│   ├── exams/page.jsx
│   ├── fees/page.jsx
│   ├── students/page.jsx
│   ├── teachers/
│   │   ├── page.jsx
│   │   └── [id]/page.jsx
│   └── timetable/page.jsx
├── components/
│   ├── Header.jsx
│   ├── Modal.jsx
│   ├── Sidebar.jsx
│   └── ThemeProvider.jsx
├── lib/
│   └── db.js                 # In-memory data store (seed data + CRUD operations)
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/zulqarnainali96/SMS-Next.js.git

# 2. Navigate to the project directory
cd SMS-Next.js

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

### Build for Production

```bash
npm run build
npm start
```

---

## 🎨 Theme Support

The application supports **light** and **dark** themes. Toggle between them using the button in the top-right header. Your preference is saved in `localStorage` and persists across sessions.

---

## 📊 Seed Data

The app comes pre-loaded with sample data so you can explore the interface immediately:

- **21 Students** across Classes 1–10
- **5 Teachers** covering Math, Science, English, History, and Computer Science
- **10 Classes** with room and teacher assignments
- **105 Attendance Records** — 5 days of history per student

> **Note:** All data is stored in memory. Changes are lost when the server restarts. For persistent storage, integrate a database (e.g., SQLite, PostgreSQL, MongoDB).

---

## 🧪 API Endpoints

| Method | Endpoint             | Description                                   |
| ------ | -------------------- | --------------------------------------------- |
| GET    | `/api/dashboard`     | Dashboard metrics and recent lists            |
| GET    | `/api/students`      | List students (optional `?class_name` filter) |
| POST   | `/api/students`      | Add a new student                             |
| GET    | `/api/teachers`      | List all teachers                             |
| POST   | `/api/teachers`      | Add a new teacher                             |
| GET    | `/api/teachers/[id]` | Get teacher by ID                             |
| GET    | `/api/classes`       | List all classes with teacher names           |
| POST   | `/api/classes`       | Add a new class                               |
| GET    | `/api/attendance`    | List attendance (optional `?date` filter)     |
| POST   | `/api/attendance`    | Mark or update attendance                     |

---

## 📱 Responsive Design

The interface is fully responsive:

- **Desktop (>980px):** Full sidebar + multi-column layouts
- **Tablet (620–980px):** Horizontal nav bar, stacked columns
- **Mobile (<620px):** Compact layout, stacked everything, full-width controls

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙌 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.
