import NotFoundPage from "../features/home/presentation/404.f7";
import Home from "../features/home/presentation/home.f7";
import CreateUserPage from "../features/users/presentation/create-user.f7";
import UsersListPage from "../features/users/presentation/users-list.f7";

var routes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/create-user",
        component: CreateUserPage,
    },
    {
        path: "/users-list",
        component: UsersListPage,
    },
    {
        path: "(.*)",
        component: NotFoundPage,
    },
];

export default routes;
