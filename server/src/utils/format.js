/**
 * Normalizes Prisma entities by ensuring `_id` is populated alongside `id`
 * for seamless compatibility with frontend components expecting MongoDB _id.
 */
function toLegacyDoc(item) {
  if (!item) return item;
  if (Array.isArray(item)) {
    return item.map(toLegacyDoc);
  }
  if (typeof item === 'object' && item !== null && !(item instanceof Date)) {
    const copy = { ...item };
    if (copy.id && !copy._id) {
      copy._id = copy.id;
    }
    return copy;
  }
  return item;
}

module.exports = { toLegacyDoc };
