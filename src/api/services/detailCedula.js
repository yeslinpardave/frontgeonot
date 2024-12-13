import api from "../api";

export const getDatesDetail = async (numeroNotificacion,anioNotificacion,zona)=>{
    console.log(numeroNotificacion,anioNotificacion,zona)
    try {
        
        const response = await api.post('/buscarCedula',{
            
                nNotificacion:numeroNotificacion,
                anioNotificacion:anioNotificacion,
                zona:zona
            
        })
        console.log(response.data)
        // Verifica si la respuesta está vacía

        if(!response.data || Object.keys(response.data).length === 0){
            alert("No se encontraron resultados para la notificación.");
            return null
        }
        
        return response.data
    } catch (error) {
        console.error("error al obtener fechas",error)
        
    }
}