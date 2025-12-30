import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/send-email", "routes/api.send-email.ts"),
] satisfies RouteConfig;
