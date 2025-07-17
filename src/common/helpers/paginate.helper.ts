// src/utils/paginate.js

export async function paginate(
  model,
  { where = {}, page = 1, limit = 10, orderBy = '', select = '', include = '' },
) {
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      skip,
      take: limitNumber,
      ...(orderBy ? { orderBy } : {}),
      ...(select ? { select } : {}),
      ...(include ? { include } : {}),
    }),
    model.count({ where }),
  ]);

  return {
    currentPage: pageNumber,
    limit: limitNumber,
    total,
    data,
  };
}
