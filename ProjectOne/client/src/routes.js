import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, AuthLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import Chat from "./views/Chat";
import BlogPosts from "./views/BlogPosts";
import ProfileView from "./views/ProfileView";
import Post from "./views/Post";
import ActivityLog from "./views/ActivityLog";

export default [
  {
    path: "/",
    exact: true,
    layout: AuthLayout,
    component: () => <Redirect to="/register" />
  },
  {
    path: "/dashboard",
    exact: true,
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/user-profile",
    exact: true,
    layout: DefaultLayout,
    component: UserProfileLite
  },
  {
    path: "/add-new-post",
    exact: true,
    layout: DefaultLayout,
    component: AddNewPost
  },
  {
    path: "/messages",
    exact: true,
    layout: DefaultLayout,
    component: Chat
  },
  {
    path: "/blog-posts",
    exact: true,
    layout: DefaultLayout,
    component: BlogPosts
  },
  {
    path: "/activity-log",
    exact: true,
    layout: DefaultLayout,
    component: ActivityLog
  },
  {
    path: "/user",
    layout: DefaultLayout,
    component: ProfileView
  },
  {
    path: "/blog",
    layout: DefaultLayout,
    component: Post
  },
  {
    layout: DefaultLayout,
    component: Errors
  },
];
