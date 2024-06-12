import { apiSlice } from "../../api/apiSlice";

const loginApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: login_info => ({
                url: "/login",
                method: "POST",
                body: login_info,
            })
        }),
        signup: builder.mutation({
            query: signup_info => ({
                url: "/signup",
                method: "POST",
                body: signup_info
            })
        }),
    })
})

export const {
    useLoginMutation,
    useSignupMutation,
} = loginApi