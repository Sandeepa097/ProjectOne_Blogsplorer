import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, AuthLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Chat from "./views/Chat";
//import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";
import Auth from "./views/auth"

export default [
  {
    path: "/",
    exact: true,
    layout: AuthLayout,
    component: () => <Redirect to="/register" />
  },
  {
    path: "/register",
    layout: AuthLayout,
    component: Auth
  },
  {
    path: "/dashboard",
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/user-profile",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  {
    path: "/add-new-post",
    layout: DefaultLayout,
    component: AddNewPost
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/messages",
    layout: DefaultLayout,
    component: Chat
  },
  {
    path: "/blog-posts",
    layout: DefaultLayout,
    component: BlogPosts
  }
];
