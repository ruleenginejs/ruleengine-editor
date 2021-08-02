const Layout = () => import("@/views/dev/layout");
const HomePage = () => import("@/views/dev/home-page");
const EditorPage = () => import("@/views/dev/editor-page");
const EditorWithSidebarPage = () => import("@/views/dev/editor-with-sidebar-page");

export default [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        name: "home",
        component: HomePage
      },
      {
        path: "editor",
        name: "editor",
        component: EditorPage
      },
      {
        path: "editor-with-sidebar",
        name: "editor-with-sidebar",
        component: EditorWithSidebarPage
      }
    ]
  }
]
