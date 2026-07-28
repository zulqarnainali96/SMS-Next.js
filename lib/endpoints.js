// API paths from School Management API.yaml (OpenAPI 3.0.3)

export const ENDPOINTS = {
  auth: {
    login: '/api/auth/login/',
    register: '/api/auth/register/',
    profile: '/api/auth/profile/',
    tokenRefresh: '/api/auth/token/refresh/',
  },
  academics: {
    classes: '/api/academics/classes/',
    classDetail: (id) => `/api/academics/classes/${id}/`,
    subjects: '/api/academics/subjects/',
    classSubjects: '/api/academics/class-subjects/',
  },
  students: {
    list: '/api/students/',
    detail: (id) => `/api/students/${id}/`,
  },
  teachers: {
    list: '/api/teachers/',
    detail: (id) => `/api/teachers/${id}/`,
  },
  attendance: {
    list: '/api/attendance/',
    detail: (id) => `/api/attendance/${id}/`,
  },
  exams: {
    list: '/api/exams/exams/',
    detail: (id) => `/api/exams/exams/${id}/`,
    results: '/api/exams/results/',
    resultDetail: (id) => `/api/exams/results/${id}/`,
  },
  fees: {
    records: '/api/fees/records/',
    recordDetail: (id) => `/api/fees/records/${id}/`,
    structures: '/api/fees/structures/',
    structureDetail: (id) => `/api/fees/structures/${id}/`,
  },
  schools: {
    list: '/api/schools/',
    detail: (id) => `/api/schools/${id}/`,
  },
  reports: {
    list: '/api/reports/',
    detail: (id) => `/api/reports/${id}/`,
  },
};
