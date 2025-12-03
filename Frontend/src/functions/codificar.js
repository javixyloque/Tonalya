// CODIFICAR IMAGEN A BASE 64 (PARA GUARDAR EN BASE DE DATOS COMO STRING EN VEZ DE BUFFER [DABA MUCHOS PROBLEMAS])
//https://www.toolify.ai/es/ai-news-es/conversin-de-archivo-a-base64-en-react-tutorial-con-ejemplo-1119786
export function codificarImagen64(imagen) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(imagen); 
    });
}


