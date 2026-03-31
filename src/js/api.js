const url_heroes = "https://akabab.github.io/superhero-api/api/all.json";
export async function fetchHeroes () {
    try {
      const response = await fetch(url_heroes)

        if (!response.ok) {
            throw new Error("Error al obtener los heroes")
        }

        return response.json()
    } catch (error) {
        console.log('Error fetching de los heroes', error);
    }
}