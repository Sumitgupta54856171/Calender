import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';


export const apiSlice = createApi({
    reducerPath:'api',
    baseQuery:fetchBaseQuery({
        baseUrl:'http://localhost:3000/api',
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
            query:({organizationId,date})=>`/sessions/${organizationId}?date=${date}`,
        }),
      
})
});

export const {useGetSessionsQuery,useCreateSessionMutation,useGetSessionbyDateQuery} = apiSlice;