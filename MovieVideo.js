class MovieVideo {
  constructor(
    languageCode,
    countryCode,
    name,
    key,
    site,
    size,
    type,
    official,
    publishedAt,
    id
  ) {
    this.languageCode = languageCode;   // iso_639_1
    this.countryCode = countryCode;     // iso_3166_1
    this.name = name;
    this.key = key;
    this.site = site;
    this.size = size;
    this.type = type;
    this.official = official;
    this.publishedAt = publishedAt;
    this.id = id;
  }

  static fromJson(json) {
    return new MovieVideo(
      json.iso_639_1,
      json.iso_3166_1,
      json.name,
      json.key,
      json.site,
      json.size,
      json.type,
      json.official,
      json.published_at,
      json.id
    );
  }

  getYoutubeUrl() {
    if (this.site !== 'YouTube') {
      return null;
    }
    return `https://www.youtube.com/watch?v=${this.key}`;
  }
}