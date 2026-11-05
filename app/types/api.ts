export type JsonApiResourceType =
  | 'boards'
  | 'dfp-configs'
  | 'dfp-states'
  | 'tfp-configs'
  | 'tfp-states'
  | 'tanks'
  | 'tank-configs'

export interface JsonApiResourceObject<TAttrs = Record<string, unknown>> {
  id: string
  type: JsonApiResourceType | string
  attributes: TAttrs
}

export interface JsonApiDocument<TAttrs = Record<string, unknown>> {
  data: JsonApiResourceObject<TAttrs>
}

export interface JsonApiCollectionDocument<TAttrs = Record<string, unknown>> {
  data: JsonApiResourceObject<TAttrs>[]
}

export interface JsonApiErrorItem {
  id?: string
  status?: string
  code?: string
  title?: string
  detail?: string
  message?: string
}

export interface JsonApiErrorResponse {
  errors?: JsonApiErrorItem[]
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}
