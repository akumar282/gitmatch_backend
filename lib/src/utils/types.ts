export interface userItem {
  id: string
  languageString: string
  devTypeString: string | null
  interestsString: string | null
  sizeString: string | null
  frameworkString: string | null
  difficultyString: string | null
  cloudProviderString: string | null
}

export interface recommendationInfo {
  data: {
    id: [string],
    justification: string
  }
}