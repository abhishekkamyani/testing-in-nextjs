// mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("*/api/users/:userId", ({ params }) => {
    const { userId } = params;

    return HttpResponse.json({
      id: userId,
      username: "Alex Johnson",
      email: "alex@example.com",
      role: "admin",
      isAccountLocked: false,
    }); 
  }),
];