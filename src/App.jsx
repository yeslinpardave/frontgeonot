
import {useState,useEffect} from "react";
import { getDatesByRange } from "./api/services/datesService";
import { getDatesDetail } from "./api/services/detailCedula";

const App = () => {
  const [startDate,setStartDate]=useState("")
  const [endDate,setEndDate]=useState("")
  const [nNotificacion,setNnotificacion]=useState("")
  const [anioNotificacion,SetAnioNotificacion]=useState("")
  const [zona,setZona]=useState("")
  const [dates,setDates]=useState([])
  const [error,setError]=useState(null)
  const [reportType, setReportType] = useState("day");
  
  const [filters, setFilters] = useState({
    day: "",
    month: "",
    year: "",
    notificador: "",
    notificationNumber: "",
  });
  
  const sedes=[
    {label:"Huanuco",value:"0"},
    {label:"Tingo Maria",value:"1"}
  ]

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchDates = async ()=>{
    if(!startDate || !endDate){
      setError("Ambas fechas deben estar selecionadas");

      return
    }
    try {
      console.log(startDate +endDate)
      const response=await getDatesByRange(startDate,endDate)
      setDates(response)
      
      
    } catch (error) {
      setError(error.message || "error desconocidpo")
    }
  }
  const fetchDetailsByNotification = async (nNotificacion,anioNotificacion,zona) => {
    console.log("detalles")
    console.log(nNotificacion)
    console.log(anioNotificacion)
    console.log(zona)
    try {
      const response = await getDatesDetail(nNotificacion,anioNotificacion,zona);
      if(!response || response.length === 0){
        setDates([])
        setError("sin resultados para la busqueda")
        return
      }
      setDates([response]);

      
      setError(null);
    } catch (error) {
      setError(error.message || "Error desconocido");
    }
  };

  

  const generateReport = async()  => {
    // Aquí integrarías el backend o datos mock.
    try {
      if(reportType==="range"){
        fetchDates()
      }else if(reportType==="detail"){
        fetchDetailsByNotification(nNotificacion,anioNotificacion,zona)
      }

      
      
    } catch (error) {
      setError(error.message || "Error al generar el reporte");
    }
  };

   // Columnas de la tabla según el tipo de reporte
   const getColumns = () => {
    if (reportType === "range") {
      return [
        { label: "Notificador", key: "nombre" },
        { label: "Cantidad", key: "cantidad" },
        
      ];
    } else if (reportType === "detail") {
      return [
        
        { label: "Imagen", key: "imagen" },
        { label: "Destinatario", key: "destinatario" },
        { label: "Estado", key: "estado" },
        { label: "DetalleEstado", key: "detallestado" },
        { label: "Fecha", key: "fecha" },
        { label: "Hora", key: "hora" },
      ];
    }
    return [];
  };

  // Renderiza las filas de la tabla según el reporte
  const renderTableRows = () => {
    return dates.map((item, index) => (
      <tr key={index} className="hover:bg-gray-100 text-center">
        {getColumns().map((column) => (
          <td key={column.key} className="border p-2">
            {item[column.key]}
          </td>
        ))}
      </tr>
    ));
  };

  const handleReportTypeChange = (type) => {
    setReportType(type); // Cambia el tipo de reporte
    setDates([]);        // Limpia los datos
    setError(null);      // Limpia el error
  };

   // Función para formatear fecha y hora
   const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Ej: 11 de marzo de 2024
    return date.toLocaleDateString('es-ES', options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const options = { hour: '2-digit', minute: '2-digit' }; // Ej: 09:14
    return date.toLocaleTimeString('es-ES', options);
  };



  const renderDetailReport = () => {
    console.log("resultados date"+dates.length)
    if (!dates || dates.length === 0 || !dates[0] || dates[0].length === 0 ) {
      return <p>No hay resultados{error}</p>; // Mostrar mensaje si el array está vacío
    }
    // Para el reporte de detalle, centra la imagen y coloca los datos debajo
    const item = dates[0]; // Solo hay un item en el detalle
    
    return (
      <div className="flex flex-col items-center p-4">
        {/* Imagen centrada */}
        <img src={item[0].urlImage} alt="Imagen notificación" className="w-96 h-96 rounded-lg object-cover shadow-lg border-2 border-gray-300 mb-6" />
        
        {/* Datos debajo de la imagen */}
        <div className="text-center space-y-2">
          <p className="font-semibold text-lg text-gray-700">Destinatario:<span className="text-gray-900"></span> {item[0].Destinatario}</p>
          <p className="font-semibold text-lg">Estado: {item[0].estado}</p>
          <p className="font-semibold text-lg">Detalle de Estado: {item[0].detalle_estado}</p>
          <p className="font-semibold text-lg">Fecha: {formatDate(item[0].fecha_notificacion)}</p>
          <p className="font-semibold text-lg">Hora: {formatTime(item[0].fecha_notificacion)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Panel de Reportes
        </h1>

        {/* Selector de Tipo de Reporte */}
        <div className="flex justify-center mb-6">
        <button
            onClick={() => setReportType("range")}
            className={`px-4 py-2 mx-2 rounded ${
              reportType === "range" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Por Rango de Fecha
          </button>
          
          <button
            onClick={() => handleReportTypeChange("detail")}
            className={`px-4 py-2 mx-2 rounded ${
              reportType === "detail" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Por Detalle
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-2 gap-4 mb-6">
        {reportType === "range" && (
            <>
              <input
                type="date"
                value={startDate}
                placeholder="Fecha Inicio"
                onChange={(e)=>setStartDate(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="date"
                value={endDate}
                placeholder="Nombre del Notificador"
                onChange={(e)=>setEndDate(e.target.value)}
                className="border p-2 rounded"
              />
            </>
          )}
          
          
          {reportType === "detail" && (
            <>
              <input
                type="text"
                name="notificationNumber"
                value={nNotificacion}
                placeholder="Número de Notificación"
                onChange={(e)=>setNnotificacion(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="year"
                placeholder="Año"
                value={anioNotificacion}
                onChange={(e)=>SetAnioNotificacion(e.target.value)}
                className="border p-2 rounded"
              />
               <select
                name="sede"
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Selecciona una Sede</option>
                {sedes.map((sede, index) => (
                  <option key={index} value={sede.value}>
                    {sede.label}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <button
          onClick={generateReport}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Generar Reporte
        </button>

        {/* Tabla de Resultados */}
        {dates.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Resultados</h2>
            {reportType === "range" ? (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                {getColumns().map((column) => (
                    <th key={column.key} className="border p-2">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{renderTableRows()}</tbody>
            </table>) : (
              renderDetailReport() // Reporte por detalle con la imagen centrada y los datos debajo
            )}
          </div>
        )}
              
        
      </div>
    </div>
  );
};

export default App;