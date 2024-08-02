import { useQuery } from 'react-query'

const useUserReports = () => {

    const {
        isLoading: isLoadingReports,
        error: reportsError,
        data: reports = [],
        refetch: refetchReports
    } = useQuery(['reports'], async ({ signal }) =>
        fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/reports`, {
            signal,
        }).then(res =>
            res.json()
        ),
        {
            keepPreviousData: true,
            // refetchInterval: false,
            refetchOnWindowFocus: true,
            // initialData: reportsInitData
        })

    return {
        isLoadingReports,
        reportsError,
        reports,
        refetchReports
    }
}

export default useUserReports