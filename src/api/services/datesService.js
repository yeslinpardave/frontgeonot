import api from "../api";

export const getDatesByRange = async (startDate,endDate)=>{
    try {
        console.log("Fecha de inicio:", startDate);
    console.log("Fecha de fin:", endDate);
        const response = await api.post('/range',{
            
                startDate:startDate,
                endDate:endDate,
            
        })
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error("error al obtener fechas",error)
        throw error
    }
}