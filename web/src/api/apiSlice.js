import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const apiSlice = createApi({
    reducerPath: 'api',

    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),

    tagTypes: ['Device', 'Garden', 'Room'],

    endpoints: () => ({})
})