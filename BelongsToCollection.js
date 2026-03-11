class BelongsToCollection {
  constructor(id, name, posterPath, backdropPath) {
    this.id = id;
    this.name = name;
    this.posterPath = posterPath;
    this.backdropPath = backdropPath;
  }

  static fromJson(json) {
    if (!json) return null;
    return new BelongsToCollection(
      json.id,
      json.name,
      json.poster_path,
      json.backdrop_path
    );
  }
}
class Movie {
  constructor(
    adult,
    backdropPath,
    belongsToCollection,
    budget,
    homepage,
    id,
    imdbId,
    originCountry,
    originalLanguage,
    originalTitle,
    overview,
    popularity,
    posterPath,
    releaseDate,
    revenue,
    runtime,
    status,
    tagline,
    title,
    video,
    voteAverage,
    voteCount
  ) {
    this.adult = adult;
    this.backdropPath = backdropPath;
    this.belongsToCollection = belongsToCollection;
    this.budget = budget;
    this.homepage = homepage;
    this.id = id;
    this.imdbId = imdbId;
    this.originCountry = originCountry;
    this.originalLanguage = originalLanguage;
    this.originalTitle = originalTitle;
    this.overview = overview;
    this.popularity = popularity;
    this.posterPath = posterPath;
    this.releaseDate = releaseDate;
    this.revenue = revenue;
    this.runtime = runtime;
    this.status = status;
    this.tagline = tagline;
    this.title = title;
    this.video = video;
    this.voteAverage = voteAverage;
    this.voteCount = voteCount;
  }

  static fromJson(json) {
    return new Movie(
      json.adult,
      json.backdrop_path,
      BelongsToCollection.fromJson(json.belongs_to_collection),
      json.budget,
      json.homepage,
      json.id,
      json.imdb_id,
      json.origin_country,
      json.original_language,
      json.original_title,
      json.overview,
      json.popularity,
      json.poster_path,
      json.release_date,
      json.revenue,
      json.runtime,
      json.status,
      json.tagline,
      json.title,
      json.video,
      json.vote_average,
      json.vote_count
    );
  }
}