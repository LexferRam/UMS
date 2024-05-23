// import Axios from "axios"
// import { getToken, deleteToken } from "./auth"
// const MAX_RETRY_ATTEMPTS = 5;
// const RETRY_DELAY_MS = 3700;

// export function initAxiosInterceptors(dialog, loading) {

//     let currentRetry = 0;
//     const token = getToken()
//     Axios.defaults.baseURL = `${process.env.GATSBY_API_URL}/asg-api/`
//     Axios.defaults.headers.common["Authorization"] = `bearer ${token}`

//     Axios.interceptors.request.use(function (config) {
//         loading(true)
//         return config
//     }, function (err) {
//         console.log(err)
//     })

//     Axios.interceptors.response.use(
//         function (response) {
//             currentRetry = 0;
//             loading(false)
//             return response
//         },
//         function (error) {
//             const config = error.config;
//             loading(false)

//             if (error.response) {
//                 if (error.response.status === 401) {
//                     deleteToken()
//                     dialog({
//                         variant: "info",
//                         catchOnCancel: false,
//                         title: "Alerta",
//                         description: error.response.data,
//                         onSubmit: () => (window.location = "/login"),
//                     })
//                     return Promise.reject(error)
//                 } else if (error.response.status === 504) {
//                     dialog({
//                         variant: "info",
//                         catchOnCancel: false,
//                         title: "Alerta",
//                         description:
//                             "Ocurrió un problema al momento de procesar su transacción por favor intente nuevamente o refresque su navegador.",
//                     })
//                 } else if (error.response.status === 503) {

//                     if (currentRetry < MAX_RETRY_ATTEMPTS) {
//                         currentRetry += 1;
//                         console.log('Reintento:')
//                         console.log(currentRetry)

//                         return new Promise(resolve => setTimeout(() => resolve(Axios.request(config)), RETRY_DELAY_MS));
//                     } else {
//                         dialog({
//                             variant: "info",
//                             catchOnCancel: false,
//                             title: "",
//                             description:
//                                 "Actualmente nuestro Portal se encuentra en mantenimiento.",
//                         })
//                     }

//                 } else if (error.response.status === 502) {
//                     dialog({
//                         variant: "info",
//                         catchOnCancel: false,
//                         title: "Alerta",
//                         description: "Ocurrió un problema con la conexión por favor refresque su navegador."
//                     })

//                 } else if (error.response.status === 413) {
//                     dialog({
//                         variant: "info",
//                         catchOnCancel: false,
//                         title: "Alerta",
//                         description: "El archivo que intenta subir supera el tamaño máximo permitido.",
//                     })
//                 } else {
//                     dialog({
//                         variant: "info",
//                         catchOnCancel: false,
//                         title: "Alerta",
//                         description: error.response.data
//                     })
//                     return Promise.reject(error)
//                 }
//             } else if (error.request) {
//                 console.log(error.request);
//             } else {
//                 console.log('Error Desc: ', error.message);
//             }
//         }
//     )
// }
