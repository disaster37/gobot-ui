import type {
  JsonApiCollectionDocument,
  JsonApiDocument,
  JsonApiResourceObject,
  JsonApiResourceType
} from '~/types/api'

/**
 * Ember's `@ember/string` decamelize rules, with the uppercase-acronym boundary
 * adjusted so `UVC1BlisterMaxTime` -> `uvc1_blister_max_time` and
 * `UVC1Running` -> `uvc1_running` (digits stay attached to the preceding acronym).
 */
export function decamelize(str: string): string {
  return str
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z]+)/g, '$1_$2')
    .toLowerCase()
}

export function camelize(str: string): string {
  return str.replace(/_([a-z\d])/g, (_, char: string) => char.toUpperCase())
}

/** Returns the record with id `1`, falling back to the first item, or null when empty. */
export function pickSingleton<T extends { id: string }>(records: T[]): T | null {
  return records.find((record) => record.id === '1') ?? records[0] ?? null
}

/** Explicit snake_case -> model field maps for atypical acronym casing. */
const ATTRIBUTE_MAPS: Record<string, Record<string, string>> = {
  'tfp-configs': {
    uvc1_blister_max_time: 'UVC1BlisterMaxTime',
    uvc2_blister_max_time: 'UVC2BlisterMaxTime',
    uvc1_blister_time: 'UVC1BlisterTime',
    uvc2_blister_time: 'UVC2BlisterTime'
  },
  'tfp-states': {
    uvc1_running: 'UVC1Running',
    uvc2_running: 'UVC2Running',
    uvc1_blister_nb_hour: 'UVC1BlisterNbHour',
    uvc2_blister_nb_hour: 'UVC2BlisterNbHour',
    bacterium_time: 'BacteriumTime'
  }
}

/** Reverse of {@link ATTRIBUTE_MAPS}: model field -> explicit snake_case key. */
const REVERSE_ATTRIBUTE_MAPS: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(ATTRIBUTE_MAPS).map(([type, map]) => [
    type,
    Object.fromEntries(Object.entries(map).map(([apiKey, field]) => [field, apiKey]))
  ])
)

export function deserializeResource<T extends { id: string }>(
  resource: JsonApiResourceObject,
  fieldMap?: Record<string, keyof T>
): T {
  const map: Record<string, string> = { ...(ATTRIBUTE_MAPS[resource.type] ?? {}) }
  if (fieldMap) {
    for (const [key, field] of Object.entries(fieldMap)) map[key] = String(field)
  }
  const attributes: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(resource.attributes ?? {})) {
    attributes[map[key] ?? camelize(key)] = value
  }
  return { id: resource.id, ...attributes } as T
}

export function deserializeCollection<T extends { id: string }>(
  doc: JsonApiCollectionDocument,
  fieldMap?: Record<string, keyof T>
): T[] {
  return (doc.data ?? []).map((resource) => deserializeResource<T>(resource, fieldMap))
}

export function deserializeSingle<T extends { id: string }>(
  doc: JsonApiDocument | JsonApiCollectionDocument,
  targetId?: string,
  fieldMap?: Record<string, keyof T>
): T | null {
  if (Array.isArray(doc.data)) {
    if (doc.data.length === 0) return null
    const resource = targetId ? doc.data.find((item) => item.id === targetId) : doc.data[0]
    return resource ? deserializeResource<T>(resource, fieldMap) : null
  }
  if (targetId && doc.data.id !== targetId) return null
  return deserializeResource<T>(doc.data, fieldMap)
}

const SERIALIZE_EXCLUDED_FIELDS = ['id', 'createdAt', 'updatedAt'] as const

export function serializeResource<T extends { id: string }>(
  type: JsonApiResourceType,
  model: T,
  excludeFields?: (keyof T)[]
): JsonApiDocument {
  const excluded = new Set<string>([
    ...SERIALIZE_EXCLUDED_FIELDS,
    ...((excludeFields as string[]) ?? [])
  ])
  const reverseMap = REVERSE_ATTRIBUTE_MAPS[type] ?? {}
  const attributes: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(model)) {
    if (excluded.has(key)) continue
    attributes[reverseMap[key] ?? decamelize(key)] = value
  }
  return { data: { id: model.id, type, attributes } }
}
