import { apiSlice } from "../../api/apiSlice";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const deviceApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getDeviceById: builder.query({
            query: device_id => ({
                url: `/v1/device/${device_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),

        getDeviceByIdWithLog: builder.query({
            query: device_id => ({
                url: `/v2/device/${device_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),

        updateDeviceData: builder.mutation({
            query: device_data => ({
                url: `/v1/device/${device_data.device_id}`,
                method: "PUT",
                body: device_data,
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Device']
        }),
    })
})

export const {
    useGetDeviceByIdQuery,
    useGetDeviceByIdWithLogQuery,
    useUpdateDeviceDataMutation,
} = deviceApi