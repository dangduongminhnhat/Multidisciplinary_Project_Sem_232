import { apiSlice } from "../../api/apiSlice";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const roomApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getRoomById: builder.query({
            query: room_id => ({
                url: `/v1/room/${room_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Room']
        }),
        updateRoomByRoomId: builder.mutation({
            query: room_data => ({
                url: `/v1/room/${room_data.room_id}`,
                method: "PUT",
                body: room_data,
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Room']
        }),
        getAllDevices: builder.query({
            query: () => ({
                url: "/v1/device",
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),
        getAllDevicesWithLog: builder.query({
            query: () => ({
                url: "/v2/device",
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),
        getAllDevicesByGardenId: builder.query({
            query: garden_id => ({
                url: `/v3/device/garden/${garden_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),
        getAllDevicesByRoomId: builder.query({
            query: room_id => ({
                url: `/v3/device/room/${room_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),
        getAllDevicesByGardenIdWithLog: builder.query({
            query: garden_id => ({
                url: `/v4/device/garden/${garden_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),
        getAllDevicesByRoomIdWithLog: builder.query({
            query: room_id => ({
                url: `/v4/device/room/${room_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),
        addNewDevice: builder.mutation({
            query: device_data => ({
                url: `/v1/device`,
                method: "POST",
                body: device_data,
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Device']
        }),
        deleteDevice: builder.mutation({
            query: device_id => ({
                url: `/v1/device/${device_id}`,
                method: "DELETE",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Device']
        }),
    })
})

export const {
    useGetRoomByIdQuery,
    useUpdateRoomByRoomIdMutation,
    useGetAllDevicesQuery,
    useGetAllDevicesWithLogQuery,
    useGetAllDevicesByGardenIdQuery,
    useGetAllDevicesByRoomIdQuery,
    useGetAllDevicesByGardenIdWithLogQuery,
    useGetAllDevicesByRoomIdWithLogQuery,
    useAddNewDeviceMutation,
    useDeleteDeviceMutation,
} = roomApi