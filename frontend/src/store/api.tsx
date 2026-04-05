import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';


export const apiSlice = createApi({
    reducerPath:'api',
    baseQuery:fetchBaseQuery({
        baseUrl:'http://51.81.22.42:3000/api',
    }),
    endpoints:(builder)=>({
        getSessions:builder.query({
            query:(organizationId)=>`/sessions/${organizationId}`,
        }),
        createSession:builder.mutation({
            query:(sessionData)=>({
                url:'/sessions',
                method:'POST',
                body:sessionData,
            }),
        }),
        getSessionbyDate:builder.query({
            query:({organizationId,date})=>`/sessions/${organizationId}/${date}`,
        }),
        rescheduleSession:builder.mutation({
            query:(rescheduleData)=>({
                url:'/sessions/reschedule',
                method:'PUT',
                body:rescheduleData,
            }),
        }),
        bill:builder.query({
            query:(organizationId)=>`/bills/${organizationId}`,
        }),
        adjustments:builder.query({
            query:(organizationId)=>`/adjustments/${organizationId}`,
        }),
      
})
});

export const {useGetSessionsQuery,useCreateSessionMutation,useGetSessionbyDateQuery,useRescheduleSessionMutation,useAdjustmentsQuery,useBillQuery} = apiSlice;