const NotFound = () => import("@/views/dev/not-found");

export default [
  {
    path: "/:pathMatch(.*)",
    name: "not-found",
    component: NotFound
  }
]
