import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/Error/NotFound";
import Home from "../pages/Home/Home";
import Register from "../pages/auth/Register";

import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "../components/PrivateRoute";
import AdminHome from "../pages/dashboard/admin/AdminHome";
import TrainerHome from "../pages/dashboard/trainer/TrainerHome";
import MemberHome from "../pages/dashboard/member/MemberHome";
import BeATrainer from "../pages/beATrainer/BeATrainer";
import AppliedTrainers from "../pages/dashboard/admin/AppliedTrainers";
import TrainerDetails from "../pages/dashboard/trainer/TrainerDetails";
import TrainerBookedPage from "../pages/BookTrainer/TrainerBookedPage";
// import Payment from "../pages/Payment/Payment";
import CreateClassForm from "../pages/dashboard/admin/CreateClassForm";
import AllClasses from "../pages/Classes/AllClasses";
import ClassDetails from "../pages/Classes/ClassDetails";
import PaymentPage from "../pages/Payment/Payment";
import AddNewSlot from "../pages/dashboard/trainer/AddNewSlot";
import ManageSlots from "../pages/dashboard/trainer/ManageSlots";
import ActivityLog from "../pages/dashboard/member/ActivityLog";
import ProfilePage from "../pages/dashboard/member/ProfilePage";
import BookedTrainer from "../pages/dashboard/member/BookedTrainer";
import AllTrainers from "../pages/AllTrainers/AllTrainers";
import AddForum from "../components/AddForum";
import ForumPage from "../pages/forum/ForumPage";
import Trainers from "../pages/dashboard/admin/Trainers";
import AdminBalancePage from "../pages/dashboard/admin/AdminBalancePage";
import AllSubscribers from "../pages/dashboard/admin/AllSubscribers";
import Login from "../pages/auth/Login";
import ManageClasses from "../pages/dashboard/admin/ManageClasses";


const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Home />
            }, {
                path: "/register",
                element: <Register />
            },
            {
                path: "/login",
                element:<Login></Login>
                
            },
            {
                path: "/all-classes",
                element: <AllClasses></AllClasses>
            },
            {
                path: "/classes/:id",
                element: <ClassDetails></ClassDetails>
            },
            {
                path: "be-a-trainer",
                element: (
                    <PrivateRoute>
                        <BeATrainer></BeATrainer>
                    </PrivateRoute>
                )
            },
            {
                path: "/trainer-details/:id",
                element: (

                    <TrainerDetails></TrainerDetails>

                )
            },
            {
                path: "/book/:id",
                element: (
                    <PrivateRoute>
                        <TrainerBookedPage />
                    </PrivateRoute>
                ),
            },

            {
                path: "/payment/:id",
                element: (
                    <PrivateRoute><PaymentPage></PaymentPage></PrivateRoute>
                )

            },
            {
                path: "/trainers",
                element: <AllTrainers></AllTrainers>
            },
            {
                path: "/forums",
                element: <ForumPage></ForumPage>
            }
        ]
    },
    {
        path: '/dashboard',
        element: (
            <PrivateRoute>
                <DashboardLayout />
            </PrivateRoute>
        ),
        children: [
            {
                path: "admin",

                children: [
                    {
                        index: true,
                        element: <AdminHome></AdminHome>
                    },
                    {
                        path: "applied-trainers",
                        element: <AppliedTrainers></AppliedTrainers>
                    },
                    {
                        path: "create-class",
                        element: <CreateClassForm></CreateClassForm>
                    },
                    {
                        path: "add-forum",
                        element: <AddForum></AddForum>
                    },
                    {
                        path: "trainers",
                        element: <Trainers></Trainers>
                    },
                    {
                        path: "balance",
                        element: <AdminBalancePage></AdminBalancePage>
                    },
                    {
                        path: "subscribers",
                        element: <AllSubscribers></AllSubscribers>
                    },
                    {
                        path:"manage-classes",
                        element:<ManageClasses></ManageClasses>
                    }

                ]
            },
            {
                path: "trainer",
                children: [
                    {
                        index: true,
                        element: <TrainerHome></TrainerHome>
                    },
                    {
                        path: "add-slot",
                        element: <AddNewSlot></AddNewSlot>
                    },
                    {
                        path: "manage-slot",
                        element: <ManageSlots></ManageSlots>
                    },
                    {
                        path: "add-forum",
                        element: <AddForum></AddForum>
                    },


                ]
            },
            {
                path: "member",
                children: [
                    {
                        index: true,
                        element: <MemberHome></MemberHome>
                    },
                    {
                        path: "activitylog",
                        element: <ActivityLog></ActivityLog>
                    },
                    {
                        path: "profile",
                        element: <ProfilePage></ProfilePage>
                    },
                    {
                        path: "booked-trainer",
                        element: <BookedTrainer></BookedTrainer>
                    }
                ]
            }
        ]
    }
])
export default router