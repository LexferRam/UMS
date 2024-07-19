import { useQuery } from 'react-query'

const useUserEvents = ({ userEventInitData }: any) => {

    const {
        isLoading: isLoadingUserEvent,
        error: userEventError,
        data: userEvent = [],
        refetch: refetchUserEvent
    } = useQuery(['userEvent'], async ({ signal }) =>
        fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events`, {
            signal,
        }).then(res =>
            res.json()
        ),
        {
            // keepPreviousData: true,
            // refetchInterval: false,
            refetchOnWindowFocus: true,
            initialData: userEventInitData
        })

    return {
        isLoadingUserEvent,
        userEventError,
        userEvent,
        refetchUserEvent
    }
}

export default useUserEvents