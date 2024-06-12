import { apiSlice } from "../../api/apiSlice";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const gardenApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllGardens: builder.query({
            query: () => ({
                url: "/v1/garden",
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Garden']
        }),
        getGardenById: builder.query({
            query: garden_id => ({
                url: `/v1/garden/${garden_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Garden']
        }),
        addNewGarden: builder.mutation({
            query: garden_data => ({
                url: "/v1/garden",
                method: "POST",
                body: garden_data,
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Garden']
        }),
        deleteGarden: builder.mutation({
            query: garden_id => ({
                url: `/v1/garden/${garden_id}`,
                method: "DELETE",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Garden']
        }),
        getAllRooms: builder.query({
            query: () => ({
                url: "/v1/room",
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Room']
        }),
        getRoomByGardenId: builder.query({
            query: garden_id => ({
                url: `/v2/room/garden/${garden_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Room']
        }),
        addNewRoom: builder.mutation({
            query: room_data => ({
                url: "/v1/room",
                method: "POST",
                body: room_data,
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Room']
        }),
        deleteRoom: builder.mutation({
            query: room_id => ({
                url: `/v1/room/${room_id}`,
                method: "DELETE",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Room']
        })
    })
})

export const {
    // Garden Hooks
    useGetAllGardensQuery,
    useGetGardenByIdQuery,
    useAddNewGardenMutation,
    useDeleteGardenMutation,
    // Room Hooks
    useGetAllRoomsQuery,
    useGetRoomByGardenIdQuery,
    useAddNewRoomMutation,
    useDeleteRoomMutation
} = gardenApi