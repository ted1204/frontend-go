export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    // ... 根據實際資料結構擴充
  };
}

export async function loginApi(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch("http://10.121.124.22:30080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ username, password }).toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}
