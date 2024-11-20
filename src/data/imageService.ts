import { supabase } from '../config/supabase'

export interface Screenshot {
  folder: string;
  movieId: string;
  index: number;
  url: string;
}

export const imageService = {
  async getScreenshots(folder: string): Promise<Screenshot[]> {
    const { data, error } = await supabase
      .storage
      .from('screenshots')
      .list(folder)

    if (error) {
      console.error('Error fetching screenshots:', error)
      return []
    }

    const screenshots: Screenshot[] = []
    for (const file of data) {
      const [movieId, index] = file.name.split('-')
      const { data: publicUrl } = supabase
        .storage
        .from('screenshots')
        .getPublicUrl(`${folder}/${file.name}`)

      screenshots.push({
        folder,
        movieId,
        index: parseInt(index),
        url: publicUrl.publicUrl
      })
    }

    return screenshots.sort((a, b) => a.index - b.index)
  },

  async getAllFolders(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .storage
        .from('screenshots')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        })

      if (error) {
        console.error('Error fetching folders:', error)
        return []
      }

      const folders = data
        .filter(item => !item.name.includes('.'))
        .map(folder => folder.name)
        .sort((a, b) => Number(a) - Number(b))
      return folders
    } catch (error) {
      console.error('Error:', error)
      return []
    }
  }
}