export interface ApiResult {
    page: number;
    total_pages: number;
    total_results: number;
    results: any[];
}

export interface MovieResult {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection?: any;
    budget: number;
    genres: Genre[];
    homepage: string;
    id: number;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: Productioncompany[];
    production_countries: Productioncountry[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: Spokenlanguage[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    rating?: number;
    user_rating: number;
    results: any;
  }

  interface Genre {
    id: number;
    name: string;
  }

  interface Productioncompany {
    id: number;
    logo_path?: string;
    name: string;
    origin_country: string
  }

  interface Productioncountry {
    iso_3166_1: string;
    name: string;
  }

  interface Spokenlanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
  }