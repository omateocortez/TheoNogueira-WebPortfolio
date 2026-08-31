async function getVideos() {
    try {
        const response = await fetch ("http://localhost:3000/api/videos");
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar vídeos", error);
    }
}