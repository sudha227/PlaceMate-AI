const API_URL = "http://127.0.0.1:8000";

export async function createStudent(studentData) {
  const response = await fetch(`${API_URL}/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    throw new Error("Failed to create student");
  }

  return await response.json();
}